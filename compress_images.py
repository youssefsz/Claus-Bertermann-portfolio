"""
Image compression script for high-res gallery images.
Compresses JPEG images with high-quality settings to preserve visual quality
while reducing file size.
"""

import os
from PIL import Image
from pathlib import Path

def compress_image(input_path, output_path, quality=80):
    """
    Compress a JPEG image with high-quality settings.
    
    Args:
        input_path: Path to the input image file
        output_path: Path to save the compressed image
        quality: JPEG quality (1-100, higher = better quality)
    
    Returns:
        tuple: (original_size, compressed_size, compression_ratio)
    """
    try:
        # Get original file size
        original_size = os.path.getsize(input_path)
        
        # Open and compress the image
        with Image.open(input_path) as img:
            # Convert to RGB if necessary (some JPEGs might be in other modes)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create a white background for transparency
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = rgb_img
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save with high quality and optimization
            img.save(
                output_path,
                'JPEG',
                quality=quality,
                optimize=True,
                progressive=True
            )
        
        # Get compressed file size
        compressed_size = os.path.getsize(output_path)
        compression_ratio = (1 - compressed_size / original_size) * 100
        
        return original_size, compressed_size, compression_ratio
    
    except Exception as e:
        print(f"Error processing {input_path}: {str(e)}")
        return None, None, None

def main():
    """Main function to compress all images in the high-res folder."""
    # Set the folder path
    folder_path = Path("public/galleryy/high-res")
    
    if not folder_path.exists():
        print(f"Error: Folder '{folder_path}' does not exist!")
        return
    
    # Get all JPEG files
    image_files = list(folder_path.glob("*.jpg")) + list(folder_path.glob("*.jpeg"))
    
    if not image_files:
        print(f"No JPEG images found in '{folder_path}'")
        return
    
    print(f"Found {len(image_files)} images to compress...")
    print("-" * 60)
    
    total_original_size = 0
    total_compressed_size = 0
    successful = 0
    failed = 0
    
    # Process each image
    for idx, image_path in enumerate(image_files, 1):
        print(f"[{idx}/{len(image_files)}] Processing: {image_path.name}")
        
        # Compress the image (in-place, same filename)
        original_size, compressed_size, compression_ratio = compress_image(
            image_path,
            image_path,  # Save to same location (overwrite)
            quality=95  # High quality to preserve visual quality
        )
        
        if original_size and compressed_size:
            successful += 1
            total_original_size += original_size
            total_compressed_size += compressed_size
            
            # Convert sizes to MB for readability
            original_mb = original_size / (1024 * 1024)
            compressed_mb = compressed_size / (1024 * 1024)
            
            print(f"  Original: {original_mb:.2f} MB")
            print(f"  Compressed: {compressed_mb:.2f} MB")
            print(f"  Reduction: {compression_ratio:.1f}%")
        else:
            failed += 1
            print(f"  Failed to compress")
        
        print()
    
    # Print summary
    print("-" * 60)
    print("Compression Summary:")
    print(f"  Successful: {successful}")
    print(f"  Failed: {failed}")
    
    if successful > 0:
        total_original_mb = total_original_size / (1024 * 1024)
        total_compressed_mb = total_compressed_size / (1024 * 1024)
        total_reduction = (1 - total_compressed_size / total_original_size) * 100
        
        print(f"  Total original size: {total_original_mb:.2f} MB")
        print(f"  Total compressed size: {total_compressed_mb:.2f} MB")
        print(f"  Total space saved: {total_reduction:.1f}% ({total_original_mb - total_compressed_mb:.2f} MB)")

if __name__ == "__main__":
    main()

