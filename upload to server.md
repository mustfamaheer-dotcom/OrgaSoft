# Image Upload and Display Plan

Based on the new server details provided, here is the full plan to migrate the image uploads to your new cPanel server while maintaining the ability to read and display existing images from ImageKit.

## 1. Uploading Images to the New Server

Since the new server is a cPanel hosting environment (IP: 173.248.156.26), the standard and most efficient way to handle file uploads from a frontend application (like this React/Vite admin panel) is to host a lightweight backend script (like PHP) on the server.

### Implementation Details:
- **Server-Side Upload Script (`upload.php`)**:
  - We will write a PHP script that will be placed on your server (e.g., inside `public_html/api/upload.php`).
  - This script will receive the image file via a `POST` request, validate the file type (e.g., ensuring it's a valid image like PNG, JPG, WebP), and save it to an `uploads/` directory on your server.
  - It will then return the full URL of the uploaded image (e.g., `http://www.orga4soft.com/uploads/image_name.jpg`).
  - **Security**: The script will require a secret token/key sent from the admin panel so that only authorized users can upload files.

- **Frontend Upload Logic (`lib/imagekit.ts` & `admin/components/FormComponents.tsx`)**:
  - We will create a new function `uploadToServer(file)` in the frontend.
  - We will modify the `ImageUpload` component in the admin panel so that when you choose an image, it sends a `FormData` request to the new PHP script instead of ImageKit.
  - The returned URL (`http://www.orga4soft.com/...`) will be saved to your database.

## 2. Reading and Displaying Images (Dual Support)

You requested that images be displayed from both the new server and ImageKit. This is important so that older data using ImageKit URLs will not break.

### Implementation Details:
- **Update Image Display Utility**:
  - We will modify the function that generates image URLs (currently `getOptimizedUrl` in `lib/imagekit.ts`).
  - **Logic**: 
    - If the image URL string starts with `https://ik.imagekit.io`, the system will continue to treat it as an ImageKit image and apply ImageKit optimizations.
    - If the image URL starts with `http://www.orga4soft.com` (or is a relative path), the system will simply return the direct URL to load the image from your new server.
- **Update Image Components**:
  - The `<KitImage />` component will be updated to gracefully handle both types of URLs without throwing errors.
- **Hardcoded Fallbacks**:
  - Files like `constants.ts`, `App.tsx`, and `views/ProductDetail.tsx` currently have hardcoded ImageKit fallback logos (e.g., `ORGANEWLOGOtbg.png`). We will keep these as-is for now, as the new dual-support logic will handle them perfectly.

## 3. Summary of Files to be Modified
- `admin/components/FormComponents.tsx`: Switch the upload action from ImageKit to the new server endpoint.
- `lib/imagekit.ts`: Add the new `uploadToServer` function and modify URL generation logic to support both CDN and Server URLs.
- `components/KitImage.tsx`: Update to support the dual URL logic.
- **[NEW]** `upload.php`: A new file we will create for you to upload to your cPanel server via FTP (`ftp.orga4soft.com`) using the `orga4s` credentials.

## 4. Next Steps & Questions for You

Before we proceed with writing the code, please review the following:

1. **PHP Support**: This plan assumes we will use a simple PHP script on your cPanel server to handle the uploads. Are you okay with uploading a small `upload.php` file to your server via FTP?
2. **CORS (Cross-Origin Resource Sharing)**: Since your admin panel might be hosted on a different domain/Firebase, the PHP script will need to allow cross-origin requests. We will configure this in the PHP file.
3. **Approval**: If this plan looks good to you, let me know and I will start implementing the changes in the codebase and generate the `upload.php` file for you!
