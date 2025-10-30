# Admin Dashboard Setup Guide

## Overview

This document explains the admin dashboard implementation for managing the gallery, including authentication, image management, and deployment to Hostinger.

---

## Features Implemented

### 1. **Backend (PHP)**

#### Authentication System (`/API/auth.php`)
- Session-based authentication (expires when browser closes)
- Plain text password: `admin123` (can be changed in the file)
- Endpoints:
  - `POST /API/auth.php` with `{ "action": "login", "password": "..." }` - Login
  - `POST /API/auth.php` with `{ "action": "logout" }` - Logout
  - `GET /API/auth.php` - Check authentication status

#### Gallery API (`/API/Gallery.php`)
- **GET** `/API/Gallery.php` - Returns all gallery images (sorted by order)
- **POST** `/API/Gallery.php` - Add new image (requires authentication)
  - Uploads image file
  - Creates two copies:
    - **Original**: High-res WebP (100% quality) stored in `/API/uploads/originals/`
    - **Thumbnail**: Compressed WebP (80% quality) stored in `/API/uploads/thumbs/`
  - Saves metadata to Gallery.json
- **PUT** `/API/Gallery.php` - Update or reorder images (requires authentication)
  - Action: `reorder` - Save new order after drag-drop
  - Action: `update` - Update image details (title, dimensions, medium, year)
- **DELETE** `/API/Gallery.php` - Delete image and files (requires authentication)

#### Data Structure (`/API/data/Gallery.json`)
```json
{
  "images": [
    {
      "id": "ABC123",
      "title": "Image Title",
      "dimensions": "150 × 150 cm",
      "medium": "Oil on Canvas",
      "year": "2024",
      "thumbnailPath": "/API/uploads/thumbs/ABC123.webp",
      "originalPath": "/API/uploads/originals/ABC123.webp",
      "order": 0
    }
  ]
}
```

### 2. **Frontend (React/TypeScript)**

#### Admin Login Page (`/admin/login`)
- Clean, centered login form
- Password field with show/hide toggle
- Redirects to dashboard on successful authentication
- Matches existing design aesthetics (dark theme with magenta/purple accents)

#### Admin Dashboard (`/admin`)
- **Protected route** - Automatically redirects to login if not authenticated
- **Three tabs**: Gallery (active), Auctions (placeholder), Press (placeholder)
- **Gallery Management**:
  - Grid view of all images with thumbnails
  - **Drag-and-drop reordering** - Simply drag images to reorder, saves automatically
  - **Add Image** - Upload new image with form (title, dimensions, medium, year)
  - **Edit Image** - Update image details
  - **Delete Image** - Remove image with confirmation dialog
  - Real-time order saving with feedback

#### Updated Gallery Page
- Now fetches data from `/API/Gallery.php` instead of hardcoded list
- Maintains all existing UI/UX features:
  - Masonry layout
  - Load more functionality
  - Image popup with magnifier
  - Smooth animations
- Shows loading state while fetching
- Error handling with retry option
- Uses thumbnail images for gallery, original images for popups

#### Updated App Routing
- Admin routes separated from main site routes
- Admin pages don't show navigation or footer
- Maintains existing page transitions for main site

---

## How to Use

### Accessing the Admin Dashboard

1. Navigate to `http://yoursite.com/admin` or `http://localhost:5173/admin`
2. You'll be redirected to `/admin/login`
3. Enter password: `admin123`
4. Click "Login"

### Managing Gallery Images

#### Adding a New Image
1. Click the **"Add Image"** button
2. Click to upload an image file (JPG, PNG, GIF, WebP supported)
3. Fill in the details:
   - Title (required)
   - Dimensions (e.g., "150 × 150 cm")
   - Medium (e.g., "Oil on Canvas")
   - Year (e.g., "2024")
4. Click **"Add Image"**
5. The image will be:
   - Converted to WebP format
   - Compressed for gallery display (80% quality)
   - Original kept for popup view (100% quality)
   - Added to the gallery

#### Editing an Image
1. Click the **"Edit"** button on an image card
2. Update the details you want to change
3. Click **"Save Changes"**
4. Note: You cannot change the image file itself when editing

#### Reordering Images
1. Simply **drag** an image card and drop it in the desired position
2. The order is saved automatically
3. You'll see a "Saving order..." message while it saves
4. The new order will be reflected on the public gallery page

#### Deleting an Image
1. Click the **"Delete"** button on an image card
2. Confirm the deletion in the dialog
3. The image and all its files will be permanently removed

### Logging Out
- Click the **"Logout"** button in the top right corner
- You'll be redirected to the login page

---

## File Structure

```
project/
├── public/API/
│   ├── auth.php              # Authentication endpoints
│   ├── Gallery.php           # Gallery CRUD API
│   ├── data/
│   │   └── Gallery.json      # Gallery data storage
│   └── uploads/
│       ├── originals/        # High-res original images
│       └── thumbs/           # Compressed thumbnails
├── dist/API/                 # Same structure (for deployment)
├── src/
│   ├── pages/
│   │   ├── AdminLogin.tsx    # Login page
│   │   ├── AdminDashboard.tsx # Dashboard page
│   │   └── GalleryPage.tsx   # Updated to use API
│   └── App.tsx               # Updated with admin routes
```

---

## Deployment to Hostinger

### Steps to Deploy

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload to Hostinger**:
   - Go to your Hostinger File Manager
   - Upload all contents of the `dist/` folder to your public_html directory (or subdirectory)

3. **Verify PHP works**:
   - Test: `http://yoursite.com/API/auth.php` (should return JSON)
   - Test: `http://yoursite.com/API/Gallery.php` (should return gallery data)

4. **Set proper permissions**:
   - Ensure `API/uploads/` folder is writable (755 or 775)
   - Ensure `API/data/Gallery.json` is writable (644 or 664)

5. **Access the site**:
   - Main site: `http://yoursite.com/`
   - Admin: `http://yoursite.com/admin/login`

### Important Notes

- The PHP files in `dist/API/` are already set up for production
- Make sure your Hostinger hosting supports PHP (should be enabled by default)
- PHP GD library is used for image processing (usually included in Hostinger)
- Sessions work automatically with PHP

---

## Changing the Admin Password

1. Open `public/API/auth.php` (and `dist/API/auth.php` after building)
2. Find line: `define('ADMIN_PASSWORD', 'admin123');`
3. Change `'admin123'` to your desired password
4. Save the file
5. Re-upload to Hostinger if already deployed

---

## Future Enhancements (Placeholders Created)

### Auctions Management
- Access via the "Auctions" tab in admin dashboard
- Will allow managing auctioned works similar to gallery

### Press Management
- Access via the "Press" tab in admin dashboard
- Will allow managing press releases and media content

---

## Technical Details

### Image Processing
- Uses PHP GD library (built-in, no extra dependencies)
- Automatically converts any image format (JPG, PNG, GIF, WebP) to WebP
- Creates two versions:
  - Original: 100% quality for popup view
  - Thumbnail: 80% quality for gallery display
- Maintains aspect ratio automatically

### Security
- Session-based authentication
- All write operations (POST, PUT, DELETE) require authentication
- Read operations (GET) are public for gallery display
- Sessions expire when browser closes

### Performance
- Gallery page loads incrementally (6 images at a time)
- Preloads high-res images in batches
- Lazy loading of image dimensions
- Optimized WebP format for smaller file sizes

---

## Troubleshooting

### Gallery page not loading images
- Check if `/API/Gallery.php` is accessible
- Verify `Gallery.json` exists and has proper permissions
- Check browser console for errors

### Can't login to admin
- Verify password is correct (`admin123` by default)
- Check if `/API/auth.php` is accessible
- Clear browser cookies and try again

### Image upload fails
- Check if `API/uploads/` folders exist and are writable
- Verify PHP upload limits (default is usually 8MB)
- Check PHP GD extension is installed

### Images not displaying after upload
- Verify files were created in `uploads/originals/` and `uploads/thumbs/`
- Check file permissions
- Verify `Gallery.json` was updated correctly

---

## Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check server error logs for PHP errors
3. Verify all files were uploaded correctly
4. Ensure proper file permissions on Hostinger

---

## Credits

Implementation follows modern web development best practices:
- React with TypeScript for type safety
- PHP for server-side logic
- JSON for data storage (simple and reliable)
- WebP for optimized image delivery
- Session-based authentication for security

