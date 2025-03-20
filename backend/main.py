from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import pytesseract
import re
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/upload/")
async def upload_images(
    files: List[UploadFile],
    primary_tag: str = Form(...),
    secondary_tag: Optional[str] = Form(None)
):
    extracted_texts = {}
    matches = {}
    
    # Prepare gamertags for regex search - escape special characters
    primary_pattern = re.escape(primary_tag.strip())
    secondary_pattern = re.escape(secondary_tag.strip()) if secondary_tag else None
    
    for file in files:
        contents = await file.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # Convert to grayscale (preprocessing for Tesseract)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Extract text using Tesseract
        text = pytesseract.image_to_string(gray)
        
        # Store extracted text
        extracted_texts[file.filename] = text
        
        # Search for gamertags in the text
        primary_found = bool(re.search(primary_pattern, text, re.IGNORECASE))
        
        if secondary_pattern:
            secondary_found = bool(re.search(secondary_pattern, text, re.IGNORECASE))
        else:
            secondary_found = None
            
        # Store match results
        matches[file.filename] = {
            "primary_tag_found": primary_found,
            "secondary_tag_found": secondary_found
        }

    return {
        "texts": extracted_texts,
        "matches": matches,
        "primary_tag": primary_tag,
        "secondary_tag": secondary_tag
    }