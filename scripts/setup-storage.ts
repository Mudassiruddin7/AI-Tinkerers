/**
 * Supabase Storage Bucket Setup Script
 * Creates the required storage buckets for the AI Tutor platform
 */

const SUPABASE_URL = 'https://obdtffxugpzlxkkuurbw.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZHRmZnh1Z3B6bHhra3V1cmJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4NDY4NSwiZXhwIjoyMDgwODYwNjg1fQ.C7wvzfaVPzFMku_uhmA5W0Y9zte4wX2mhIRFiN-ehl8';

async function createBucket(bucketName: string, isPublic: boolean = true) {
  console.log(`Creating bucket: ${bucketName}...`);
  
  const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: bucketName,
      name: bucketName,
      public: isPublic,
      file_size_limit: 52428800, // 50MB
      allowed_mime_types: bucketName === 'documents' 
        ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        : bucketName === 'audio'
        ? ['audio/mpeg', 'audio/wav', 'audio/mp3']
        : bucketName === 'videos'
        ? ['video/mp4', 'video/webm']
        : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    }),
  });

  if (response.ok) {
    console.log(`✅ Bucket '${bucketName}' created successfully`);
    return true;
  } else {
    const error = await response.text();
    if (error.includes('already exists')) {
      console.log(`ℹ️ Bucket '${bucketName}' already exists`);
      return true;
    }
    console.error(`❌ Failed to create bucket '${bucketName}':`, error);
    return false;
  }
}

async function uploadFile(bucketName: string, filePath: string, fileContent: Buffer | string, contentType: string) {
  console.log(`Uploading to ${bucketName}/${filePath}...`);
  
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${filePath}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': contentType,
    },
    body: fileContent,
  });

  if (response.ok) {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${filePath}`;
    console.log(`✅ File uploaded: ${publicUrl}`);
    return publicUrl;
  } else {
    const error = await response.text();
    console.error(`❌ Upload failed:`, error);
    return null;
  }
}

async function main() {
  console.log('\n🪣 Setting up Supabase Storage Buckets\n');
  console.log('='.repeat(50));

  // Create required buckets
  const buckets = ['documents', 'audio', 'videos', 'images'];
  
  for (const bucket of buckets) {
    await createBucket(bucket);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Storage setup complete!\n');
}

main().catch(console.error);
