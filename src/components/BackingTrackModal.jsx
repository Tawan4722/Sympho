import React, { useState } from 'react';
import { X, Music, Sliders, Check, HelpCircle, Link as LinkIcon } from 'lucide-react';
import YoutubeIcon from './YoutubeIcon';

export default function BackingTrackModal({
  isOpen,
  onClose,
  backingTrackInfo,
  onSaveBackingTrack,
  onClearBackingTrack
}) {
  const [url, setUrl] = useState(backingTrackInfo?.url || '');
  const [offsetMs, setOffsetMs] = useState(backingTrackInfo?.offsetMs || 0);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveBackingTrack({
      url,
      offsetMs: Number(offsetMs) || 0
    });
    onClose();
  };

  const handleNudge = (deltaMs) => {
    setOffsetMs(prev => Number(prev) + deltaMs);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(250, 92, 44, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(250, 92, 44, 0.3)'
            }}>
              <YoutubeIcon size={20} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Backing Track & YouTube Sync</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Link audio/video backing track to score</p>
            </div>
          </div>

          <button 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* YouTube / Audio URL Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LinkIcon size={14} color="var(--primary)" />
              YouTube Video or Direct Audio File URL
            </label>
            <input 
              type="text"
              placeholder="e.g. https://www.youtube.com/watch?v=NlprozGcs80 or https://site.com/track.mp3"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tip: Paste any YouTube backing track URL. The tab cursor will play in sync with the video!
            </p>
          </div>

          {/* Sync Time Offset Calibrator (+/- ms) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={14} color="var(--accent-cyan)" />
                Time Offset Calibration (ms)
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: offsetMs !== 0 ? 'var(--primary)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {offsetMs > 0 ? `+${offsetMs}` : offsetMs} ms
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
              If the YouTube video intro starts earlier or later than measure 1, use offset to lock in the beat:
            </p>

            {/* Quick Nudge Preset Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleNudge(-1000)}>-1000ms</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleNudge(-100)}>-100ms</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setOffsetMs(0)}>Reset (0ms)</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleNudge(100)}>+100ms</button>
              <button type="button" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleNudge(1000)}>+1000ms</button>
            </div>
          </div>

          {/* Modal Action Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            {backingTrackInfo?.url && (
              <button 
                type="button"
                className="btn btn-secondary"
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
                onClick={() => {
                  onClearBackingTrack();
                  setUrl('');
                  setOffsetMs(0);
                  onClose();
                }}
              >
                Remove Backing Track
              </button>
            )}

            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Check size={16} />
                <span>Save Sync Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
