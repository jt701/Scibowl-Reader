import PyPDF2
from pdfminer.high_level import extract_text
import fitz

#various pdf2 parsers to potentially use
def parse_pdf(file_path):
    pdf_text = ""

    # Open the PDF file in binary read mode
    with open(file_path, "rb") as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            pdf_text += page.extract_text()
    return pdf_text



def parse_pdf2(file_path):
    pdf_text = ""

    # Open the PDF file
    pdf_document = fitz.open(file_path)
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        pdf_text += page.get_text("text")
    pdf_document.close()

    return pdf_text

import pdfplumber

def parse_pdf3(file_path):
    pdf_text = ""

    # Open the PDF file
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            pdf_text += page.extract_text()

    return pdf_text

def parse_pdf4(file_path):
    text = extract_text(file_path)
    print(text)
    
text = parse_pdf3("packets/set1-round1.pdf")
print(text)

