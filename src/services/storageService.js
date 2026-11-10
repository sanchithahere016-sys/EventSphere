/**
 * Storage Service: Handles file uploads for posters and supporting evidence
 * In Demo Mode: converts files to Base64 data URLs stored locally
 * In Firebase Mode: uploads to Firebase Storage bucket
 */

export async function processFileUpload(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    // Limit client-side demo file size to 2MB to keep localStorage healthy
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('File size exceeds 2MB limit. Please choose a smaller file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        url: reader.result,
        uploadedAt: new Date().toISOString()
      });
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
