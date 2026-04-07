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
  }
];
