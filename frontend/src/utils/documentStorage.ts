/**
 * Utility to save and load files to/from localStorage as Base64 strings.
 */

interface StoredFile {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export const saveFileToLocalStorage = (
  applicationId: string,
  fieldKey: string,
  file: File
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const stored: StoredFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result as string,
        };
        const key = `bsi_doc_${applicationId}_${fieldKey}`;
        localStorage.setItem(key, JSON.stringify(stored));
        resolve();
      } catch (err) {
        console.error("Local storage quota exceeded or failed to save file", err);
        // Fallback to storing just the metadata to prevent UI crash
        try {
          const key = `bsi_doc_${applicationId}_${fieldKey}`;
          localStorage.setItem(
            key,
            JSON.stringify({
              name: file.name,
              type: file.type,
              size: file.size,
              dataUrl: "", // no payload
            })
          );
        } catch (_) {}
        resolve();
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const getFileFromLocalStorage = (
  applicationId: string,
  fieldKey: string
): StoredFile | null => {
  try {
    const key = `bsi_doc_${applicationId}_${fieldKey}`;
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as StoredFile;
  } catch (err) {
    console.error("Failed to load file from local storage", err);
    return null;
  }
};

export const downloadStoredFile = (
  applicationId: string,
  fieldKey: string,
  fallbackName = "document.pdf"
): boolean => {
  const fileData = getFileFromLocalStorage(applicationId, fieldKey);
  if (!fileData || !fileData.dataUrl) {
    return false;
  }

  try {
    const link = document.createElement("a");
    link.href = fileData.dataUrl;
    link.download = fileData.name || fallbackName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error("Failed to download file", err);
    return false;
  }
};
