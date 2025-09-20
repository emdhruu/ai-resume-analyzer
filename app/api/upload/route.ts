import { Mistral } from '@mistralai/mistralai'
import { v4 as uuidv4 } from 'uuid'
import { handle } from 'hono/vercel';

import { Hono } from "hono";
import { cors } from "hono/cors";
import { mastra } from '@/app/mastra';

const app = new Hono().basePath('/api')


// app.use('/*', cors())

// --- Types ---
interface OCRPageDimensions {
  dpi: number
  height: number
  width: number
}

interface OCRPageObject {
  index: number
  markdown: string
  images: [] // always empty in text-only PDFs
  dimensions: OCRPageDimensions | null
}

interface OCRUsageInfo {
  pagesProcessed: number
  docSizeBytes?: number | null
}

interface OCRResponse {
  pages: OCRPageObject[]
  model: string
  usageInfo: OCRUsageInfo
}

interface OCRRequest {
  model: string
  document: {
    type: 'document_url'
    documentUrl: string
    documentName: string
  }
  includeImageBase64?: boolean
}



const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY as string,
})
 console.log("Mistral client initialized.");

// --- Route ---
app.post('/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    console.log("Form Data received:", formData);
    const pdfFile = formData.get('pdf') as File | null

    if (!pdfFile) {
      return c.json({ error: 'No PDF file provided' }, 400)
    }

    const sessionId = uuidv4()
    const arrayBuffer = await pdfFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    // const fileObject = new File([buffer], pdfFile.name, { type: 'application/pdf' })

    // Step 1: Upload PDF
    const uploadResponse = await mistral.files.upload({
      file: {
        fileName: pdfFile.name,
        content: buffer,
      },
      purpose: 'ocr',
    })

    // Step 2: Get signed URL
    const signedUrlResponse = await mistral.files.getSignedUrl({
      fileId: uploadResponse.id,
      expiry: 1,
    })

    // Step 3: Run OCR
    const ocrRequestData: OCRRequest = {
      model: 'mistral-ocr-latest',
      document: {
        type: 'document_url',
        documentUrl: signedUrlResponse.url,
        documentName: pdfFile.name,
      },
      includeImageBase64: false, // not needed if text-only
    }

    const ocrResponse = await mistral.ocr.process(ocrRequestData)

    // Step 4: Process response
    const processed = processOcrResponse(ocrResponse as OCRResponse, sessionId)

    console.log("Sending to agent:", processed.text.slice(0, 300))


    try {

      const agent = mastra.getAgent('resumeAgent');
      const stream = await agent.streamVNext(
  [
    { role: 'system', content: "You are an expert resume analyzer. Analyze the resume and provide a structured summary with key skills, experience, and recommendations." },
    { role: 'user', content: processed.text }
  ],
  { format: 'aisdk' }
);

console.log("Reading full analysis text from stream...", stream);

// Extract text from the stream response
let analysisText = '';

try {
  // The stream object has a 'text' property based on the TypeScript error
  if (stream && stream.text) {
    analysisText = await stream.text;
  } else if (typeof stream === 'string') {
    analysisText = stream;
  } else {
    // Fallback - stringify the object
    analysisText = JSON.stringify(stream);
  }
} catch (streamError) {
  console.error("Error reading stream:", streamError);
  analysisText = "Error reading analysis from stream";
}

return c.json({ 
  ...processed,
  analysis: analysisText,
  sessionId 
});
  } catch (agentError: any) {
      console.error("Agent error details:", agentError);
      return c.json({ 
        error: 'Agent failed to process', 
        details: agentError,
        ocrText: processed.text // Return OCR text for debugging
      }, 500)
    }
  } catch (err: any) {
    console.error(err)
    return c.json({ error: 'Failed to process PDF', details: err.message }, 500)
  }
})

// --- Response processing ---
function processOcrResponse(ocrResponse: OCRResponse, sessionId: string) {
  const processedPages = ocrResponse.pages.map((page) => ({
    index: page.index,
    markdown: page.markdown,
    rawMarkdown: page.markdown,
    images: [],
    dimensions: page.dimensions || { dpi: 72, height: 792, width: 612 },
  }))

  return {
    text: processedPages.map((p) => p.markdown).join('\n\n'),
    rawText: processedPages.map((p) => p.rawMarkdown).join('\n\n'),
    sessionId,
    pages: processedPages,
    images: [],
    storedAssets: [],
    usage: {
      pages_processed: ocrResponse.usageInfo.pagesProcessed,
      doc_size_bytes: ocrResponse.usageInfo.docSizeBytes || 0,
    },
    model: ocrResponse.model || 'mistral-ocr-latest',
  }
}


export const POST =  handle(app)