import React, { useRef } from 'react';
import { Music, Upload, Volume2, Sparkles, FolderOpen, Info } from 'lucide-react';
import YoutubeIcon from './YoutubeIcon';
import { DEMO_SONGS } from '../utils/demoSongs';

export default function Navbar({
  currentSong,
  onSelectDemoSong,
  onFileUpload,
  onOpenBackingTrackModal,
  backingTrackInfo,
  onOpenInfoModal
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = ''; // reset
    }
  };

  return (
    <header className="navbar glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      margin: '12px 12px 0 12px',
      borderRadius: 'var(--radius-lg)',
      zIndex: 100
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--primary), #e04412)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px var(--primary-glow)'
        }}>
          <Music size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(90deg, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SymphTab <span className="badge badge-orange">Pro</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Tab Engine & Backing Track Sync</p>
        </div>
      </div>

      {/* Song Picker & Demo Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <FolderOpen size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Song:</span>
          <select 
            value={currentSong.id || 'custom'} 
            onChange={(e) => {
              const selected = DEMO_SONGS.find(s => s.id === e.target.value);
              if (selected) onSelectDemoSong(selected);
            }}
            style={{
              background: 'transparent',
              color: '#fff',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '220px'
            }}
          >
            {DEMO_SONGS.map(song => (
              <option key={song.id} value={song.id} style={{ background: 'var(--bg-sidebar)', color: '#fff' }}>
                {song.title} ({song.artist})
              </option>
            ))}
            {currentSong.id === 'custom' && (
              <option value="custom" style={{ background: 'var(--bg-sidebar)', color: '#fff' }}>
                📂 {currentSong.title || 'Loaded File'}
              </option>
            )}
          </select>
        </div>

        {/* Upload Custom Tab File (.gp, .gpx, .gp5, .xml) */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".gp,.gp3,.gp4,.gp5,.gpx,.gp,.xml,.mxl" 
          onChange={handleFileChange}
        />
        <button 
          className="btn btn-secondary" 
          onClick={() => fileInputRef.current?.click()}
          title="Load your own GuitarPro or MusicXML file (Client-side only)"
        >
          <Upload size={16} />
          <span>Upload GP File</span>
        </button>

        {/* Backing Track Button */}
        <button 
          className={`btn ${backingTrackInfo?.url ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onOpenBackingTrackModal}
          style={{
            borderColor: backingTrackInfo?.url ? 'var(--primary)' : 'var(--border-color)',
            background: backingTrackInfo?.url ? 'rgba(250, 92, 44, 0.2)' : 'rgba(255, 255, 255, 0.05)'
          }}
        >
          <YoutubeIcon size={16} color={backingTrackInfo?.url ? '#fa5c2c' : '#fff'} />
          <span>{backingTrackInfo?.url ? 'Backing Track Synced' : 'Add Backing Track'}</span>
          {backingTrackInfo?.url && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>ACTIVE</span>}
        </button>

        {/* Info Modal Button */}
        <button className="btn btn-secondary btn-icon" onClick={onOpenInfoModal} title="Privacy & Features Info">
          <Info size={18} />
        </button>
      </div>
    </header>
  );
}
