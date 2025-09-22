# AI Resume Analyzer  

AI-powered resume analyzer that **extracts text with Mistral OCR** and **analyzes it using Mastra AI** to provide insights, strengths, weaknesses, and improvement tips.  

---

## Tech Stack  
- **Bun** – Fast JavaScript runtime  
- **Hono** – Lightweight backend framework  
- **Mastra AI** – Resume analysis & orchestration  
- **Mistral OCR** – Resume text extraction  
- **TypeScript** – Type-safe code  
- **Next.js** – Frontend

---

## Environment Variables  

Create a `.env` file in the root of the project and add your keys:  

```env
GROQ_API_KEY=your_groq_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
```

---

## Getting Started  

```bash
bun install
bun dev
```
