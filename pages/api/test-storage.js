import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Test if the storage bucket exists
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      return res.status(500).json({ 
        error: 'Failed to list buckets', 
        details: bucketsError.message 
      })
    }

    const driverPhotosBucket = buckets.find(bucket => bucket.id === 'driver-photos')
    
    if (!driverPhotosBucket) {
      return res.status(404).json({ 
        error: 'driver-photos bucket not found',
        availableBuckets: buckets.map(b => b.id)
      })
    }

    // Test if we can list files in the bucket
    const { data: files, error: filesError } = await supabaseAdmin.storage
      .from('driver-photos')
      .list()

    if (filesError) {
      return res.status(500).json({ 
        error: 'Failed to list files in bucket', 
        details: filesError.message 
      })
    }

    return res.status(200).json({ 
      success: true,
      bucket: driverPhotosBucket,
      fileCount: files?.length || 0,
      files: files?.slice(0, 10) || [] // Show first 10 files
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    })
  }
}
