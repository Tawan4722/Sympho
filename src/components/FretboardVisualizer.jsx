import React from 'react';
import { Guitar } from 'lucide-react';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function FretboardVisualizer({
  isOpen,
  activeNotes = [],
  trackTuning = [] // Array of MIDI pitch values or string objects
}) {
  if (!isOpen) return null;

  // Build string list dynamically based on trackTuning or default to standard 6-string
  const defaultTuning = [64, 59, 55, 50, 45, 40];
  
  let rawTuning = (trackTuning && trackTuning.length > 0) ? trackTuning : defaultTuning;
  
  // Ensure string 1 is highest string at top of neck visualizer
  const strings = rawTuning.map((pitchVal, idx) => {
    const midi = typeof pitchVal === 'number' ? pitchVal : (pitchVal.value || 60);
    const noteName = NOTE_NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return {
      num: idx + 1,
      midi: midi,
      name: `${noteName}${octave}`
    };
  });

  const frets = Array.from({ length: 22 }, (_, i) => i);
  const singleDotFrets = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleDotFrets = [12];

  // Calculate note name for an active note (MIDI base + fret offset)
  const getActiveNoteLabel = (strNum, fret) => {
    const targetString = strings.find(s => s.num === strNum);
    if (!targetString) return fret;
    const noteMidi = targetString.midi + fret;
    const name = NOTE_NAMES[noteMidi % 12];
    return name;
  };

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
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
            Interactive {strings.length}-String Fretboard Neck
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            (Tuning: {strings.map(s => s.name).join(' ')})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
            {activeNotes.length} Active Note{activeNotes.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Fretboard Graphic Surface */}
      <div style={{
        overflowX: 'auto',
        background: '#1a1412', // Rosewood dark wood background
        border: '3px solid #3d2c25',
        borderRadius: '8px',
        padding: '10px 0'
      }}>
        <div style={{ display: 'flex', minWidth: '900px', position: 'relative' }}>
          {/* Fretboard Strings */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '14px' }}>
            {strings.map((str) => (
              <div key={str.num} style={{ display: 'flex', alignItems: 'center', height: '22px', position: 'relative' }}>
                {/* String Label */}
                <div style={{
                  width: '42px',
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
                  left: '50px',
                  right: '0',
                  top: '50%',
                  height: `${Math.max(1, 4 - str.num * 0.4)}px`,
                  background: 'linear-gradient(90deg, #d1d5db, #9ca3af)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }} />

                {/* Frets for this string */}
                <div style={{ display: 'flex', flex: 1, marginLeft: '50px' }}>
                  {frets.map((fret) => {
                    const isActive = activeNotes.some(n => n.string === str.num && n.fret === fret);
                    const noteLabel = isActive ? getActiveNoteLabel(str.num, fret) : fret;

                    return (
                      <div 
                        key={fret} 
                        style={{
                          flex: fret === 0 ? '0 0 40px' : 1,
                          height: '22px',
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
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 12px var(--primary)',
                            zIndex: 10
                          }}>
                            {noteLabel}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Fret Numbers Header */}
            <div style={{ display: 'flex', marginLeft: '50px', marginTop: '6px' }}>
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
