import Mux from "@mux/mux-node"

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
})

export async function uploadVideoToMux(videoFile: File) {
  try {
    // Create Mux asset with enhanced settings
    const asset = await mux.video.assets.create({
      input: [{ url: videoFile }],
      playback_policy: ["public"], // Changed to public for easier access
      encoding_tier: "smart", // Enhanced encoding for better quality
      mp4_support: "standard", // Added MP4 support for compatibility
      normalize_audio: true, // Audio normalization for consistent volume
    })

    return {
      assetId: asset.id,
      playbackId: asset.playback_ids?.[0]?.id,
      status: asset.status,
    }
  } catch (error) {
    console.error("Mux upload error:", error)
    throw new Error("Failed to upload video to Mux")
  }
}

export async function getMuxVideoUrl(playbackId: string) {
  return `https://stream.mux.com/${playbackId}.m3u8`
}

export async function getMuxThumbnailUrl(
  playbackId: string,
  options?: {
    width?: number
    height?: number
    fit_mode?: "preserve" | "stretch" | "crop" | "smartcrop"
    time?: number
  },
) {
  const params = new URLSearchParams()
  if (options?.width) params.append("width", options.width.toString())
  if (options?.height) params.append("height", options.height.toString())
  if (options?.fit_mode) params.append("fit_mode", options.fit_mode)
  if (options?.time) params.append("time", options.time.toString())

  return `https://image.mux.com/${playbackId}/thumbnail.jpg?${params.toString()}`
}

export async function getMuxVideoAnalytics(assetId: string) {
  try {
    const metrics = await mux.data.metrics.breakdown({
      metric_id: "video_startup_time",
      filters: [`asset_id:${assetId}`],
    })
    return metrics
  } catch (error) {
    console.error("Mux analytics error:", error)
    return null
  }
}

export async function getMuxAssetDetails(assetId: string) {
  try {
    const asset = await mux.video.assets.retrieve(assetId)
    return {
      id: asset.id,
      status: asset.status,
      duration: asset.duration,
      aspect_ratio: asset.aspect_ratio,
      playback_ids: asset.playback_ids,
      created_at: asset.created_at,
    }
  } catch (error) {
    console.error("Mux asset details error:", error)
    return null
  }
}
