from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
import re
from typing import List, Optional
import cv2
import numpy as np
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Player(BaseModel):
    gamertag: str
    kills: int
    deaths: int
    score: int

def process_image(img):
    """
    Enhances image for better OCR accuracy.
    Converts to grayscale, increases contrast, applies blur, and performs binarization.
    """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.convertScaleAbs(gray, alpha=2.0, beta=0)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    kernel = np.ones((1, 1), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    return binary

def returnPlayer(gamertag, text):
    """
    Extracts player statistics from OCR-extracted text using regex pattern matching.
    """
    if not gamertag:
        return None
    
    gamertag = gamertag.lower()
    
    # Regex pattern to find gamertag followed by three numerical values
    pattern = fr"\b({gamertag})\s*\D*(\d+)\s(\d+)\s(\d+)"
    match = re.findall(pattern, text, re.IGNORECASE)
    
    if not match:
        print(f"No match found for gamertag: {gamertag}")
        print(f"Pattern used: {pattern}")
        return None
    
    try:
        return Player(
            gamertag=match[0][0].strip(),
            kills=int(match[0][1]),
            deaths=int(match[0][2]),
            score=int(match[0][3])
        )
    except Exception as e:
        print(f"Error creating player: {e}")
        return None

@app.post("/upload")
async def upload_images(
    files: List[UploadFile],
    primary_tag: str = Form(...),
    secondary_tag: Optional[str] = Form(None)
):
    """
    API endpoint to upload images, extract text using OCR, and retrieve player data.
    """
    player1 = None
    player2 = None
    
    playerResults = []
        
    for file in files:
        # Read uploaded image
        contents = await file.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # Process the image to enhance text recognition
        processed_img = process_image(img)

        # Configure Tesseract for improved OCR accuracy
        custom_config = r'--oem 1 --psm 6 -c tessedit_char_blacklist=()[]AEIOUABCDEFGHIJKLMNOPQRSTUVWXYZ'
        
        # Perform OCR
        text = pytesseract.image_to_string(processed_img, config=custom_config)
        
        # Extract player data from text
        found_player1 = returnPlayer(primary_tag, text)
        if found_player1:
            player1 = found_player1
            
        if secondary_tag:
            found_player2 = returnPlayer(secondary_tag, text)
            if found_player2:
                player2 = found_player2
        
        playerResults.append({
            "filename": file.filename,
            "player1": player1.dict() if player1 else None,
            "player2": player2.dict() if player2 else None
        })
                
    return playerResults