// Demo royalty-free songs encoded in AlphaTex format for instant playback & backing track demo

export const DEMO_SONGS = [
  {
    id: 'canon-in-d',
    title: 'Canon in D (Guitar arrangement)',
    artist: 'Johann Pachelbel',
    difficulty: 'Intermediate',
    youtubeUrl: 'https://www.youtube.com/watch?v=NlprozGcs80',
    youtubeTitle: 'Canon in D Rock Guitar Performance',
    defaultOffset: 0,
    alphaTex: `
\\title "Canon in D"
\\artist "Pachelbel"
\\tempo 90
.
:2 (2.3 3.2 0.1) (0.3 0.2 2.1) (0.4 0.3 2.2) (0.4 0.3 0.1) |
(0.5 0.4 3.3) (0.5 0.4 2.3) (0.5 0.4 3.3) (0.4 0.3 2.2) |
:4 2.3 3.2 0.1 2.1 | 0.3 0.2 2.1 3.2 | 0.4 0.3 2.2 0.1 | 0.4 0.3 0.1 2.2 |
:8 2.3 0.2 3.2 0.1 2.1 0.1 0.2 3.2 | 0.3 2.3 0.2 2.1 3.2 0.2 2.3 0.3 |
    `
  },
  {
    id: 'spanish-romance',
    title: 'Romance Anónimo (Spanish Romance)',
    artist: 'Traditional / Anonymous',
    difficulty: 'Beginner - Intermediate',
    youtubeUrl: 'https://www.youtube.com/watch?v=2n-9qO-r8sU',
    youtubeTitle: 'Spanish Romance Guitar Solo',
    defaultOffset: 0,
    alphaTex: `
\\title "Romance Anónimo"
\\artist "Traditional"
\\tempo 100
.
:8 (7.1 0.6) 0.2 0.3 (7.1 0.6) 0.2 0.3 (7.1 0.6) 0.2 0.3 |
(7.1 0.6) 0.2 0.3 (5.1 0.6) 0.2 0.3 (3.1 0.6) 0.2 0.3 |
(2.1 0.6) 0.2 0.3 (0.1 0.6) 0.2 0.3 (0.1 0.6) 0.2 0.3 |
(3.1 0.6) 0.2 0.3 (7.1 0.6) 0.2 0.3 (12.1 0.6) 0.2 0.3 |
(12.1 0.6) 0.2 0.3 (12.1 0.6) 0.2 0.3 (12.1 0.6) 0.2 0.3 |
(10.1 0.6) 0.2 0.3 (8.1 0.6) 0.2 0.3 (7.1 0.6) 0.2 0.3 |
    `
  },
  {
    id: 'heavy-metal-groove',
    title: 'Neon Heavy Metal Riff',
    artist: 'Symph Riff Lab',
    difficulty: 'Advanced',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeTitle: 'Metal Guitar Backing Track',
    defaultOffset: 0,
    alphaTex: `
\\title "Neon Metal Groove"
\\artist "Symph Lab"
\\tempo 135
.
:8 0.6 0.6 3.6 0.6 5.6 0.6 3.6 0.6 |
0.6 0.6 3.6 0.6 6.6 5.6 3.6 0.6 |
0.6 0.6 3.6 0.6 5.6 0.6 3.6 0.6 |
(3.5 5.4) (3.5 5.4) (5.5 7.4) (3.5 5.4) 0.6 0.6 |
:16 0.6 0.6 0.6 0.6 :8 (5.5 7.4) 0.6 (3.5 5.4) 0.6 |
    `
  },
  {
    id: 'cyberpunk-synth-bass',
    title: 'Cyberpunk Synth & Bass Line',
    artist: 'Symph Electric',
    difficulty: 'Intermediate',
    youtubeUrl: '',
    youtubeTitle: '',
    defaultOffset: 0,
    alphaTex: `
\\title "Cyberpunk Groove"
\\artist "Symph Electric"
\\tempo 120
.
:8 0.4 0.4 2.4 0.4 3.4 2.4 0.4 0.4 |
0.4 0.4 3.4 0.4 5.4 3.4 2.4 0.4 |
0.4 0.4 2.4 0.4 3.4 2.4 0.4 0.4 |
(2.3 4.2) (2.3 4.2) (0.4 2.3) :4 0.4 |
    `
  }
];
