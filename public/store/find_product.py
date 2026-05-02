
import os
from bs4 import BeautifulSoup

file_path = "/Users/ulissescardoso/suplements/public/store/collections_bestseller.html"
with open(file_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

cards = soup.find_all(class_=["product-card", "product-card-sample"])
for i, card in enumerate(cards):
    text = card.get_text(separator=" ").strip()
    if "Elite" in text or "Paket" in text:
        print(f"Card {i} (line {card.sourceline}): {text[:200]}")
