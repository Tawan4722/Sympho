import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScoreViewer from './components/ScoreViewer';
import TrackMixer from './components/TrackMixer';
import PracticeToolbar from './components/PracticeToolbar';
import BackingTrackModal from './components/BackingTrackModal';
import YoutubeSyncPlayer from './components/YoutubeSyncPlayer';
import FretboardVisualizer from './components/FretboardVisualizer';
import InfoModal from './components/InfoModal';

import { DEMO_SONGS } from './utils/demoSongs';

export default function App() {
  // Song State
  const [currentSong, setCurrentSong] = useState(DEMO_SONGS[0]);
  const [customFileBuffer, setCustomFileBuffer] = useState(null);
  
  // Tab Tracks State
  const [tracks, setTracks] = useState([]);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentBar, setCurrentBar] = useState(1);
  const [totalBars, setTotalBars] = useState(1);

  // Practice Suite State
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);
  const [loopStartBar, setLoopStartBar] = useState(1);
  const [loopEndBar, setLoopEndBar] = useState(8);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [isCountInOn, setIsCountInOn] = useState(false);
  const [transpose, setTranspose] = useState(0);

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

  // AlphaTab API Ref
  const alphaTabApiRef = useRef(null);

  // Keyboard Shortcuts (Space for Play/Pause)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        handleTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

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

  // Handle Local GP/MusicXML File Upload (Client-side FileReader, NO server storage!)
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

  // Track Mixer Controls
  const handleSelectTrack = (trackIndex) => {
    setSelectedTrackIndex(trackIndex);
    if (isBackingTrackMode) {
      applyBackingTrackMute(trackIndex, tracks);
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

  // Backing Track Isolate Mode (Mutes target track so user plays live)
  const applyBackingTrackMute = (targetIdx, tracksList) => {
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
      applyBackingTrackMute(selectedTrackIndex, tracks);
    } else {
      // Restore unmute
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

  // Playback Operations
  const handleTogglePlay = () => {
    const api = alphaTabApiRef.current;
    if (!api) return;
    api.playPause();
  };

  const handleStop = () => {
    const api = alphaTabApiRef.current;
    if (!api) return;
    api.stop();
  };

  const handleChangeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    const api = alphaTabApiRef.current;
    if (api) {
      api.playbackSpeed = speed;
    }
  };

  const handleToggleLoop = () => {
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    const api = alphaTabApiRef.current;
    if (api) {
      api.isLooping = nextLoop;
      if (nextLoop) {
        api.setLoopRangeByBar(loopStartBar - 1, loopEndBar - 1);
      }
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
          onTracksLoaded={handleTracksLoaded}
          onPlaybackStateChange={setIsPlaying}
          onTimeUpdate={({ currentTime, totalTime, currentBar }) => {
            setCurrentTime(currentTime);
            setTotalTime(totalTime);
            setCurrentBar(currentBar);
          }}
          onActiveNotesUpdate={setActiveNotes}
          apiRef={alphaTabApiRef}
        />
      </div>

      {/* Fretboard Visualizer */}
      <FretboardVisualizer 
        isOpen={isFretboardOpen}
        onClose={() => setIsFretboardOpen(false)}
        activeNotes={activeNotes}
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
        isFretboardOpen={isFretboardOpen}
        onToggleFretboard={() => setIsFretboardOpen(!isFretboardOpen)}
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
    </div>
  );
}
