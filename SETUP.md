# Wall of Winners ($WoW) - Setup Guide

This project uses **Supabase** for database and image storage. Follow these steps to get it running:

## 1. Supabase Project Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `supabase_setup.sql` (found in the root of this project).
3. Go to **Storage**:
   - Create a new bucket named `winners`.
   - Set it to **Public**.
   - Add a policy to allow **Public Uploads** and **Public Viewing**.

## 2. Environment Variables
1. Go to **Project Settings** > **API**.
2. Copy your `Project URL` and `anon public` key.
3. In AI Studio (or your local `.env`), set these variables:
   - `VITE_SUPABASE_URL`: Your Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your anon key

## 3. Deploying
- This project is ready for Vercel. 
- Make sure to add the environment variables in the Vercel dashboard.

## 4. Customization
- Update the `CA` constant in `src/App.tsx` with your real Contract Address.
- Update the social links in the header and footer.
