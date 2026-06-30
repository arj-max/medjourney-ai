from fastapi import FastAPI, UploadFile, File
import shutil
import os
from datetime import datetime
from dotenv import load_dotenv
import google.generativeai as genai

from extract import extract_text_from_pdf
from chunk import chunk_text
from store import store_chunks, search_chunks

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()

# Temporary in-memory list to track uploaded documents (will move to Supabase later)
uploaded_documents = []

@app.get("/")
def read_root():
    return {"message": "Hello from MedJourney AI backend!"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(temp_path)
    chunks = chunk_text(text)
    store_chunks(chunks, file.filename)

    os.remove(temp_path)

    # Record this upload in our simple in-memory list
    uploaded_documents.append({
        "filename": file.filename,
        "uploaded_at": datetime.utcnow().isoformat()
    })

    return {
        "filename": file.filename,
        "chunks_created": len(chunks),
        "status": "success"
    }

@app.post("/chat")
async def chat(payload: dict):
    question = payload.get("question", "")

    relevant_chunks = search_chunks(question)
    context = "\n\n".join(relevant_chunks)

    prompt = f"""Answer the question based only on the following context. 
If the answer is not in the context, say you don't know.

Context:
{context}

Question: {question}

Answer:"""

    response = model.generate_content(prompt)

    return {"answer": response.text}

@app.get("/documents")
async def list_documents():
    return {"documents": uploaded_documents}