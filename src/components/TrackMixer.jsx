import React from 'react';
import { Volume2, Radio, Guitar, Disc, Music, Layers } from 'lucide-react';

export default function TrackMixer({
  tracks = [],
  selectedTrackIndex = 0,
  onSelectTrack,
  onToggleMute,
  onToggleSolo,
  onVolumeChange,
  isBackingTrackMode,
  onToggleBackingTrackMode
}) {

  // Helper to pick track icon based on instrument name
  const getTrackIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('drum') || n.includes('percussion')) return <Disc size={18} color="#00f2fe" />;
    if (n.includes('bass')) return <Guitar size={18} color="#9d4edd" />;
    if (n.includes('lead') || n.includes('solos') || n.includes('guitar')) return <Guitar size={18} color="#fa5c2c" />;
    return <Music size={18} color="#38bdf8" />;
  };

  return (
    <aside className="glass-panel" style={{
      width: '280px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      margin: '0 0 12px 12px',
      borderRadius: 'var(--radius-lg)',
      overflowY: 'auto'
    }}>
      {/* Sidebar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={18} color="var(--primary)" />
          <h2 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Instruments</h2>
        </div>
        <span className="badge badge-purple" style={{ fontSize: '0.68rem', whiteSpace: 'nowrap' }}>{tracks.length} Track{tracks.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Backing Track Mode Quick Toggle */}
      <div style={{
        background: isBackingTrackMode ? 'rgba(250, 92, 44, 0.15)' : 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${isBackingTrackMode ? 'var(--primary)' : 'var(--border-color)'}`,
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={16} color={isBackingTrackMode ? 'var(--primary)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isBackingTrackMode ? '#fff' : 'var(--text-muted)' }}>
              Backing Track Isolate Mode
            </span>
          </div>
          <button 
            className={`btn ${isBackingTrackMode ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            onClick={onToggleBackingTrackMode}
          >
            {isBackingTrackMode ? 'ACTIVE' : 'OFF'}
          </button>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
          Automatically mutes your selected instrument track so you can play along live!
        </p>
      </div>

      {/* Tracks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tracks.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
            Loading track instruments...
          </p>
        ) : (
          tracks.map((track, idx) => {
            const isSelected = selectedTrackIndex === idx;
            return (
              <div 
                key={track.index || idx}
                style={{
                  background: isSelected ? 'rgba(250, 92, 44, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? 'var(--primary-hover)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Track Title Header & Selector */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div 
                    onClick={() => onSelectTrack(idx)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}
                  >
                    {getTrackIcon(track.name)}
                    <span style={{
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#fff' : 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '150px'
                    }}>
                      {track.name || `Track ${idx + 1}`}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>VIEWING</span>
                  )}
                </div>

                {/* Controls Bar: Mute, Solo, Volume Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Mute Button */}
                  <button 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      background: track.isMuted ? '#ef4444' : 'rgba(255,255,255,0.08)',
                      color: track.isMuted ? '#fff' : 'var(--text-muted)'
                    }}
                    onClick={() => onToggleMute(idx)}
                    title="Mute Track"
                  >
                    M
                  </button>

                  {/* Solo Button */}
                  <button 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      background: track.isSolo ? '#eab308' : 'rgba(255,255,255,0.08)',
                      color: track.isSolo ? '#000' : 'var(--text-muted)'
                    }}
                    onClick={() => onToggleSolo(idx)}
                    title="Solo Track"
                  >
                    S
                  </button>

                  {/* Volume Slider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                    <Volume2 size={14} color="var(--text-muted)" />
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={track.volume ?? 0.8}
                      onChange={(e) => onVolumeChange(idx, parseFloat(e.target.value))}
                      style={{
                        flex: 1,
                        accentColor: 'var(--primary)',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
