import React from 'react';
import { X, ShieldCheck, Music, Radio, Zap, Repeat } from 'lucide-react';
import YoutubeIcon from './YoutubeIcon';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>About SymphTab Pro</h2>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: '1.5', fontSize: '0.88rem' }}>
          {/* Privacy & Zero Storage Guarantee */}
          <div style={{ background: 'rgba(250, 92, 44, 0.1)', border: '1px solid rgba(250, 92, 44, 0.3)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> 100% Private - Zero Server Storage
            </h3>
            <p style={{ color: 'var(--text-main)' }}>
              No song files, GuitarPro tabs, or audio tracks are uploaded or stored on any server. Everything is parsed, rendered, and synthesized locally in your browser!
            </p>
          </div>

          {/* Key Features Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <YoutubeIcon size={18} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#fff' }}>YouTube & Audio Backing Track Sync:</strong>
                <p style={{ color: 'var(--text-muted)' }}>Paste any YouTube video or audio link. Adjust the time offset calibration (+/- ms) to sync tab measures with the video audio.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Radio size={18} color="var(--accent-purple)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#fff' }}>Backing Track Isolate Mode:</strong>
                <p style={{ color: 'var(--text-muted)' }}>One click automatically mutes your chosen target instrument (e.g. Lead Guitar) so you can play your guitar live over the backing track!</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Repeat size={18} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#fff' }}>Practice Suite:</strong>
                <p style={{ color: 'var(--text-muted)' }}>Speed control (0.25x - 1.50x), measure range looping, metronome click, count-in, pitch transposition, and live 22-fret neck visualizer.</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button className="btn btn-primary" onClick={onClose}>Got it, let's play!</button>
          </div>
        </div>
      </div>
    </div>
  );
}
