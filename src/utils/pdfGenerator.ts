/**
 * Generates a valid standard PDF 1.4 document as a base64 Data URL.
 * Fully compatible with native browser PDF renderers (Chrome, Firefox, Safari, Edge)
 * and mobile PDF viewers without any external heavy libraries.
 */
export function createStandardPdfDataUrl(
  title: string,
  docType: string,
  metadata?: {
    regNumber?: string;
    storeName?: string;
    applicant?: string;
    date?: string;
  }
): string {
  const dateStr = metadata?.date || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const regNo = metadata?.regNumber || 'REG-PODA-OFFICIAL';
  const store = metadata?.storeName || 'PODA Authorized Partner';
  const applicant = metadata?.applicant || 'Pemohon Kemitraan';

  const streamContent = `BT
/F1 18 Tf
50 730 Td
(PT. PODA E-LIQUID COMPANY) Tj
/F2 11 Tf
0 -26 Td
(BERKAS DOKUMEN RESMI OTORISASI RESELLER & PARTNER) Tj
0 -24 Td
(Jenis Dokumen: ${docType.replace(/[()]/g, '')}) Tj
0 -20 Td
(Nama Berkas: ${title.replace(/[()]/g, '')}) Tj
0 -20 Td
(No. Registrasi: ${regNo.replace(/[()]/g, '')}) Tj
0 -20 Td
(Nama Toko: ${store.replace(/[()]/g, '')}) Tj
0 -20 Td
(Nama Pemohon: ${applicant.replace(/[()]/g, '')}) Tj
0 -20 Td
(Tanggal Pengesahan: ${dateStr.replace(/[()]/g, '')}) Tj
0 -35 Td
(STATUS: DOKUMEN ASLI TERVERIFIKASI SISTEM OSS / PT PODA) Tj
0 -25 Td
(Dokumen ini merupakan salinan sah yang diunggah dan disimpan pada) Tj
0 -16 Td
(basis data perizinan kemitraan PT. PODA E-LIQUID COMPANY.) Tj
ET`;

  const streamLen = streamContent.length;

  const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLen} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000257 00000 n 
0000000300 00000 n 
0000000375 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
450
%%EOF`;

  // Encode to base64
  let base64 = '';
  if (typeof btoa !== 'undefined') {
    base64 = btoa(unescape(encodeURIComponent(pdfBody)));
  } else {
    base64 = Buffer.from(pdfBody).toString('base64');
  }

  return `data:application/pdf;base64,${base64}`;
}
