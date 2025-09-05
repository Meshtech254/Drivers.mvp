import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id, updates } = req.body || {}
    
    if (!id) {
      return res.status(400).json({ error: 'Missing user ID' })
    }
    
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' })
    }

    // Clean up the updates object - remove empty strings and null values
    const cleanUpdates = {}
    Object.keys(updates).forEach(key => {
      if (updates[key] !== null && updates[key] !== undefined && updates[key] !== '') {
        cleanUpdates[key] = updates[key]
      }
    })

    // Ensure the user is a driver
    cleanUpdates.is_driver = true

    console.log('Updating profile for user:', id, 'with updates:', cleanUpdates)

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Failed to update profile', 
        details: error.message 
      })
    }

    if (!data) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    console.log('Profile updated successfully:', data)
    return res.status(200).json({ 
      success: true, 
      profile: data,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    })
  }
}


