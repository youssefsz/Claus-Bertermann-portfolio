#!/usr/bin/env python3
"""
Gallery Image Downloader
Downloads all images from the gallery page and saves them locally.
"""

import os
import requests
import re
from urllib.parse import urlparse
from pathlib import Path
import time
from typing import List, Dict, Tuple

# Gallery images data extracted from GalleryPage.tsx
GALLERY_IMAGES = [
    {
        "id": "1",
        "title": "LPSS#CB – 2018",
        "dimensions": "120 × 100 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/LPSSCB-120x100-2018-600x722.jpg",
    },
    {
        "id": "2",
        "title": "MQQ1#CB – 2022",
        "dimensions": "180 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/MQQ1CB-180x150-2022-600x712.jpg",
    },
    {
        "id": "3",
        "title": "MQQ2#CB – 2022",
        "dimensions": "180 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-29-at-08.18.42-1-600x721.jpeg",
    },
    {
        "id": "4",
        "title": "5TJ3#CB – 2024",
        "dimensions": "200 × 200 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/5TJ3CB-200x200-2024-600x601.jpg",
    },
    {
        "id": "5",
        "title": "V2F2#CB – 2024",
        "dimensions": "200 × 200 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/V2F2CB-200x200-2024-600x601.jpg",
    },
    {
        "id": "6",
        "title": "GCOW#CB – 2024",
        "dimensions": "150 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/GCOWCB-150x150-2024-600x600.jpg",
    },
    {
        "id": "7",
        "title": "J20F#CB – 2023",
        "dimensions": "180 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/J20FCB-180x150-2023-600x498.jpg",
    },
    {
        "id": "8",
        "title": "456T#CB – 2024",
        "dimensions": "150 × 130 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/456TCB-150x130-2024-600x520.jpg",
    },
    {
        "id": "9",
        "title": "IZOP#CB – 2021",
        "dimensions": "150 × 130 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/IZOPCB-150x130-2021-600x520.jpg",
    },
    {
        "id": "10",
        "title": "9ENL#CB – 2024",
        "dimensions": "150 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/9ENLCB-150X150-2024-600x600.jpg",
    },
    {
        "id": "11",
        "title": "34NH#CB – 2025",
        "dimensions": "150 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/34NHCB-150x150-2025-600x600.jpg",
    },
    {
        "id": "12",
        "title": "G223#CB – 2020",
        "dimensions": "150 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/G223CB-150x150-2020-600x600.jpg",
    },
    {
        "id": "13",
        "title": "81BJ#CB – 2024",
        "dimensions": "180 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/81BJCB-180x150-2024-600x500.jpg",
    },
    {
        "id": "14",
        "title": "80BJ#CB – 2024",
        "dimensions": "180 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/80BJCB-180x150-2024-600x501.jpg",
    },
    {
        "id": "15",
        "title": "K33N#CB – 2024",
        "dimensions": "150 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-08.45.50-600x600.jpeg",
    },
    {
        "id": "16",
        "title": "U322#CB – 2025",
        "dimensions": "200 × 130 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/U322CB-200x130-2025-600x391.jpg",
    },
    {
        "id": "17",
        "title": "9BE4#CB – 2025",
        "dimensions": "130 × 80 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/9BE4CB-130x80-2025-600x370.jpg",
    },
    {
        "id": "18",
        "title": "33MG#CB – 2023",
        "dimensions": "150 × 100 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/33MGCB-150x100-2023-600x398.jpg",
    },
    {
        "id": "19",
        "title": "24GD#CB – 2023",
        "dimensions": "240 × 130 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/24GDCB-240x130-2023-SIGNED-600x332.jpg",
    },
    {
        "id": "20",
        "title": "9BE3#CB – 2025",
        "dimensions": "130 × 80 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-29-at-08.21.44-600x368.jpeg",
    },
    {
        "id": "21",
        "title": "91UI#CB – 2023",
        "dimensions": "130 × 80 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/91UICB-130x80-2023-600x372.jpg",
    },
    {
        "id": "22",
        "title": "S882#CB – 2024",
        "dimensions": "180 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.43.40-600x502.jpeg",
    },
    {
        "id": "23",
        "title": "YXX9#CB – 2024",
        "dimensions": "150 × 130 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-08.56.16-600x518.jpeg",
    },
    {
        "id": "24",
        "title": "Z2MF#CB – 2023",
        "dimensions": "180 × 130 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/Z2MFCB-180x130-2023-600x435.jpg.webp",
    },
    {
        "id": "25",
        "title": "9DNL#CB – 2024",
        "dimensions": "150 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/9DNLCB-150X150-2024-600x600.jpg",
    },
    {
        "id": "26",
        "title": "H5R6#CB – 2024",
        "dimensions": "200 × 200 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/H5R6CB-200x200-2024-600x606.jpg",
    },
    {
        "id": "27",
        "title": "B211#CB – 2024",
        "dimensions": "150 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/B211CB-150x150-2024-600x600.jpg",
    },
    {
        "id": "28",
        "title": "6784#CB – 2024",
        "dimensions": "150 × 130 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-08.57.37-600x692.jpeg",
    },
    {
        "id": "29",
        "title": "TGB2#CB – 2024",
        "dimensions": "150 × 140 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/TGB2CB-150x140-2024-600x649.jpg",
    },
    {
        "id": "30",
        "title": "23EB#CB – 2023",
        "dimensions": "160 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/23EBCB-160x150-2023-600x642.jpg",
    },
    {
        "id": "31",
        "title": "488K#CB – 2019",
        "dimensions": "150 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/488KCB-150x150-2019-600x599.jpg",
    },
    {
        "id": "32",
        "title": "Z333#CB – 2023",
        "dimensions": "90 × 90 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-10.05.54-600x593.jpeg",
    },
    {
        "id": "33",
        "title": "S883#CB – 2024",
        "dimensions": "180 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.44.31-600x500.jpeg",
    },
    {
        "id": "34",
        "title": "WK10#CB – 2023",
        "dimensions": "170 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/WK10CB-170x150-2023-600x678.jpg",
    },
    {
        "id": "35",
        "title": "G318#CB – 2023",
        "dimensions": "180 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-29-at-08.23.31-600x721.jpeg",
    },
    {
        "id": "36",
        "title": "7Z2Q#CB – 2024",
        "dimensions": "210 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/7Z2QCB-210x150-2024-600x835.jpg",
    },
    {
        "id": "37",
        "title": "7Z87#CB – 2025",
        "dimensions": "300 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/7Z87CB-300x150-2025-600x299.jpg",
    },
    {
        "id": "38",
        "title": "7Z88#CB – 2025",
        "dimensions": "300 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/02/WhatsApp-Image-2025-04-29-at-08.16.55-600x300.jpeg",
    },
    {
        "id": "39",
        "title": "IS33#CB – 2021",
        "dimensions": "250 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/IS33CB-250x150-2021-600x360.jpg",
    },
    {
        "id": "40",
        "title": "7U2N#CB – 2025",
        "dimensions": "200 × 200 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/05/7U2NCB-200x200-2025-600x600.jpg",
    },
    {
        "id": "41",
        "title": "4F3F#CB – 2023",
        "dimensions": "160 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-10.08.27-1-600x642.jpeg",
    },
    {
        "id": "42",
        "title": "QW2W#CB – 2021",
        "dimensions": "200 × 200 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.48.00-600x603.jpeg",
    },
    {
        "id": "43",
        "title": "8HXB#CB – 2018",
        "dimensions": "150 × 130 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.38.40.jpeg",
    },
    {
        "id": "44",
        "title": "E4RS#CB – 2018",
        "dimensions": "130 × 130 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-09.34.25-600x597.jpeg",
    },
    {
        "id": "45",
        "title": "9IJ9#CB – 2023",
        "dimensions": "180 × 150 cm",
        "img": "https://clausbertermann.com/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-29-at-10.11.01-600x440.jpeg",
    },
]

def sanitize_filename(filename: str) -> str:
    """Sanitize filename by removing/replacing invalid characters."""
    # Remove or replace invalid filename characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Remove extra spaces and replace with underscores
    filename = re.sub(r'\s+', '_', filename)
    return filename

def get_file_extension(url: str) -> str:
    """Extract file extension from URL."""
    parsed_url = urlparse(url)
    path = parsed_url.path
    # Handle .webp files that might have .jpg.webp extension
    if path.endswith('.webp'):
        return '.webp'
    elif path.endswith('.jpeg'):
        return '.jpeg'
    elif path.endswith('.jpg'):
        return '.jpg'
    else:
        return '.jpg'  # Default fallback

def download_image(url: str, filepath: str, headers: Dict[str, str] = None) -> bool:
    """Download a single image from URL to filepath."""
    try:
        if headers is None:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def create_gallery_structure() -> Path:
    """Create the gallery directory structure."""
    gallery_dir = Path("public/gallery")
    gallery_dir.mkdir(parents=True, exist_ok=True)
    return gallery_dir

def download_all_images() -> Tuple[int, int]:
    """Download all gallery images."""
    gallery_dir = create_gallery_structure()
    
    successful_downloads = 0
    failed_downloads = 0
    
    print(f"Starting download of {len(GALLERY_IMAGES)} images...")
    print(f"Images will be saved to: {gallery_dir.absolute()}")
    print("-" * 60)
    
    for i, image_data in enumerate(GALLERY_IMAGES, 1):
        url = image_data["img"]
        title = image_data["title"]
        image_id = image_data["id"]
        
        # Create filename from title and ID
        safe_title = sanitize_filename(title)
        extension = get_file_extension(url)
        filename = f"{image_id}_{safe_title}{extension}"
        filepath = gallery_dir / filename
        
        print(f"[{i:2d}/{len(GALLERY_IMAGES)}] Downloading: {title}")
        print(f"    URL: {url}")
        print(f"    Saving to: {filepath}")
        
        # Skip if file already exists
        if filepath.exists():
            print(f"    ✓ File already exists, skipping...")
            successful_downloads += 1
            continue
        
        # Download the image
        if download_image(url, str(filepath)):
            print(f"    ✓ Successfully downloaded")
            successful_downloads += 1
        else:
            print(f"    ✗ Failed to download")
            failed_downloads += 1
        
        # Add a small delay to be respectful to the server
        time.sleep(0.5)
        print()
    
    return successful_downloads, failed_downloads

def generate_updated_gallery_data() -> str:
    """Generate updated gallery data with local image paths."""
    gallery_dir = "public/gallery"
    
    updated_images = []
    for image_data in GALLERY_IMAGES:
        title = image_data["title"]
        image_id = image_data["id"]
        
        # Create the same filename logic as in download function
        safe_title = sanitize_filename(title)
        extension = get_file_extension(image_data["img"])
        filename = f"{image_id}_{safe_title}{extension}"
        local_path = f"/gallery/{filename}"
        
        updated_image = {
            **image_data,
            "img": local_path
        }
        updated_images.append(updated_image)
    
    return updated_images

def main():
    """Main function to download all gallery images."""
    print("Gallery Image Downloader")
    print("=" * 60)
    
    # Download all images
    successful, failed = download_all_images()
    
    print("=" * 60)
    print(f"Download Summary:")
    print(f"  ✓ Successful downloads: {successful}")
    print(f"  ✗ Failed downloads: {failed}")
    print(f"  Total images: {len(GALLERY_IMAGES)}")
    
    if successful > 0:
        print(f"\nImages saved to: {Path('public/gallery').absolute()}")
        print("\nTo use these images in your React app, update the GalleryPage.tsx file")
        print("to use local paths instead of remote URLs.")
    
    if failed > 0:
        print(f"\n{failed} images failed to download. Please check the URLs and try again.")

if __name__ == "__main__":
    main()
