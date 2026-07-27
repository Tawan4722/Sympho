import React from 'react';
import { Guitar } from 'lucide-react';

export default function FretboardVisualizer({
  isOpen,
  onClose,
  activeNotes = []
}) {
  if (!isOpen) return null;

  // Standard 6-string guitar tuning strings (E2, A2, D3, G3, B3, E4)
  const strings = [
    { num: 1, name: 'E4' },
    { num: 2, name: 'B3' },
    { num: 3, name: 'G3' },
    { num: 4, name: 'D3' },
    { num: 5, name: 'A2' },
    { num: 6, name: 'E2' }
  ];

  const frets = Array.from({ length: 22 }, (_, i) => i);

  // Inlaid fret marker dots on standard guitars (3, 5, 7, 9, 12, 15, 17, 19, 21)
  const singleDotFrets = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleDotFrets = [12];

  return (
    <div className="glass-panel" style={{
      margin: '0 12px 12px 12px',
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(15, 19, 31, 0.95)',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Guitar size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Interactive 22-Fret Guitar Neck</h3>
        </div>
        <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
          {activeNotes.length} Active Note{activeNotes.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Fretboard Graphic Surface */}
      <div style={{
        overflowX: 'auto',
        background: '#1a1412', // Rosewood dark wood color
        border: '3px solid #3d2c25',
        borderRadius: '8px',
        padding: '10px 0'
      }}>
        <div style={{ display: 'flex', minWidth: '900px', position: 'relative' }}>
          {/* Fretboard Strings */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '14px' }}>
            {strings.map((str) => (
              <div key={str.num} style={{ display: 'flex', alignItems: 'center', height: '20px', position: 'relative' }}>
                {/* String Label */}
                <div style={{
                  width: '36px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: 'var(--primary)',
                  textAlign: 'center',
                  background: '#2a1e19',
                  borderRadius: '4px',
                  marginRight: '8px',
                  padding: '2px 0'
                }}>
                  {str.name}
                </div>

                {/* String Metal Line */}
                <div style={{
                  position: 'absolute',
                  left: '44px',
                  right: '0',
                  top: '50%',
                  height: `${Math.max(1, 4 - str.num * 0.5)}px`,
                  background: 'linear-gradient(90deg, #d1d5db, #9ca3af)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }} />

                {/* Frets for this string */}
                <div style={{ display: 'flex', flex: 1, marginLeft: '44px' }}>
                  {frets.map((fret) => {
                    const isActive = activeNotes.some(n => n.string === str.num && n.fret === fret);
                    return (
                      <div 
                        key={fret} 
                        style={{
                          flex: fret === 0 ? '0 0 40px' : 1,
                          height: '20px',
                          borderRight: fret === 0 ? '4px solid #f3f4f6' : '2px solid #6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        {/* Note Highlight Indicator */}
                        {isActive && (
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 10px var(--primary)',
                            zIndex: 10
                          }}>
                            {fret}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Fret Numbers Header */}
            <div style={{ display: 'flex', marginLeft: '44px', marginTop: '6px' }}>
              {frets.map((fret) => (
                <div 
                  key={fret} 
                  style={{
                    flex: fret === 0 ? '0 0 40px' : 1,
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: (singleDotFrets.includes(fret) || doubleDotFrets.includes(fret)) ? 'var(--primary)' : 'var(--text-dim)'
                  }}
                >
                  {fret === 0 ? 'Nut' : fret}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
