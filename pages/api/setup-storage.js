import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      return res.status(500).json({ 
        error: 'Failed to list buckets', 
        details: bucketsError.message 
      })
    }

    const driverPhotosBucket = buckets.find(bucket => bucket.id === 'driver-photos')
    
    if (!driverPhotosBucket) {
      // Create the bucket
      const { data: newBucket, error: createError } = await supabaseAdmin.storage.createBucket('driver-photos', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*']
      })

      if (createError) {
        return res.status(500).json({ 
          error: 'Failed to create bucket', 
          details: createError.message 
        })
      }

      return res.status(200).json({ 
        success: true,
        message: 'Storage bucket created successfully',
        bucket: newBucket
      })
    } else {
      return res.status(200).json({ 
        success: true,
        message: 'Storage bucket already exists',
        bucket: driverPhotosBucket
      })
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    })
  }
}
