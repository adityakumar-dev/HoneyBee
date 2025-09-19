function parseSupabaseUrl(fullUrl : String) {
  const baseParts = fullUrl.split('/storage/v1/object/public/');
  if (baseParts.length < 2) throw new Error('Invalid Supabase storage URL');

  const path = baseParts[1];

  const [bucketEncoded, ...fileParts] = path.split('/');
  const bucketName = decodeURIComponent(bucketEncoded); 
  const filePath = fileParts.join('/'); 

  const lastSlash = filePath.lastIndexOf('/');
  const folderPath = lastSlash >= 0 ? filePath.slice(0, lastSlash) : '';
  const fileName = lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath;

  return {
    bucketName,
    filePath,  
    folderPath, 
    fileName   
  };
}

// Example:
const url = 'https://futhouvjmznpkqzyzpfk.supabase.co/storage/v1/object/public/Testing%20HoneyBee/products/1758207695013-m1xi9iu1vv.jpeg';
console.log(parseSupabaseUrl(url));
