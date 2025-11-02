export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.download = filename;
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
  window.URL.revokeObjectURL(url);
};
