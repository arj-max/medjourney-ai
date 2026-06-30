# MedJourney AI – API Contract

This document describes what each backend API endpoint expects and returns, so frontend and backend work can stay in sync without reading each other's code.

> ⚠️ NOTE (Alaina): The /chat endpoint below uses the Google Gemini API instead of Claude,
> since we didn't have budget for Claude API credits yet. Logic and response format are
> identical — just swap the API call if/when Claude access is set up.

---

## POST /upload  (built by Anjana — DONE)

Uploads a PDF, extracts its text, splits it into chunks, and stores those chunks in ChromaDB.

**Request:** multipart/form-data with one field:
- `file`: a PDF file

**Response (200 success):**
```json
{
  "filename": "example.pdf",
  "chunks_created": 62,
  "status": "success"
}
```

---

## POST /chat  (built by Alaina — DONE)

Accepts a user's question, searches ChromaDB for relevant chunks, sends them to the Gemini API along with the question, and returns an answer based only on the retrieved document content.

**Request:**
```json
{
  "question": "What medications were prescribed?"
}
```

**Response (200 success):**
```json
{
  "answer": "..."
}
```

Note: if the answer isn't found in the uploaded documents, the response will say so (e.g. "I don't know.") rather than guessing.

---

## GET /documents  (built by Alaina — DONE)

Lists documents that have been uploaded so far. Currently stored in-memory (resets when the server restarts); will move to a proper Supabase database later.

**Response (200 success):**
```json
{
  "documents": [
    { "filename": "example.pdf", "uploaded_at": "2026-06-30T09:03:56.627637" }
  ]
}
```