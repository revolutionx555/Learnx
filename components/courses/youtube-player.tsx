"use client"

import { useState, useEffect, useRef } from "react"

interface YouTubePlayerProps {
  videoId: string
  title: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
  initialTime?: number
}

export function YouTubePlayer({ videoId, title, onProgress, onComplete, initialTime = 0 }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${
    typeof window !== "undefined" ? window.location.origin : ""
  }&start=${Math.floor(initialTime)}&rel=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&playsinline=1&autohide=0&color=white&controls=1&disablekb=0&end=0&loop=0&playlist=&showinfo=0&mute=0&autoplay=0`

  useEffect(() => {
    // YouTube API integration for progress tracking
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return

      try {
        const data = JSON.parse(event.data)
        if (data.event === "video-progress") {
          onProgress?.(data.info?.currentTime || 0)
        } else if (data.event === "video-ended") {
          onComplete?.()
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onProgress, onComplete])

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />

      {/* Minimal overlay for branding */}
      <div
        className={`absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {title}
      </div>
    </div>
  )
}
