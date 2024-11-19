import fs from "fs";
import path from "path";

// READ FILEs
export const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);
    return { file: data.toString("base64"), mimeType: mimeType };
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return null;
  }
};

// ADD MIME TYPE
export const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".pdf":
      return "application/pdf";
    // Add more cases as needed for other file types
    default:
      return "application/octet-stream"; // Default MIME type
  }
};
