import React from 'react';
import { 
  Play, Pause, Square, Repeat, Clock, FastForward, 
  Volume2, Music, Gauge, Disc, Eye, Zap 
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
  isFretboardOpen,
  onToggleFretboard
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
      gap: '16px',
      flexWrap: 'wrap',
      zIndex: 100
    }}>
      {/* Primary Playback Controls */}
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
          title="Stop & Reset to Start"
        >
          <Square size={16} fill="var(--text-muted)" />
        </button>

        {/* Time & Bar Indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginLeft: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700 }}>
            <span>{formatTime(currentTime)}</span>
            <span style={{ color: 'var(--text-dim)' }}>/</span>
            <span style={{ color: 'var(--text-muted)' }}>{formatTime(totalTime)}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            Bar {currentBar} / {totalBars || '--'}
          </div>
        </div>
      </div>

      {/* Speed & Practice Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

        {/* Loop A/B Controls */}
        <button 
          className={`btn ${isLooping ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleLoop}
          title="Toggle Section Looping"
        >
          <Repeat size={16} />
          <span>Loop</span>
        </button>

        {isLooping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Bars:</span>
            <input 
              type="number" 
              min="1" 
              max={totalBars}
              value={loopStartBar}
              onChange={(e) => onSetLoopRange(parseInt(e.target.value) || 1, loopEndBar)}
              style={{ width: '45px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', padding: '2px 4px', borderRadius: '4px', textAlign: 'center' }}
            />
            <span>-</span>
            <input 
              type="number" 
              min={loopStartBar} 
              max={totalBars}
              value={loopEndBar}
              onChange={(e) => onSetLoopRange(loopStartBar, parseInt(e.target.value) || totalBars)}
              style={{ width: '45px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)', color: '#fff', padding: '2px 4px', borderRadius: '4px', textAlign: 'center' }}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pitch:</span>
          <button 
            style={{ border: 'none', background: 'transparent', color: '#fff', fontWeight: 700, cursor: 'pointer', padding: '0 4px' }}
            onClick={() => onChangeTranspose(transpose - 1)}
          >-</button>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '24px', textAlign: 'center', color: transpose !== 0 ? 'var(--primary)' : '#fff' }}>
            {transpose > 0 ? `+${transpose}` : transpose}
          </span>
          <button 
            style={{ border: 'none', background: 'transparent', color: '#fff', fontWeight: 700, cursor: 'pointer', padding: '0 4px' }}
            onClick={() => onChangeTranspose(transpose + 1)}
          >+</button>
        </div>
      </div>

      {/* Auxiliary Visualizers */}
      <div>
        <button 
          className={`btn ${isFretboardOpen ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleFretboard}
        >
          <Eye size={16} />
          <span>Fretboard</span>
        </button>
      </div>
    </footer>
  );
}
