import JSZip from "jszip";

// Converts a zip file to a list of { name, blob } objects
export const zipToFiles = async (file) => {
  const zip = new JSZip(); // Create inside function to avoid reusing stale state
  const zipData = await zip.loadAsync(file);

  const extractedFiles = [];

  // Iterate over the files in the zip
  for (const [relativePath, zipEntry] of Object.entries(zipData.files)) {
    // Skip folders and system files
    if (zipEntry.dir || relativePath.startsWith('__MACOSX')) continue;

    // Get file content as Blob
    const content = await zipEntry.async('blob');

    extractedFiles.push(new File([content], relativePath));
  }

  return extractedFiles; // List of File objects
};
