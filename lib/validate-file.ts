/**
 * Maximum file size allowed for uploads (in bytes).
 * Must match the serverActions.bodySizeLimit in next.config.ts
 */
export const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB (leave margin for form data overhead)
export const MAX_FILE_SIZE_LABEL = "4.5 MB";

/**
 * Validate file size before form submission.
 * Returns error message if any file exceeds the limit, null if OK.
 */
export function validateFileSize(
  files: FileList | File[] | null | undefined,
  maxSize: number = MAX_FILE_SIZE
): string | null {
  if (!files) return null;

  const fileArray = Array.from(files);
  const totalSize = fileArray.reduce((sum, f) => sum + f.size, 0);

  for (const file of fileArray) {
    if (file.size > maxSize) {
      return `File "${file.name}" terlalu besar (${formatSize(file.size)}). Maksimal ${MAX_FILE_SIZE_LABEL}.`;
    }
  }

  if (totalSize > maxSize) {
    return `Total ukuran file (${formatSize(totalSize)}) melebihi batas ${MAX_FILE_SIZE_LABEL}.`;
  }

  return null;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
