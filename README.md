<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2a3beef4-36bc-42ff-94ca-12626814d4d5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. If you want to upload images from your computer to Cloudinary in the admin panel, add these variables to `.env.local`:
   `CLOUDINARY_CLOUD_NAME`
   `CLOUDINARY_API_KEY`
   `CLOUDINARY_API_SECRET`
   `CLOUDINARY_UPLOAD_FOLDER`
4. If you want to protect admin-only AI and upload routes on the server, set:
   `NEXT_PUBLIC_ADMIN_EMAILS`
   `ADMIN_EMAILS`
   Optional for stricter server auth in some environments:
   `FIREBASE_ADMIN_PROJECT_ID`
   `FIREBASE_ADMIN_CLIENT_EMAIL`
   `FIREBASE_ADMIN_PRIVATE_KEY`
5. Run the app:
   `npm run dev`
