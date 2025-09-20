import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import { mastra } from '@/app/mastra';

const app = new Hono().basePath('/api');
const agent = mastra.getAgent('resumeAgent');

app.post('/test', async (c) => {
  try {
    // const body = await c.req.json();
    console.log("Agent loaded:", agent)
    console.log("Agent model id:", agent?.model?.modelId);

    const inputText = `
      # DHRUTI BHAVESH THAKKAR
      ## EDUCATION
      Bachelor of Engineering in Computer, 7.8 CGPA
      ## EXPERIENCE
      Junior Full Stack Developer at MobiboxSoftech Pvt Ltd
    `;

    const stream = await agent.generateVNext(
      [
        { role: 'user', content: `
      # DHRUTI BHAVESH THAKKAR
      ## EDUCATION
      Bachelor of Engineering in Computer, 7.8 CGPA
      ## EXPERIENCE
      Junior Full Stack Developer at MobiboxSoftech Pvt Ltd
    ` }
      ]
    );

    // Read the entire response at once
    // const analysisText = await stream.readAll();
    console.log('Agent test stream response:', stream);
    console.log('Agent test stream response text:', stream.text);

    return c.json({ analysis: stream.text });
  } catch (err: any) {
    console.error('Agent test error:', err);
    return c.json({ error: err.message }, 500);
  }
});

export const POST = handle(app);
