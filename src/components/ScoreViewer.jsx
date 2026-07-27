import React, { useEffect, useRef, useState } from 'react';
import * as alphaTab from '@coderline/alphatab';

export default function ScoreViewer({
  songData,
  customFileBuffer,
  selectedTrackIndex,
  onTracksLoaded,
  onPlaybackStateChange,
  onTimeUpdate,
  onActiveNotesUpdate,
  apiRef
}) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing SoundFont & Tab Engine...');

  useEffect(() => {
    if (!containerRef.current) return;

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
        staveProfile: 'Default',
        scale: 1.0
      }
    };

    const api = new alphaTab.AlphaTabApi(containerRef.current, settings);
    if (apiRef) apiRef.current = api;

    // Register Event Handlers with optional chaining to prevent undefined property errors
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
          isSolo: t.playbackInfo?.isSolo || false
        }));
        onTracksLoaded(tracksInfo, score.masterBars ? score.masterBars.length : 1);
      }
    });

    api.playerStateChanged?.on((args) => {
      if (args) {
        onPlaybackStateChange(args.state === 1);
      }
    });

    api.playerPositionChanged?.on((args) => {
      if (args) {
        const timeSec = (args.currentTime || 0) / 1000;
        const totalSec = (args.endTime || 0) / 1000;
        onTimeUpdate({
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
        onActiveNotesUpdate(notes);
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
  }, []);

  // Load Score when songData or customFileBuffer changes
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    setIsLoading(true);
    setLoadingText('Rendering Musical Tab Notation...');

    if (customFileBuffer) {
      // Load binary GuitarPro or MusicXML file
      try {
        api.load(customFileBuffer);
      } catch (err) {
        console.error("Failed to load custom tab file:", err);
        setIsLoading(false);
      }
    } else if (songData?.alphaTex) {
      // Load AlphaTex string template
      try {
        api.tex(songData.alphaTex);
      } catch (err) {
        console.error("Failed to render AlphaTex:", err);
        setIsLoading(false);
      }
    }
  }, [songData, customFileBuffer]);

  // Update render track when user selects a different track
  useEffect(() => {
    const api = apiRef?.current;
    if (!api || !api.score || selectedTrackIndex === undefined) return;
    
    if (api.score.tracks[selectedTrackIndex]) {
      api.renderTracks([api.score.tracks[selectedTrackIndex]]);
    }
  }, [selectedTrackIndex]);

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
