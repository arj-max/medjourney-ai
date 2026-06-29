import fitz  # this is PyMuPDF's import name

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    doc.close()
    return full_text

if __name__ == "__main__":
    text = extract_text_from_pdf("sample.pdf")
    print("----- EXTRACTED TEXT -----")
    print(text)
    print("----- TOTAL CHARACTERS:", len(text), "-----")