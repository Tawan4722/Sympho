import React, { useEffect, useRef, useState } from 'react';
import * as alphaTab from '@coderline/alphatab';

export default function ScoreViewer({
  songData,
  customFileBuffer,
  selectedTrackIndex,
  layoutMode = 'Page', // 'Page' or 'Horizontal'
  staveProfile = 'Default', // 'Default', 'Tab', 'Score'
  zoomScale = 1.0,
  masterVolume = 1.0,
  onTracksLoaded,
  onPlaybackStateChange,
  onTimeUpdate,
  onActiveNotesUpdate,
  onTuningUpdate,
  apiRef
}) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing SoundFont & Tab Engine...');

  const settingsPropsRef = useRef({ layoutMode, staveProfile, zoomScale });
  useEffect(() => {
    settingsPropsRef.current = { layoutMode, staveProfile, zoomScale };
  });

  // Store callback refs to avoid re-triggering main useEffect
  const callbacksRef = useRef({
    onTracksLoaded,
    onPlaybackStateChange,
    onTimeUpdate,
    onActiveNotesUpdate,
    onTuningUpdate
  });

  useEffect(() => {
    callbacksRef.current = {
      onTracksLoaded,
      onPlaybackStateChange,
      onTimeUpdate,
      onActiveNotesUpdate,
      onTuningUpdate
    };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const initialSettings = settingsPropsRef.current;

    // Initialize AlphaTab Engine
    const settings = {
      core: {
        fontDirectory: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/font/',
        soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2'
      },
      player: {
        enablePlayer: true,
        enableCursor: true,
        enableSoundFont: true
      },
      display: {
        staveProfile: initialSettings.staveProfile,
        layoutMode: initialSettings.layoutMode === 'Horizontal' ? 'Horizontal' : 'Page',
        scale: initialSettings.zoomScale
      }
    };

    const api = new alphaTab.AlphaTabApi(containerRef.current, settings);
    if (apiRef) apiRef.current = api;

    // Register Event Handlers
    api.error?.on((err) => {
      console.warn("AlphaTab engine error:", err);
      setIsLoading(false);
    });

    api.soundFontLoad?.on((e) => {
      if (e && e.total > 0) {
        setLoadingText(`Downloading SoundFont Instruments (${Math.round((e.loaded / e.total) * 100)}%)...`);
      }
    });

    api.soundFontLoaded?.on(() => {
      setIsLoading(false);
    });

    api.scoreLoaded?.on((score) => {
      setIsLoading(false);
      if (score && score.tracks) {
        const tracksInfo = score.tracks.map((t, idx) => ({
          index: idx,
          name: t.name || `Track ${idx + 1}`,
          volume: t.playbackInfo?.volume ? t.playbackInfo.volume / 16 : 0.8,
          isMuted: t.playbackInfo?.isMute || false,
          isSolo: t.playbackInfo?.isSolo || false,
          tuning: t.staves?.[0]?.tuning || t.tuning || []
        }));

        callbacksRef.current.onTracksLoaded?.(tracksInfo, score.masterBars ? score.masterBars.length : 1);
        
        if (score.tracks[0]) {
          const trackTuning = score.tracks[0].staves?.[0]?.tuning || score.tracks[0].tuning || [];
          callbacksRef.current.onTuningUpdate?.(trackTuning);
        }
      }
    });

    api.playerStateChanged?.on((args) => {
      if (args) {
        callbacksRef.current.onPlaybackStateChange?.(args.state === 1);
      }
    });

    api.playerPositionChanged?.on((args) => {
      if (args) {
        const timeSec = (args.currentTime || 0) / 1000;
        const totalSec = (args.endTime || 0) / 1000;
        callbacksRef.current.onTimeUpdate?.({
          currentTime: timeSec,
          totalTime: totalSec,
          currentBar: args.currentBar ? args.currentBar.index + 1 : 1
        });
      }
    });

    api.rendered?.on(() => {
      setIsLoading(false);
    });

    api.activeBeatsChanged?.on((args) => {
      if (args && args.activeBeats) {
        const notes = [];
        args.activeBeats.forEach(beat => {
          if (beat.notes) {
            beat.notes.forEach(note => {
              notes.push({
                string: note.string,
                fret: note.fret,
                isTied: note.isTied
              });
            });
          }
        });
        callbacksRef.current.onActiveNotesUpdate?.(notes);
      }
    });

    // Cleanup on unmount
    return () => {
      try {
        api.destroy();
      } catch (e) {
        console.warn("AlphaTab destroy cleanup:", e);
      }
    };
  }, [apiRef]);

  // Load Score when songData or customFileBuffer changes
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    setIsLoading(true);
    setLoadingText('Rendering Musical Tab Notation...');

    if (customFileBuffer) {
      try {
        api.load(customFileBuffer);
      } catch (err) {
        console.error("Failed to load custom tab file:", err);
        setIsLoading(false);
      }
    } else if (songData?.alphaTex) {
      try {
        api.tex(songData.alphaTex);
      } catch (err) {
        console.error("Failed to render AlphaTex:", err);
        setIsLoading(false);
      }
    }
  }, [songData, customFileBuffer, apiRef]);

  // Update render track when user selects a different track
  useEffect(() => {
    const api = apiRef?.current;
    if (!api || !api.score || selectedTrackIndex === undefined) return;
    
    const track = api.score.tracks[selectedTrackIndex];
    if (track) {
      api.renderTracks([track]);
      const trackTuning = track.staves?.[0]?.tuning || track.tuning || [];
      callbacksRef.current.onTuningUpdate?.(trackTuning);
    }
  }, [selectedTrackIndex, apiRef]);

  // Dynamically update layoutMode, staveProfile, zoomScale, masterVolume
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    try {
      api.settings.display.layoutMode = layoutMode === 'Horizontal' ? 'Horizontal' : 'Page';
      api.settings.display.staveProfile = staveProfile;
      api.settings.display.scale = zoomScale;
      api.masterVolume = masterVolume;
      api.updateSettings();
      api.render();
    } catch (e) {
      console.warn("Dynamic settings update notice:", e);
    }
  }, [layoutMode, staveProfile, zoomScale, masterVolume, apiRef]);

  return (
    <main style={{
      flex: 1,
      height: '100%',
      position: 'relative',
      margin: '0 12px 12px 0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(11, 13, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          borderRadius: 'var(--radius-md)'
        }}>
          <div className="badge badge-orange" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            {loadingText}
          </div>
        </div>
      )}

      {/* AlphaTab Canvas Surface */}
      <div 
        ref={containerRef} 
        className="alphatab-container"
      />
    </main>
  );
}
