from fastapi import FastAPI, UploadFile, File
import shutil
import os

from extract import extract_text_from_pdf
from chunk import chunk_text
from store import store_chunks

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from MedJourney AI backend!"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # Save the uploaded file temporarily to disk
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run it through our pipeline
    text = extract_text_from_pdf(temp_path)
    chunks = chunk_text(text)
    store_chunks(chunks, file.filename)

    # Clean up the temporary file
    os.remove(temp_path)

    return {
        "filename": file.filename,
        "chunks_created": len(chunks),
        "status": "success"
    }