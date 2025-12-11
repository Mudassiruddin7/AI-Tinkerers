/**
 * Enhanced Video Player Component
 * Features: Playback controls, captions, quiz overlay, progress tracking
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  SkipBack,
  SkipForward,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SubtitleCue, getCurrentCue, generateSubtitlesFromTranscript } from '@/lib/subtitles'

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  transcript?: string
  subtitles?: SubtitleCue[]
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onEnded?: () => void
  onQuizTrigger?: (timestamp: number) => void
  quizTimestamps?: number[]
  className?: string
  autoPlay?: boolean
  startTime?: number
}

export function EnhancedVideoPlayer({
  src,
  poster,
  title,
  transcript,
  subtitles: initialSubtitles,
  onTimeUpdate,
  onEnded,
  onQuizTrigger,
  quizTimestamps = [],
  className,
  autoPlay = false,
  startTime = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [captionsEnabled, setCaptionsEnabled] = useState(true)
  const [triggeredQuizzes, setTriggeredQuizzes] = useState<Set<number>>(new Set())

  // Subtitles
  const [subtitles, setSubtitles] = useState<SubtitleCue[]>([])
  const [currentCue, setCurrentCue] = useState<SubtitleCue | null>(null)

  // Control visibility timer
  const controlsTimeout = useRef<NodeJS.Timeout>()

  // Generate subtitles from transcript if not provided
  useEffect(() => {
    if (initialSubtitles && initialSubtitles.length > 0) {
      setSubtitles(initialSubtitles)
    } else if (transcript && duration > 0) {
      const generated = generateSubtitlesFromTranscript(transcript, duration)
      setSubtitles(generated)
    }
  }, [initialSubtitles, transcript, duration])

  // Update current cue based on time
  useEffect(() => {
    if (captionsEnabled && subtitles.length > 0) {
      const cue = getCurrentCue(subtitles, currentTime)
      setCurrentCue(cue)
    } else {
      setCurrentCue(null)
    }
  }, [currentTime, subtitles, captionsEnabled])

  // Check for quiz triggers
  useEffect(() => {
    for (const timestamp of quizTimestamps) {
      if (
        currentTime >= timestamp &&
        currentTime < timestamp + 1 &&
        !triggeredQuizzes.has(timestamp) &&
        onQuizTrigger
      ) {
        setTriggeredQuizzes(prev => new Set([...prev, timestamp]))
        onQuizTrigger(timestamp)
        videoRef.current?.pause()
        break
      }
    }
  }, [currentTime, quizTimestamps, triggeredQuizzes, onQuizTrigger])

  // Controls visibility
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true)
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current)
    }
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }, [isPlaying])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          skip(-10)
          break
        case 'ArrowRight':
          e.preventDefault()
          skip(10)
          break
        case 'ArrowUp':
          e.preventDefault()
          adjustVolume(0.1)
          break
        case 'ArrowDown':
          e.preventDefault()
          adjustVolume(-0.1)
          break
        case 'm':
          toggleMute()
          break
        case 'f':
          toggleFullscreen()
          break
        case 'c':
          setCaptionsEnabled(prev => !prev)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      if (startTime > 0) {
        videoRef.current.currentTime = startTime
      }
      setIsLoading(false)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time, duration)

      // Update buffered
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(
          videoRef.current.buffered.length - 1
        )
        setBuffered((bufferedEnd / duration) * 100)
      }
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    onEnded?.()
  }

  const handleWaiting = () => setIsLoading(true)
  const handleCanPlay = () => setIsLoading(false)

  // Control functions
  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const adjustVolume = (delta: number) => {
    if (!videoRef.current) return
    const newVolume = Math.max(0, Math.min(1, volume + delta))
    videoRef.current.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const setVolumeValue = (value: number) => {
    if (!videoRef.current) return
    videoRef.current.volume = value
    setVolume(value)
    setIsMuted(value === 0)
  }

  const skip = (seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, currentTime + seconds)
    )
  }

  const seekTo = (percent: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = (percent / 100) * duration
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = ((e.clientX - rect.left) / rect.width) * 100
    seekTo(percent)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } else {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = speed
    setPlaybackSpeed(speed)
    setShowSettings(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const VolumeIcon = isMuted ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black aspect-video w-full overflow-hidden group',
        isFullscreen && 'fixed inset-0 z-50',
        className
      )}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay={autoPlay}
        playsInline
      />

      {/* Loading Spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtitles */}
      <AnimatePresence>
        {captionsEnabled && currentCue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 left-0 right-0 flex justify-center px-4 pointer-events-none"
          >
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-center max-w-3xl">
              <p className="text-lg leading-relaxed">{currentCue.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4">
              {title && (
                <h3 className="text-white font-medium truncate">{title}</h3>
              )}
            </div>

            {/* Center Play Button */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" />
                )}
              </motion.div>
            </button>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {/* Progress Bar */}
              <div
                ref={progressRef}
                onClick={handleProgressClick}
                className="relative h-1.5 bg-white/30 rounded-full cursor-pointer group/progress"
              >
                {/* Buffered */}
                <div
                  className="absolute h-full bg-white/50 rounded-full"
                  style={{ width: `${buffered}%` }}
                />
                {/* Progress */}
                <div
                  className="absolute h-full bg-primary-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                />
                {/* Quiz markers */}
                {quizTimestamps.map((timestamp) => (
                  <div
                    key={timestamp}
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full"
                    style={{ left: `${(timestamp / duration) * 100}%` }}
                    title="Quiz"
                  />
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-primary-400 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>

                  {/* Skip buttons */}
                  <button
                    onClick={() => skip(-10)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => skip(10)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <VolumeIcon className="w-5 h-5" />
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolumeValue(parseFloat(e.target.value))}
                      className="w-0 group-hover/volume:w-20 transition-all duration-200 appearance-none h-1 bg-white/30 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Time */}
                  <span className="text-white/80 text-sm tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Captions Toggle */}
                  <button
                    onClick={() => setCaptionsEnabled(!captionsEnabled)}
                    className={cn(
                      'transition-colors',
                      captionsEnabled ? 'text-primary-400' : 'text-white/80 hover:text-white'
                    )}
                    title="Toggle captions (C)"
                  >
                    <Subtitles className="w-5 h-5" />
                  </button>

                  {/* Settings */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-10 right-0 bg-gray-900 rounded-lg shadow-lg overflow-hidden min-w-[150px]"
                        >
                          <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-800">
                            Playback Speed
                          </div>
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => changeSpeed(speed)}
                              className={cn(
                                'w-full px-3 py-2 text-sm text-left hover:bg-gray-800 transition-colors',
                                playbackSpeed === speed
                                  ? 'text-primary-400'
                                  : 'text-white'
                              )}
                            >
                              {speed}x
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="text-white/80 hover:text-white transition-colors"
                    title="Toggle fullscreen (F)"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedVideoPlayer
