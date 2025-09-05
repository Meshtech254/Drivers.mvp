# Database Setup Guide for Profile Pictures

## 🗄️ Supabase Storage Setup

To enable profile picture uploads, you need to set up a storage bucket in your Supabase project.

### Step 1: Create Storage Bucket

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project

2. **Navigate to Storage**
   - In the left sidebar, click on "Storage"
   - Click "New bucket"

3. **Create the Bucket**
   - **Name**: `driver-photos`
   - **Public**: ✅ **Check this box** (Important!)
   - **File size limit**: 50MB (or your preferred limit)
   - **Allowed MIME types**: `image/*` (or leave empty for all types)
   - Click "Create bucket"

### Step 2: Set Up Storage Policies

You need to create policies to allow users to upload and view images.

1. **Go to Storage Policies**
   - In the Storage section, click on your `driver-photos` bucket
   - Click on "Policies" tab

2. **Create Upload Policy**
   - Click "New Policy"
   - **Name**: `Allow authenticated users to upload`
   - **Policy**: 
   ```sql
   (bucket_id = 'driver-photos'::text) AND (auth.role() = 'authenticated'::text)
   ```
   - **Operation**: INSERT
   - Click "Save"

3. **Create View Policy**
   - Click "New Policy"
   - **Name**: `Allow public to view images`
   - **Policy**: 
   ```sql
   (bucket_id = 'driver-photos'::text)
   ```
   - **Operation**: SELECT
   - Click "Save"

4. **Create Update Policy**
   - Click "New Policy"
   - **Name**: `Allow users to update their own images`
   - **Policy**: 
   ```sql
   (bucket_id = 'driver-photos'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
   ```
   - **Operation**: UPDATE
   - Click "Save"

5. **Create Delete Policy**
   - Click "New Policy"
   - **Name**: `Allow users to delete their own images`
   - **Policy**: 
   ```sql
   (bucket_id = 'driver-photos'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
   ```
   - **Operation**: DELETE
   - Click "Save"

### Step 3: Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 4: Test the Setup

1. **Upload a test image** through your app
2. **Check the Storage bucket** in Supabase dashboard
3. **Verify the image is accessible** via the public URL

## 🔧 Troubleshooting

### Common Issues:

1. **"Bucket not found" error**
   - Make sure the bucket name is exactly `driver-photos`
   - Check that the bucket is created and public

2. **"Permission denied" error**
   - Verify the storage policies are set up correctly
   - Make sure the user is authenticated

3. **Images not displaying**
   - Check that the bucket is set to public
   - Verify the public URL is correct

4. **Upload fails silently**
   - Check browser console for errors
   - Verify file size and type restrictions
   - Check Supabase logs in the dashboard

### File Structure in Storage:
```
driver-photos/
├── user-id-1_timestamp.jpg
├── user-id-2_timestamp.png
└── user-id-3_timestamp.jpeg
```

## 🚀 Additional Configuration

### Optional: Image Optimization

You can add image optimization by:

1. **Installing sharp** (for server-side optimization):
   ```bash
   npm install sharp
   ```

2. **Adding image resizing** in the upload function
3. **Setting up CDN** for faster image delivery

### Optional: File Cleanup

Consider implementing:
- **Automatic cleanup** of old profile pictures
- **File size monitoring**
- **Duplicate detection**

## 📝 Database Schema

Your `profiles` table should have:
```sql
photo_url text -- Stores the public URL of the uploaded image
```

The current schema in `supabase/schema.sql` already includes this field.

## ✅ Verification Checklist

- [ ] Storage bucket `driver-photos` created
- [ ] Bucket is set to public
- [ ] Storage policies configured
- [ ] Environment variables set
- [ ] Test upload successful
- [ ] Images display correctly
- [ ] Profile updates work

## 🆘 Support

If you encounter issues:
1. Check the Supabase dashboard logs
2. Verify all environment variables
3. Test with a simple file upload first
4. Check browser network tab for API errors

The setup should now work correctly for profile picture uploads!
