import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { Mistral } from '@mistralai/mistralai';

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export const mistralResumeOCRTool = createTool({
  id: 'resume-ocr',
  description: 'Extract text from resume PDFs using Mistral OCR',
  inputSchema: z.object({
    pdfBuffer: z.instanceof(Buffer),
  }),
  outputSchema: z.object({
    extractedText: z.string(),
    pagesCount: z.number(),
  }),
  execute: async ({ context }) => {
    const pdf = context.pdfBuffer;
    const fileContent = new Uint8Array(pdf);

    const uploadedFile = await client.files.upload({
      file: { fileName: 'resume.pdf', content: fileContent },
      purpose: 'ocr',
    });

    const signedURL = await client.files.getSignedUrl({ fileId: uploadedFile.id });

    const ocrResponse = await client.ocr.process({
      model: 'mistral-ocr-latest',
      document: { type: 'document_url', documentUrl: signedURL.url },
    });

    let extractedText = '';
    for (const page of ocrResponse.pages) {
      extractedText += page.markdown + '\n\n';
    }

    return { extractedText: extractedText.trim(), pagesCount: ocrResponse.pages.length };
  },
});
