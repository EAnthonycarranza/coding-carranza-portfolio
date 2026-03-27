"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  long_description: string | null;
  client_name: string | null;
  project_url: string | null;
  image_url: string | null;
  technologies: string | null;
  featured: number;
}

interface Props {
  project: Project | null;
  onSaved: () => void;
}

export default function ProjectForm({ project, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(project?.image_url || "");
  const [error, setError] = useState("");

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      } else {
        setError("Failed to upload image");
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.currentTarget;
    const body = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      long_description: (form.elements.namedItem("long_description") as HTMLTextAreaElement).value,
      client_name: (form.elements.namedItem("client_name") as HTMLInputElement).value,
      project_url: (form.elements.namedItem("project_url") as HTMLInputElement).value,
      image_url: imageUrl,
      technologies: (form.elements.namedItem("technologies") as HTMLInputElement).value,
      featured: (form.elements.namedItem("featured") as HTMLInputElement).checked,
    };

    try {
      const url = project ? `/api/projects/${project.id}` : "/api/projects";
      const method = project ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSaved();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card-bg border border-card-border rounded-xl p-6 space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={project?.title || ""}
            className="w-full px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="client_name" className="block text-sm font-medium mb-1">
            Client Name
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            defaultValue={project?.client_name || ""}
            className="w-full px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Short Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          required
          defaultValue={project?.description || ""}
          className="w-full px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-vertical"
        />
      </div>

      <div>
        <label htmlFor="long_description" className="block text-sm font-medium mb-1">
          Full Description
        </label>
        <textarea
          id="long_description"
          name="long_description"
          rows={5}
          defaultValue={project?.long_description || ""}
          className="w-full px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-vertical"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="project_url" className="block text-sm font-medium mb-1">
            Project URL
          </label>
          <input
            type="url"
            id="project_url"
            name="project_url"
            defaultValue={project?.project_url || ""}
            placeholder="https://example.com"
            className="w-full px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="technologies" className="block text-sm font-medium mb-1">
            Technologies (comma separated)
          </label>
          <input
            type="text"
            id="technologies"
            name="technologies"
            defaultValue={project?.technologies || ""}
            placeholder="React, Next.js, Tailwind"
            className="w-full px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Project Image</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm"
          />
          {uploading && <span className="text-sm text-muted">Uploading...</span>}
        </div>
        {imageUrl && (
          <div className="mt-2">
            <img
              src={imageUrl}
              alt="Preview"
              className="h-24 rounded border border-card-border object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          defaultChecked={!!project?.featured}
          className="rounded accent-accent"
        />
        <label htmlFor="featured" className="text-sm font-medium">
          Featured on homepage
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploading}
        className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : project ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}
