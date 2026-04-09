export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  long_description: string | null;
  client_name: string | null;
  project_url: string | null;
  image_url: string | null;
  technologies: string | null;
  featured: boolean;
  created_at: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Milk & Honey Coffee Cart",
    slug: "milk-and-honey",
    description: "A modern, faith-based mobile coffee cart application with a custom CMS and seamless cloud integration.",
    long_description: `Milk & Honey Coffee Cart is a comprehensive digital solution for a premium mobile coffee catering business. The project encompasses a high-end public website for customers and a robust administrative dashboard for full business management.

**Challenge: Seamless Cloud Asset Management**
Managing image uploads across different environments (local vs. production) while ensuring performance and security without exhausting server memory on ephemeral platforms like Heroku.

**Solution: Automated GCS Middleware**
I implemented a custom middleware using Multer and the @google-cloud/storage SDK. By using memory streaming, image buffers are sent directly to Google Cloud Storage, bypassing local disk I/O and ensuring a highly performant, scalable solution.

**Challenge: Dynamic Content Control**
The client needed to modify the site’s layout and content in real-time without needing to write code or understand the underlying database structure.

**Solution: Custom Section-Based CMS**
I developed a "Section-Based" schema in MongoDB paired with a matching React-based editor. This custom "Page Builder" allows admins to reorder content blocks and edit text with a live preview, providing immediate visual feedback before any changes are committed.

**Challenge: Business Lead Generation**
Streamlining the inquiry process for private events while protecting the platform from spam and ensuring secure administrative access.

**Solution: Integrated Quote System**
I integrated a dedicated quote request system with real-time email notifications via Nodemailer. To secure the platform, I implemented JSON Web Tokens (JWT) for authentication and Google reCAPTCHA to prevent bot submissions, creating a safe and efficient environment for business growth.`,
    client_name: "Milk & Honey",
    project_url: "https://www.themilkandhoney.co",
    image_url: "https://themilkandhoney.co/static/media/Logo.c6eabcf5c49deefa02f7.png",
    technologies: "React 18, Node.js, Express, MongoDB, Google Cloud Storage, Tailwind CSS, JWT",
    featured: true,
    created_at: "2026-04-07 17:50:35"
  },
  {
    id: 2,
    title: "Carranza Restoration LLC",
    slug: "carranza-restoration",
    description: "A leading platform dedicated to home restoration and improvement services, specializing in expert estimates and meticulous renovations.",
    long_description: `**Carranza Restoration LLC** is a leading platform dedicated to home restoration and improvement services. We specialize in transforming visions into reality with our expert estimates, meticulous renovations, and detailed project management. Visit us at [carranzarestoration.com](https://www.carranzarestoration.com).

**Challenge: Mobile UI Responsiveness & Navigation**
The initial mobile navigation suffered from alignment issues, particularly with nested "Pages" dropdowns, and lacked visual feedback for the menu state.

**Solution: Sidebar-Based Navigation**
I rehauled the mobile navbar with a custom sidebar design, implementing a CSS-based "X" animation for the toggle button and adjusting layout parameters to ensure links were perfectly centered and legible on small screens.

**Challenge: Secure Authentication & Role Management**
Establishing a secure admin-only area while allowing social login (Google) for regular users was a critical requirement for business operations.

**Solution: Dual-Strategy Passport.js Integration**
I built a dual-strategy authentication system using Passport.js. I implemented JWT for session-less authentication and created custom middleware to protect sensitive administrative routes and dashboards, ensuring a safe environment for both users and admins.

**Challenge: Automated CRM Synchronization**
Ensuring leads from the website were instantly available in JobNimbus without manual data entry was essential for operational efficiency.

**Solution: Backend Lead Pipeline**
I developed a backend service that hooks into the "Free Quote" form submission, formats the data according to JobNimbus API requirements, and pushes it via secure headers, with a fallback to Google Sheets for total redundancy.

**Challenge: Branding & Visual Consistency**
Multiple sections used inconsistent logo assets, leading to broken images and fragmented branding across the Portfolio and Footer sections.

**Solution: Centralized Asset Management**
I consolidated all partner logos into a local asset folder and updated all components to use these shared imports, ensuring 100% reliability and visual harmony across the entire platform.

**Challenge: Text Visibility on Dynamic Backgrounds**
Several sections used dark, high-contrast background images (e.g., the Appointment section), making standard text unreadable.

**Solution: Intelligent CSS Overrides**
I applied utility classes and targeted CSS overrides to ensure text elements automatically switch to light colors when placed over dark hero sections, maintaining high accessibility and readability standards.`,
    client_name: "Carranza Restoration LLC",
    project_url: "https://www.carranzarestoration.com",
    image_url: "https://storage.googleapis.com/carranzarestorationllc/Untitled%20design%20(90).png",
    technologies: "React 18, Node.js, Express, MongoDB, Passport.js, Google Cloud Storage, JobNimbus API, Recharts, Bootstrap 5",
    featured: true,
    created_at: "2026-04-08 10:00:00"
  },
  {
    id: 3,
    title: "Carranza Wedding 2025",
    slug: "carranza-wedding-2025",
    description: "A comprehensive, guest-centric wedding platform featuring a secure RSVP system, interactive travel guides, and a high-performance photo gallery.",
    long_description: `A comprehensive, guest-centric wedding platform built to provide a seamless experience for attendees. The application features a secure RSVP system, interactive travel guides for San Antonio, integrated lodging recommendations, and a high-performance photo gallery with bulk download capabilities.

**Demo Note:** To view the live site, click on **"Explore Guest Demo"** to bypass the password requirement. Please note that some features (like live Airbnb/Hotel APIs) now use high-fidelity visual placeholders to emulate functionality without external subscription costs.

**Challenge: CORS Restrictions on Bulk Downloads**
When trying to fetch images from Google Cloud Storage to create a .zip file, the browser blocked requests due to missing CORS headers.

**Solution: Server-Side Image Proxying**
I built a backend proxy endpoint that uses axios to stream binary data directly from GCS to the client. This secure bridge satisfies browser security policies while allowing users to download high-resolution galleries in bulk.

**Challenge: Visual Fidelity Without Assets**
Transitioning to a demo version required removing many specific listing images to keep the application lightweight without sacrificing the "premium" feel.

**Solution: Typography-Centric Design**
I refactored the UI from an image-centric layout to a typography-centric one. Using Material UI (MUI) Cards with distinct border-left accents and modern CSS gradients, I ensured the pages looked polished and functional even without external photos.

**Challenge: Managing Asynchronous Progress**
Downloading 20+ high-resolution photos (~200MB) is a time-consuming process that often left users wondering if the action had failed.

**Solution: Real-Time State Machine**
I implemented a Backdrop state machine that provides immediate visual confirmation and a real-time progress counter (e.g., "Downloading 5 of 21..."), ensuring a transparent and user-friendly experience during large data operations.`,
    client_name: "Personal Project",
    project_url: "https://wedding2025-af469056c3d2.herokuapp.com/",
    image_url: "https://storage.googleapis.com/carranzawedding/Gemini_Generated_Image_5impgv5impgv5imp.png",
    technologies: "React 18, Material UI (MUI), Node.js, Express, MongoDB, Google Cloud Storage, JWT, React-Leaflet",
    featured: true,
    created_at: "2026-04-08 14:00:00"
  }
];
