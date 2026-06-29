\# MedJourney AI – API Contract



This document describes what each backend API endpoint expects and returns, so frontend and backend work can stay in sync without reading each other's code.



\---



\## POST /upload  (built by Anjana — DONE)



Uploads a PDF, extracts its text, splits it into chunks, and stores those chunks in ChromaDB.



\*\*Request:\*\* multipart/form-data with one field:

\- `file`: a PDF file



\*\*Response (200 success):\*\*

```json

{

&#x20; "filename": "example.pdf",

&#x20; "chunks\_created": 62,

&#x20; "status": "success"

}

```



\---



\## POST /chat  (to be built by Alaina — PLACEHOLDER, details TBD)



Will accept a user's question, search ChromaDB for relevant chunks, send them to the Claude API, and return an answer.



\*\*Expected request (placeholder):\*\*

```json

{

&#x20; "question": "What medications were prescribed?"

}

```



\*\*Expected response (placeholder):\*\*

```json

{

&#x20; "answer": "..."

}

```



\---



\## GET /documents  (to be built by Alaina — PLACEHOLDER, details TBD)



Will list documents that have been uploaded so far.



\*\*Expected response (placeholder):\*\*

```json

{

&#x20; "documents": \[

&#x20;   { "filename": "example.pdf", "uploaded\_at": "..." }

&#x20; ]

}

```

