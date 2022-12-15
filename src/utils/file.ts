export async function getFileContents(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('Cannot read file contents as string');
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function getFileExtension(file: File): string | undefined {
  return file.name.split('.').pop();
}
