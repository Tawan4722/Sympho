import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ScoreViewer from './components/ScoreViewer';
import TrackMixer from './components/TrackMixer';
import PracticeToolbar from './components/PracticeToolbar';
import BackingTrackModal from './components/BackingTrackModal';
import YoutubeSyncPlayer from './components/YoutubeSyncPlayer';
import FretboardVisualizer from './components/FretboardVisualizer';
import InfoModal from './components/InfoModal';
import HotkeysModal from './components/HotkeysModal';

import { DEMO_SONGS } from './utils/demoSongs';

export default function App() {
  // Song State
  const [currentSong, setCurrentSong] = useState(DEMO_SONGS[0]);
  const [customFileBuffer, setCustomFileBuffer] = useState(null);
  
  // Tab Tracks State
  const [tracks, setTracks] = useState([]);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [trackTuning, setTrackTuning] = useState([]);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentBar, setCurrentBar] = useState(1);
  const [totalBars, setTotalBars] = useState(1);

  // Score View & Layout Options
  const [layoutMode, setLayoutMode] = useState('Page'); // 'Page' or 'Horizontal'
  const [staveProfile, setStaveProfile] = useState('Default'); // 'Default', 'Tab', 'Score'
  const [zoomScale, setZoomScale] = useState(1.0);
  const [masterVolume, setMasterVolume] = useState(1.0);

  // Practice Suite State
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);
  const [loopStartBar, setLoopStartBar] = useState(1);
  const [loopEndBar, setLoopEndBar] = useState(8);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [isCountInOn, setIsCountInOn] = useState(false);
  const [transpose, setTranspose] = useState(0);

  // Automated Speed Trainer Mode
  const [isSpeedTrainerOn, setIsSpeedTrainerOn] = useState(false);
  const [speedTrainerStep, setSpeedTrainerStep] = useState(0.05);

  // Backing Track & Sync State
  const [backingTrackInfo, setBackingTrackInfo] = useState({
    url: DEMO_SONGS[0].youtubeUrl || '',
    offsetMs: DEMO_SONGS[0].defaultOffset || 0
  });
  const [isBackingTrackMode, setIsBackingTrackMode] = useState(false);

  // Visualizers & Modals
  const [isFretboardOpen, setIsFretboardOpen] = useState(true);
  const [activeNotes, setActiveNotes] = useState([]);
  const [isBackingTrackModalOpen, setIsBackingTrackModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isHotkeysModalOpen, setIsHotkeysModalOpen] = useState(false);

  // AlphaTab API Ref
  const alphaTabApiRef = useRef(null);
  const previousBarRef = useRef(1);

  // Playback Operations
  const handleTogglePlay = useCallback(() => {
    const api = alphaTabApiRef.current;
    if (!api) return;
    api.playPause();
  }, []);

  const handleStop = useCallback(() => {
    const api = alphaTabApiRef.current;
    if (!api) return;
    api.stop();
  }, []);

  const handleChangeSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
    const api = alphaTabApiRef.current;
    if (api) {
      api.playbackSpeed = speed;
    }
  }, []);

  const handleToggleLoop = useCallback(() => {
    setIsLooping(prev => {
      const nextLoop = !prev;
      const api = alphaTabApiRef.current;
      if (api) {
        api.isLooping = nextLoop;
        if (nextLoop) {
          api.setLoopRangeByBar(loopStartBar - 1, loopEndBar - 1);
        }
      }
      return nextLoop;
    });
  }, [loopStartBar, loopEndBar]);

  // Global Musician Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        handleStop();
      } else if (e.key === '[' || e.key === '{') {
        e.preventDefault();
        handleChangeSpeed(Math.max(0.25, parseFloat((playbackSpeed - 0.1).toFixed(2))));
      } else if (e.key === ']' || e.key === '}') {
        e.preventDefault();
        handleChangeSpeed(Math.min(1.5, parseFloat((playbackSpeed + 0.1).toFixed(2))));
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleToggleLoop();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFretboardOpen(prev => !prev);
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsHotkeysModalOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (selectedTrackIndex !== undefined) handleToggleMute(selectedTrackIndex);
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (selectedTrackIndex !== undefined) handleToggleSolo(selectedTrackIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleStop, handleChangeSpeed, handleToggleLoop, playbackSpeed, selectedTrackIndex]);

  // Handle Speed Trainer Increment on Loop Wrap
  useEffect(() => {
    if (isSpeedTrainerOn && isPlaying && isLooping) {
      if (previousBarRef.current > currentBar && currentBar === loopStartBar) {
        // Loop restarted, increment speed!
        handleChangeSpeed(Math.min(1.5, parseFloat((playbackSpeed + speedTrainerStep).toFixed(2))));
      }
    }
    previousBarRef.current = currentBar;
  }, [currentBar, isSpeedTrainerOn, isPlaying, isLooping, loopStartBar, playbackSpeed, speedTrainerStep, handleChangeSpeed]);

  // Handle Demo Song Switch
  const handleSelectDemoSong = (song) => {
    setCurrentSong(song);
    setCustomFileBuffer(null);
    setBackingTrackInfo({
      url: song.youtubeUrl || '',
      offsetMs: song.defaultOffset || 0
    });
    if (isPlaying) {
      alphaTabApiRef.current?.pause();
    }
  };

  // Handle Local GP/MusicXML File Upload
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target.result;
      setCustomFileBuffer(buffer);
      setCurrentSong({
        id: 'custom',
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Local Import'
      });
      setBackingTrackInfo({ url: '', offsetMs: 0 });
      if (isPlaying) {
        alphaTabApiRef.current?.pause();
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Tracks Loaded Hook
  const handleTracksLoaded = (loadedTracks, barCount) => {
    setTracks(loadedTracks);
    setSelectedTrackIndex(0);
    setTotalBars(barCount || 1);
    setLoopEndBar(Math.min(8, barCount || 8));
  };

  // Dynamic Track Selection & Tuning
  const handleSelectTrack = (trackIndex) => {
    setSelectedTrackIndex(trackIndex);
    if (isBackingTrackMode) {
      applyBackingTrackMute(trackIndex);
    }
  };

  const handleToggleMute = (trackIndex) => {
    const api = alphaTabApiRef.current;
    if (!api || !api.score?.tracks[trackIndex]) return;

    const track = api.score.tracks[trackIndex];
    track.playbackInfo.isMute = !track.playbackInfo.isMute;
    api.changeTrackMute([track], track.playbackInfo.isMute);

    setTracks(prev => prev.map((t, idx) => 
      idx === trackIndex ? { ...t, isMuted: track.playbackInfo.isMute } : t
    ));
  };

  const handleToggleSolo = (trackIndex) => {
    const api = alphaTabApiRef.current;
    if (!api || !api.score?.tracks[trackIndex]) return;

    const track = api.score.tracks[trackIndex];
    track.playbackInfo.isSolo = !track.playbackInfo.isSolo;
    api.changeTrackSolo([track], track.playbackInfo.isSolo);

    setTracks(prev => prev.map((t, idx) => 
      idx === trackIndex ? { ...t, isSolo: track.playbackInfo.isSolo } : t
    ));
  };

  const handleVolumeChange = (trackIndex, volume) => {
    const api = alphaTabApiRef.current;
    if (!api || !api.score?.tracks[trackIndex]) return;

    const track = api.score.tracks[trackIndex];
    track.playbackInfo.volume = Math.round(volume * 16);
    api.changeTrackVolume([track], track.playbackInfo.volume);

    setTracks(prev => prev.map((t, idx) => 
      idx === trackIndex ? { ...t, volume } : t
    ));
  };

  // Backing Track Isolate Mode
  const applyBackingTrackMute = (targetIdx) => {
    const api = alphaTabApiRef.current;
    if (!api || !api.score) return;

    api.score.tracks.forEach((track, idx) => {
      const shouldMute = idx === targetIdx;
      track.playbackInfo.isMute = shouldMute;
      api.changeTrackMute([track], shouldMute);
    });

    setTracks(prev => prev.map((t, idx) => ({
      ...t,
      isMuted: idx === targetIdx
    })));
  };

  const handleToggleBackingTrackMode = () => {
    const nextMode = !isBackingTrackMode;
    setIsBackingTrackMode(nextMode);

    if (nextMode) {
      applyBackingTrackMute(selectedTrackIndex);
    } else {
      const api = alphaTabApiRef.current;
      if (api && api.score) {
        api.score.tracks.forEach(track => {
          track.playbackInfo.isMute = false;
          api.changeTrackMute([track], false);
        });
      }
      setTracks(prev => prev.map(t => ({ ...t, isMuted: false })));
    }
  };

  const handleSetLoopRange = (start, end) => {
    setLoopStartBar(start);
    setLoopEndBar(end);
    const api = alphaTabApiRef.current;
    if (api && isLooping) {
      api.setLoopRangeByBar(start - 1, end - 1);
    }
  };

  const handleToggleMetronome = () => {
    const nextVal = !isMetronomeOn;
    setIsMetronomeOn(nextVal);
    const api = alphaTabApiRef.current;
    if (api) {
      api.metronomeVolume = nextVal ? 1 : 0;
    }
  };

  const handleToggleCountIn = () => {
    const nextVal = !isCountInOn;
    setIsCountInOn(nextVal);
    const api = alphaTabApiRef.current;
    if (api) {
      api.countInVolume = nextVal ? 1 : 0;
    }
  };

  const handleChangeTranspose = (newTranspose) => {
    setTranspose(newTranspose);
    const api = alphaTabApiRef.current;
    if (api) {
      api.transpositionPitch = newTranspose;
    }
  };

  const handlePrintScore = () => {
    const api = alphaTabApiRef.current;
    if (api) {
      api.print();
    } else {
      window.print();
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar 
        currentSong={currentSong}
        onSelectDemoSong={handleSelectDemoSong}
        onFileUpload={handleFileUpload}
        onOpenBackingTrackModal={() => setIsBackingTrackModalOpen(true)}
        backingTrackInfo={backingTrackInfo}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        onOpenHotkeysModal={() => setIsHotkeysModalOpen(true)}
        onPrintScore={handlePrintScore}
      />

      {/* Main Workspace (Mixer + Score Viewer) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', marginTop: '12px' }}>
        <TrackMixer 
          tracks={tracks}
          selectedTrackIndex={selectedTrackIndex}
          onSelectTrack={handleSelectTrack}
          onToggleMute={handleToggleMute}
          onToggleSolo={handleToggleSolo}
          onVolumeChange={handleVolumeChange}
          isBackingTrackMode={isBackingTrackMode}
          onToggleBackingTrackMode={handleToggleBackingTrackMode}
        />

        <ScoreViewer 
          songData={currentSong}
          customFileBuffer={customFileBuffer}
          selectedTrackIndex={selectedTrackIndex}
          layoutMode={layoutMode}
          staveProfile={staveProfile}
          zoomScale={zoomScale}
          masterVolume={masterVolume}
          onTracksLoaded={handleTracksLoaded}
          onPlaybackStateChange={setIsPlaying}
          onTimeUpdate={({ currentTime, totalTime, currentBar }) => {
            setCurrentTime(currentTime);
            setTotalTime(totalTime);
            setCurrentBar(currentBar);
          }}
          onActiveNotesUpdate={setActiveNotes}
          onTuningUpdate={setTrackTuning}
          apiRef={alphaTabApiRef}
        />
      </div>

      {/* Fretboard Visualizer */}
      <FretboardVisualizer 
        isOpen={isFretboardOpen}
        onClose={() => setIsFretboardOpen(false)}
        activeNotes={activeNotes}
        trackTuning={trackTuning}
      />

      {/* Floating Bottom Practice Toolbar */}
      <PracticeToolbar 
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onStop={handleStop}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={handleChangeSpeed}
        isLooping={isLooping}
        onToggleLoop={handleToggleLoop}
        loopStartBar={loopStartBar}
        loopEndBar={loopEndBar}
        onSetLoopRange={handleSetLoopRange}
        isSpeedTrainerOn={isSpeedTrainerOn}
        onToggleSpeedTrainer={() => setIsSpeedTrainerOn(!isSpeedTrainerOn)}
        speedTrainerStep={speedTrainerStep}
        onChangeSpeedTrainerStep={setSpeedTrainerStep}
        isMetronomeOn={isMetronomeOn}
        onToggleMetronome={handleToggleMetronome}
        isCountInOn={isCountInOn}
        onToggleCountIn={handleToggleCountIn}
        transpose={transpose}
        onChangeTranspose={handleChangeTranspose}
        currentBar={currentBar}
        totalBars={totalBars}
        currentTime={currentTime}
        totalTime={totalTime}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        staveProfile={staveProfile}
        onChangeStaveProfile={setStaveProfile}
        zoomScale={zoomScale}
        onChangeZoomScale={setZoomScale}
        masterVolume={masterVolume}
        onChangeMasterVolume={setMasterVolume}
        isFretboardOpen={isFretboardOpen}
        onToggleFretboard={() => setIsFretboardOpen(!isFretboardOpen)}
        onOpenHotkeysModal={() => setIsHotkeysModalOpen(true)}
      />

      {/* YouTube Backing Track Player Widget */}
      <YoutubeSyncPlayer 
        backingTrackInfo={backingTrackInfo}
        isPlaying={isPlaying}
        currentTime={currentTime}
        playbackSpeed={playbackSpeed}
      />

      {/* Modals */}
      <BackingTrackModal 
        isOpen={isBackingTrackModalOpen}
        onClose={() => setIsBackingTrackModalOpen(false)}
        backingTrackInfo={backingTrackInfo}
        onSaveBackingTrack={setBackingTrackInfo}
        onClearBackingTrack={() => setBackingTrackInfo({ url: '', offsetMs: 0 })}
      />

      <InfoModal 
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      <HotkeysModal 
        isOpen={isHotkeysModalOpen}
        onClose={() => setIsHotkeysModalOpen(false)}
      />
    </div>
  );
}
