import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Maximize2, Minimize2 } from 'lucide-react';
import YoutubeIcon from './YoutubeIcon';

export default function YoutubeSyncPlayer({
  backingTrackInfo,
  isPlaying,
  currentTime,
  playbackSpeed,
  onSyncReady
}) {
  const [youtubeId, setYoutubeId] = useState(null);
  const [isAudioFile, setIsAudioFile] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const playerRef = useRef(null);
  const audioRef = useRef(null);

  // Extract YouTube ID from URL
  useEffect(() => {
    if (!backingTrackInfo?.url) {
      setYoutubeId(null);
      setIsAudioFile(false);
      return;
    }

    const url = backingTrackInfo.url.trim();
    
    // Check if direct audio file
    if (url.match(/\.(mp3|wav|ogg|m4a)$/i) || url.startsWith('blob:')) {
      setIsAudioFile(true);
      setYoutubeId(null);
      return;
    }

    setIsAudioFile(false);
    // Parse YouTube ID
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      setYoutubeId(match[1]);
    } else {
      setYoutubeId(null);
    }
  }, [backingTrackInfo?.url]);

  // Load YouTube IFrame API script
  useEffect(() => {
    if (!youtubeId) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        if (playerRef.current) {
          try { playerRef.current.destroy(); } catch (e) {}
        }
        playerRef.current = new window.YT.Player(`yt-player-${youtubeId}`, {
          videoId: youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0
          },
          events: {
            onReady: () => {
              if (onSyncReady) onSyncReady();
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [youtubeId]);

  // Synchronize playback state & speed with YouTube / Audio player
  useEffect(() => {
    const offsetSec = (backingTrackInfo?.offsetMs || 0) / 1000;
    const targetTime = Math.max(0, currentTime + offsetSec);

    // YouTube Sync
    if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
      try {
        playerRef.current.setPlaybackRate(playbackSpeed);

        if (isPlaying) {
          const ytTime = playerRef.current.getCurrentTime() || 0;
          if (Math.abs(ytTime - targetTime) > 0.5) {
            playerRef.current.seekTo(targetTime, true);
          }
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (err) {
        console.warn("YouTube sync error:", err);
      }
    }

    // Direct Audio File Sync
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
      if (Math.abs(audioRef.current.currentTime - targetTime) > 0.4) {
        audioRef.current.currentTime = targetTime;
      }
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTime, playbackSpeed, backingTrackInfo?.offsetMs]);

  if (!backingTrackInfo?.url) return null;

  return (
    <div className="glass-panel" style={{
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      zIndex: 90,
      width: isMinimized ? '200px' : '320px',
      padding: '10px',
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
      transition: 'all 0.25s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMinimized ? 0 : '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <YoutubeIcon size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Backing Track Player</span>
        </div>
        <button 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
        </button>
      </div>

      {!isMinimized && (
        <div>
          {youtubeId ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
              <div id={`yt-player-${youtubeId}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            </div>
          ) : isAudioFile ? (
            <audio ref={audioRef} src={backingTrackInfo.url} controls style={{ width: '100%', marginTop: '6px' }} />
          ) : (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
              External Audio Link Active
            </p>
          )}
        </div>
      )}
    </div>
  );
}
