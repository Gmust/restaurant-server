export const bufferPdf = (pdfDocument: PDFKit.PDFDocument) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    pdfDocument.on('data', (chunk: Uint8Array) => {
      chunks.push(chunk);
    });

    pdfDocument.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    pdfDocument.on('error', (error: Error) => {
      reject(error);
    });

    pdfDocument.end();
  });
};
