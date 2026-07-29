import React from 'react';
import { 
  Play, Pause, Square, Repeat, Clock, 
  Volume2, Gauge, Eye, Zap, ZoomIn, ZoomOut, Flame, Keyboard 
} from 'lucide-react';

export default function PracticeToolbar({
  isPlaying,
  onTogglePlay,
  onStop,
  playbackSpeed,
  onChangeSpeed,
  isLooping,
  onToggleLoop,
  loopStartBar,
  loopEndBar,
  onSetLoopRange,
  isSpeedTrainerOn,
  onToggleSpeedTrainer,
  speedTrainerStep = 0.05,
  isMetronomeOn,
  onToggleMetronome,
  isCountInOn,
  onToggleCountIn,
  transpose,
  onChangeTranspose,
  currentBar,
  totalBars,
  currentTime,
  totalTime,
  layoutMode,
  onChangeLayoutMode,
  staveProfile,
  onChangeStaveProfile,
  zoomScale,
  onChangeZoomScale,
  masterVolume,
  onChangeMasterVolume,
  isFretboardOpen,
  onToggleFretboard,
  onOpenHotkeysModal
}) {

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <footer className="glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      margin: '0 12px 12px 12px',
      borderRadius: 'var(--radius-lg)',
      gap: '14px',
      flexWrap: 'wrap',
      zIndex: 100
    }}>
      {/* Primary Playback Controls & Bar Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="btn btn-primary btn-icon" 
          onClick={onTogglePlay}
          style={{ width: '48px', height: '48px', borderRadius: '50%' }}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" style={{ marginLeft: '3px' }} />}
        </button>

        <button 
          className="btn btn-secondary btn-icon"
          onClick={onStop}
          title="Stop & Reset to Start (Esc)"
        >
          <Square size={16} fill="var(--text-muted)" />
        </button>

        {/* Time & Bar Indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginLeft: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700 }}>
            <span>{formatTime(currentTime)}</span>
            <span style={{ color: 'var(--text-dim)' }}>/</span>
            <span style={{ color: 'var(--text-muted)' }}>{formatTime(totalTime)}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            Bar {currentBar} / {totalBars || '--'}
          </div>
        </div>

        {/* Master Volume Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <Volume2 size={15} color="var(--primary)" />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={masterVolume}
            onChange={(e) => onChangeMasterVolume(parseFloat(e.target.value))}
            title="Master Playback Synth Volume"
            style={{ width: '60px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Practice Suite: Speed, Speed Trainer, Loop & Click */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Speed Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <Gauge size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Speed:</span>
          <select 
            value={playbackSpeed} 
            onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
            style={{
              background: 'transparent',
              color: '#fff',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="0.25" style={{ background: 'var(--bg-sidebar)' }}>0.25x</option>
            <option value="0.5" style={{ background: 'var(--bg-sidebar)' }}>0.50x</option>
            <option value="0.75" style={{ background: 'var(--bg-sidebar)' }}>0.75x</option>
            <option value="0.9" style={{ background: 'var(--bg-sidebar)' }}>0.90x</option>
            <option value="1.0" style={{ background: 'var(--bg-sidebar)' }}>1.00x (Normal)</option>
            <option value="1.25" style={{ background: 'var(--bg-sidebar)' }}>1.25x</option>
            <option value="1.5" style={{ background: 'var(--bg-sidebar)' }}>1.50x</option>
          </select>
        </div>

        {/* Automated Speed Trainer */}
        <button 
          className={`btn ${isSpeedTrainerOn ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleSpeedTrainer}
          title="Auto-increment speed on each loop completion"
          style={{
            borderColor: isSpeedTrainerOn ? 'var(--primary)' : 'var(--border-color)',
            background: isSpeedTrainerOn ? 'rgba(250, 92, 44, 0.25)' : 'rgba(255, 255, 255, 0.05)'
          }}
        >
          <Flame size={16} color={isSpeedTrainerOn ? '#fa5c2c' : 'var(--text-muted)'} />
          <span>Trainer</span>
          {isSpeedTrainerOn && <span className="badge badge-orange" style={{ fontSize: '0.62rem' }}>+{Math.round(speedTrainerStep * 100)}%</span>}
        </button>

        {/* Loop A/B Controls */}
        <button 
          className={`btn ${isLooping ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleLoop}
          title="Toggle Section Looping (L)"
        >
          <Repeat size={16} />
          <span>Loop</span>
        </button>

        {isLooping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '2px 6px', fontSize: '0.72rem' }}
              onClick={() => onSetLoopRange(currentBar, loopEndBar)}
              title="Set Loop Start [A] at current bar"
            >
              Set A ({currentBar})
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '2px 6px', fontSize: '0.72rem' }}
              onClick={() => onSetLoopRange(loopStartBar, Math.max(currentBar, loopStartBar))}
              title="Set Loop End [B] at current bar"
            >
              Set B ({currentBar})
            </button>
            <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>Bars:</span>
            <input 
              type="number" 
              min="1" 
              max={totalBars}
              value={loopStartBar}
              onChange={(e) => onSetLoopRange(parseInt(e.target.value) || 1, loopEndBar)}
              style={{ width: '40px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', padding: '2px', borderRadius: '4px', textAlign: 'center' }}
            />
            <span>-</span>
            <input 
              type="number" 
              min={loopStartBar} 
              max={totalBars}
              value={loopEndBar}
              onChange={(e) => onSetLoopRange(loopStartBar, parseInt(e.target.value) || totalBars)}
              style={{ width: '40px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', padding: '2px', borderRadius: '4px', textAlign: 'center' }}
            />
          </div>
        )}

        {/* Metronome */}
        <button 
          className={`btn ${isMetronomeOn ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleMetronome}
          title="Metronome Click"
        >
          <Clock size={16} />
          <span>Click</span>
        </button>

        {/* Count-In */}
        <button 
          className={`btn ${isCountInOn ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleCountIn}
          title="1-Bar Count-in before playback"
        >
          <Zap size={16} />
          <span>Count-in</span>
        </button>

        {/* Transpose */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Key:</span>
          <button 
            style={{ border: 'none', background: 'transparent', color: '#fff', fontWeight: 700, cursor: 'pointer', padding: '0 4px' }}
            onClick={() => onChangeTranspose(transpose - 1)}
          >-</button>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '22px', textAlign: 'center', color: transpose !== 0 ? 'var(--primary)' : '#fff' }}>
            {transpose > 0 ? `+${transpose}` : transpose}
          </span>
          <button 
            style={{ border: 'none', background: 'transparent', color: '#fff', fontWeight: 700, cursor: 'pointer', padding: '0 4px' }}
            onClick={() => onChangeTranspose(transpose + 1)}
          >+</button>
        </div>
      </div>

      {/* Score View Mode, Notation & Visualizers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Layout Mode Selector (Horizontal vs Page) */}
        <select 
          value={layoutMode}
          onChange={(e) => onChangeLayoutMode(e.target.value)}
          style={{
            background: 'rgba(0,0,0,0.4)',
            color: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          title="Layout Mode: Page (vertical) vs Horizontal (continuous)"
        >
          <option value="Page" style={{ background: 'var(--bg-sidebar)' }}>📄 Page View</option>
          <option value="Horizontal" style={{ background: 'var(--bg-sidebar)' }}>↔️ Horizontal Scroll</option>
        </select>

        {/* Notation Profile (Tab + Score, Tab, Score) */}
        <select 
          value={staveProfile}
          onChange={(e) => onChangeStaveProfile(e.target.value)}
          style={{
            background: 'rgba(0,0,0,0.4)',
            color: '#fff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          title="Notation View Mode"
        >
          <option value="Default" style={{ background: 'var(--bg-sidebar)' }}>🎼 Tab + Notation</option>
          <option value="Tab" style={{ background: 'var(--bg-sidebar)' }}>🎸 Tab Only</option>
          <option value="Score" style={{ background: 'var(--bg-sidebar)' }}>🎵 Score Only</option>
        </select>

        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <button 
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
            onClick={() => onChangeZoomScale(Math.max(0.6, zoomScale - 0.1))}
            title="Zoom Out Score"
          >
            <ZoomOut size={14} />
          </button>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: '34px', textAlign: 'center' }}>
            {Math.round(zoomScale * 100)}%
          </span>
          <button 
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
            onClick={() => onChangeZoomScale(Math.min(2.0, zoomScale + 0.1))}
            title="Zoom In Score"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Toggle Fretboard */}
        <button 
          className={`btn ${isFretboardOpen ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleFretboard}
          title="Toggle interactive neck visualizer (F)"
        >
          <Eye size={16} />
          <span>Fretboard</span>
        </button>

        {/* Musician Hotkeys Button */}
        <button 
          className="btn btn-secondary btn-icon"
          onClick={onOpenHotkeysModal}
          title="Musician Keyboard Shortcuts Cheat Sheet (?)"
        >
          <Keyboard size={16} />
        </button>
      </div>
    </footer>
  );
}
