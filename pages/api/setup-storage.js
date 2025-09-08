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
    const kycDocsBucket = buckets.find(bucket => bucket.id === 'kyc-docs')
    
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
    } else {
      // no-op
    }

    if (!kycDocsBucket) {
      const { data: newKycBucket, error: kycCreateError } = await supabaseAdmin.storage.createBucket('kyc-docs', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*', 'application/pdf']
      })

      if (kycCreateError) {
        return res.status(500).json({
          error: 'Failed to create kyc-docs bucket',
          details: kycCreateError.message
        })
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Storage buckets ready',
      buckets: {
        driverPhotos: driverPhotosBucket ? 'exists' : 'created',
        kycDocs: kycDocsBucket ? 'exists' : 'created'
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    })
  }
}
