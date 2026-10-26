Project Overview

This project is an independently hosted web application featuring dynamic content management, custom authentication, private file storage, and integrated AI capabilities.

Core Features & System Architecture

1. Form Handling & Quote Submissions

Form Submissions: Contact and request forms automatically dispatch email notifications via W3Forms.

Data Persistence: Quote submissions are stored independently in the Supabase database prior to/alongside email delivery, ensuring no customer requests are lost due to mail server or domain issues.

2. AI Integration

Interactive Q&A: AI assistant powered by Gemini 2.8 Flash Lite (configured for responsive customer Q&A and support interaction).

3. Media & Storage Management

Private Buckets: All uploaded project media and assets are stored securely in Supabase Storage (site-media private bucket).

Signed URLs: Images and dynamic assets are rendered using temporary signed URLs to maintain security and comply with private bucket policies.

Project Gallery: Dedicated gallery for uploaded project comparisons using uncropped images, preserving full visibility for before-and-after views.

Reference Distinction: Online reference photos are maintained separately from verified company projects (completion dates are restricted strictly to verified project records).

4. Database & Dynamic Content Control

Dynamic Content: Homepage sections, gallery photos, and project posts are managed dynamically via the Supabase backend.

Fixed Layout Keys: Built-in sections use fixed key identifiers so layout structures remain in code while text, ordering, and visibility are managed via database records.

Consistent Branding: Shared company branding, phone elements, and top contact strips are reused across content pages and headers for complete site consistency.

5. Authentication & Admin Panel

Access Route: Admin management is accessed via the /auth route using email verification.

Role-Based Security: Admin access is governed strictly by the user_roles table (with owner access automatically assigned via database triggers upon signup). Security decisions are enforced on the backend/database level and never exclusively client-side.

Management Dashboard: Admins can edit homepage sections, gallery items, dynamic content, and system parameters directly from the /admin control panel.

Deployment & Setup

Database & Auth: Connect to your self-hosted or managed Supabase instance. Ensure the required schema migration scripts (user_roles table, storage bucket rules, and triggers) are applied.

Environment Variables:

VITE_SUPABASE_URL: Your Supabase Project URL

VITE_SUPABASE_ANON_KEY: Your Supabase Public Anon Key

W3FORMS_ACCESS_KEY: W3Forms API key for form submissions

GEMINI_API_KEY: API key for Gemini 2.8 Flash Lite integration

Build & Run:

npm install
npm run build
npm run start
