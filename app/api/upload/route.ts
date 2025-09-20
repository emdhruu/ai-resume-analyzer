import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { mastra } from '@/app/mastra';

const app = new Hono().basePath('/api');

app.post('/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const pdfFile = formData.get('pdf') as File | null;

       if (!pdfFile) {
      return c.json({ error: 'No PDF file provided' }, 400)
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workflow = mastra?.getWorkflow("resumeWorkflow");

    const run = await workflow?.createRunAsync();

    const result = await run.start?.({ inputData: { pdfFile: buffer } });

    return c.json({ success: true, result: result.result.analysis || result }, 200);
  } catch (err: any) {
    console.error('Backend test error:', err);
    return c.json({ error: err.message }, 500);
  }
});

export const POST = handle(app);
