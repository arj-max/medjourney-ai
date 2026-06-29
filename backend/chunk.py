from langchain_text_splitters import RecursiveCharacterTextSplitter
from extract import extract_text_from_pdf

def chunk_text(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,      # roughly how many characters per chunk
        chunk_overlap=50,    # slight overlap so context isn't lost between chunks
    )
    chunks = splitter.split_text(text)
    return chunks

if __name__ == "__main__":
    text = extract_text_from_pdf("sample.pdf")
    chunks = chunk_text(text)
    print("----- NUMBER OF CHUNKS:", len(chunks), "-----")
    for i, chunk in enumerate(chunks):
        print(f"\n--- Chunk {i+1} ---")
        print(chunk)