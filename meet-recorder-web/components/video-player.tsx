import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  onError?: (error: string) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

interface PlayerError {
  message: string;
  timestamp: number;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({
  src,
  autoPlay = false,
  controls = true,
  className = '',
  onError,
  onPlay,
  onPause,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<PlayerError | null>(null);

  const handleError = (message: string) => {
    const newError = { message, timestamp: Date.now() };
    setError(newError);
    onError?.(message);
  };

  useEffect(() => {
    let hls: Hls | null = null;
    const video = videoRef.current;

    const initializePlayer = () => {
      if (!video) return;

      // Clean up any existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      // Try native HLS support first (Safari)
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        if (autoPlay) {
          video.play().catch((err: Error) => {
            handleError(`Autoplay failed: ${err.message}`);
          });
        }
      }
      // Otherwise use HLS.js
      else if (Hls.isSupported()) {
        hls = new Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferSize: 30 * 1000 * 1000, // 30MB
          maxBufferLength: 30
        });

        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            video.play().catch((err: Error) => {
              handleError(`Autoplay failed: ${err.message}`);
            });
          }
        });


      } else {
        handleError('HLS is not supported in this browser');
      }
    };

    const destroyPlayer = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };

    // Add event listeners
    const addVideoEventListeners = () => {
      if (!video) return;

      video.addEventListener('play', onPlay || (() => {}));
      video.addEventListener('pause', onPause || (() => {}));
    };

    // Remove event listeners
    const removeVideoEventListeners = () => {
      if (!video) return;

      video.removeEventListener('play', onPlay || (() => {}));
      video.removeEventListener('pause', onPause || (() => {}));
    };

    initializePlayer();
    addVideoEventListeners();

    // Cleanup
    return () => {
      removeVideoEventListeners();
      destroyPlayer();
    };
  }, [src, autoPlay, onPlay, onPause, onError]);

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        className={`w-full ${className}`}
        controls={controls}
        playsInline
      />
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-sm">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default HLSPlayer;