import React from 'react';
import { X, Keyboard, Play, Square, Repeat, Eye, Gauge, Volume2 } from 'lucide-react';

export default function HotkeysModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause score playback', icon: <Play size={16} color="var(--primary)" /> },
    { key: 'Esc', desc: 'Stop playback and reset cursor to start', icon: <Square size={16} color="var(--text-muted)" /> },
    { key: 'M', desc: 'Toggle Mute on currently selected track', icon: <Volume2 size={16} color="#ef4444" /> },
    { key: 'S', desc: 'Toggle Solo on currently selected track', icon: <Volume2 size={16} color="#eab308" /> },
    { key: '[  /  ]', desc: 'Decrease / Increase playback speed', icon: <Gauge size={16} color="var(--accent-cyan)" /> },
    { key: 'L', desc: 'Toggle bar section looping', icon: <Repeat size={16} color="var(--accent-purple)" /> },
    { key: 'F', desc: 'Toggle interactive 22-fret neck visualizer', icon: <Eye size={16} color="var(--primary)" /> },
    { key: '?', desc: 'Open / Close Keyboard Shortcuts Cheat Sheet', icon: <Keyboard size={16} color="var(--text-main)" /> },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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
              <Keyboard size={20} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Musician Keyboard Shortcuts</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hands-free controls while playing your instrument</p>
            </div>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {shortcuts.map((sc, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {sc.icon}
                <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{sc.desc}</span>
              </div>
              <kbd style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--primary)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}>
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>Got It</button>
        </div>
      </div>
    </div>
  );
}
