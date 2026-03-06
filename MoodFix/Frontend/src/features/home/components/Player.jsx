import React, { useState, useRef, useEffect } from 'react'
import { useSong } from '../hooks/useSong'
import '../styles/player.scss'

const Player = () => {
  const { song } = useSong()
  const audioRef = useRef(null)
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  // Update audio element when song changes
  useEffect(() => {
    if (audioRef.current && song?.songUrl) {
      audioRef.current.src = song.songUrl
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [song])

  // Update playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleProgressChange = (e) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleForward = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + seconds,
        duration
      )
    }
  }

  const handleBackward = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - seconds,
        0
      )
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  return (
    <div className="player-container">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Album Art Section */}
      <div className="player-album-section">
        <img
          src={song?.posterUrl}
          alt={song?.title || 'Album Art'}
          className={`player-album-art ${isPlaying ? 'playing' : ''}`}
        />
      </div>

      {/* Song Info Section */}
      <div className="player-info-section">
        <h2 className="player-song-title">{song?.title || 'No Song Selected'}</h2>
        <p className="player-mood">Mood: {song?.mood || 'Unknown'}</p>
      </div>

      {/* Progress Bar Section */}
      <div className="player-progress-section">
        <span className="player-time-current">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="player-progress-bar"
        />
        <span className="player-time-duration">{formatTime(duration)}</span>
      </div>

      {/* Controls Section */}
      <div className="player-controls-section">
        {/* Left Controls - Backward/Forward */}
        <div className="player-controls-group">
          <button
            className="player-btn player-btn-backward"
            onClick={() => handleBackward(15)}
            title="Backward 15s"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9H11V7h-2v8h6.5z"/>
            </svg>
            <span>-15s</span>
          </button>

          <button
            className="player-btn player-btn-previous"
            title="Previous Song"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
        </div>

        {/* Center Controls - Play/Pause */}
        <div className="player-controls-center">
          <button
            className={`player-btn player-btn-play ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Right Controls - Forward/Next */}
        <div className="player-controls-group">
          <button
            className="player-btn player-btn-next"
            title="Next Song"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z"/>
            </svg>
          </button>

          <button
            className="player-btn player-btn-forward"
            onClick={() => handleForward(15)}
            title="Forward 15s"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m-1-13h2v5h4v-2h-6z"/>
                </svg>
            <span>+15s</span>
          </button>
        </div>
      </div>

      {/* Bottom Controls - Volume & Speed */}
      <div className="player-bottom-controls">
        {/* Volume Control */}
        <div className="player-volume-section">
          <button
            className="player-volume-btn"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted || volume === 0 ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C23.16 14.49 24 13.34 24 12c0-2.64-1.05-5.04-2.75-6.84l-1.51 1.51c.34.82.54 1.7.54 2.64zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value))
              if (parseFloat(e.target.value) > 0) {
                setIsMuted(false)
              }
            }}
            className="player-volume-slider"
          />
          <span className="player-volume-value">{Math.round(volume * 100)}%</span>
        </div>

        {/* Speed Control */}
        <div className="player-speed-section">
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="player-speed-select"
          >
            {speedOptions.map((speed) => (
              <option key={speed} value={speed}>
                {speed === 1 ? 'Normal' : `${speed}x`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Player
