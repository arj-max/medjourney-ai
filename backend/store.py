import chromadb
from chromadb.utils import embedding_functions
from extract import extract_text_from_pdf
from chunk import chunk_text

# This creates (or connects to) a local ChromaDB database stored in a folder called "chroma_db"
client = chromadb.PersistentClient(path="./chroma_db")

# This uses a free, built-in embedding model so we don't need any API key for this test
embedding_function = embedding_functions.DefaultEmbeddingFunction()

# This creates (or gets, if it already exists) a "collection" — think of it like a table for our document chunks
collection = client.get_or_create_collection(
    name="documents",
    embedding_function=embedding_function
)

def store_chunks(chunks, source_filename):
    ids = [f"{source_filename}_chunk_{i}" for i in range(len(chunks))]
    collection.add(
        documents=chunks,
        ids=ids,
    )
    print(f"Stored {len(chunks)} chunks from {source_filename} into ChromaDB.")

def search_chunks(question, n_results=3):
    """
    Searches ChromaDB for the chunks most relevant to the user's question.
    Returns a list of matching text chunks.
    """
    results = collection.query(
        query_texts=[question],
        n_results=n_results,
    )
    # results["documents"][0] is the list of matching chunk texts
    return results["documents"][0]
if __name__ == "__main__":
    text = extract_text_from_pdf("sample.pdf")
    chunks = chunk_text(text)
    store_chunks(chunks, "sample.pdf")

    # Quick sanity check: how many total chunks are in the database now?
    print("Total items now in ChromaDB collection:", collection.count())