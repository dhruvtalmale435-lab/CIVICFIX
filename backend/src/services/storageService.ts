import { getSupabaseClient } from '../config/database.js'

const supabase = getSupabaseClient()

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export async function uploadImage(
  file: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadResult> {
  try {
    const timestamp = Date.now()
    const safeFilename = `${timestamp}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const path = `complaints/${safeFilename}`

    const { data, error } = await supabase.storage
      .from('complaint-images')
      .upload(path, file, {
        contentType: mimeType,
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('complaint-images')
      .getPublicUrl(path)

    return {
      success: true,
      url: publicUrl,
      path
    }
  } catch (error) {
    console.error('Image upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

export async function deleteImage(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('complaint-images')
      .remove([path])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Image deletion error:', error)
    return false
  }
}
