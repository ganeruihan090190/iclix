'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import Hls from 'hls.js';
import { usePlayerProgress } from '@/hooks/use-player';

interface VideoPlayerProps {
  filmId: string;
  videoUrl: string;
  title: string;
  startAt?: number;
}

export function VideoPlayer({ filmId, videoUrl, title, startAt = 0 }: VideoPlayerProps) {
  const router = useRouter();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);

  const controlsTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const { startTracking, stopTracking } = usePlayerProgress(filmId);

  // Initialize Video / HLS
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoUrl.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      }
    } else {
      video.src = videoUrl;
    }

    if (startAt > 0) {
      video.currentTime = startAt;
    }
  }, [videoUrl, startAt]);

  // Track progress
  React.useEffect(() => {
    startTracking(() => videoRef.current?.currentTime || 0);
    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  // Hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    if (startAt > 0) {
      videoRef.current.currentTime = startAt;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setVolume(val);
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          stopTracking(true);
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain"
        autoPlay
      />

      {/* Overlay Controls */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 flex flex-col justify-between p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-black/40 hover:bg-black/80 text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-lg md:text-xl font-bold text-white drop-shadow">{title}</h2>
        </div>

        {/* Center Big Play Button (when paused) */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="self-center p-6 rounded-full bg-primary text-white hover:bg-primary-hover transition-transform hover:scale-110 shadow-2xl"
          >
            <Play className="h-10 w-10 fill-white ml-1" />
          </button>
        )}

        {/* Bottom Bar Controls */}
        <div className="space-y-3">
          {/* Progress Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-neutral-700 accent-primary rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-text-secondary w-10">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-primary transition-colors">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-white" />}
              </button>
              <button onClick={() => skip(-10)} className="hover:text-primary transition-colors" title="Rewind 10s">
                <RotateCcw className="h-5 w-5" />
              </button>
              <button onClick={() => skip(10)} className="hover:text-primary transition-colors" title="Forward 10s">
                <RotateCw className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="hover:text-primary transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 md:w-24 h-1 bg-neutral-700 accent-primary rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={toggleFullscreen} className="hover:text-primary transition-colors">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
