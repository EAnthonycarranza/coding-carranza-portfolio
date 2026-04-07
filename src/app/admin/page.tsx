"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  long_description: string | null;
  client_name: string | null;
  project_url: string | null;
  image_url: string | null;
  technologies: string | null;
  featured: number;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        if (isMounted) router.push("/admin/login");
        return;
      }
      if (isMounted) {
        await fetchProjects();
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [router, fetchProjects]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function handleSaved() {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  }

  function handleEdit(project: Project) {
    setEditingProject(project);
    setShowForm(true);
  }

  function handleNewProject() {
    setEditingProject(null);
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-muted hover:text-red-500 transition-colors"
        >
          Log Out
        </button>
      </div>

      {showForm ? (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
              className="text-sm text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <ProjectForm project={editingProject} onSaved={handleSaved} />
        </div>
      ) : (
        <button
          onClick={handleNewProject}
          className="mb-8 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          + Add New Project
        </button>
      )}

      {/* Projects Table */}
      <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-card-border">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-sm font-semibold hidden md:table-cell">
                Client
              </th>
              <th className="px-6 py-3 text-sm font-semibold hidden sm:table-cell">
                Featured
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted">
                  No projects yet. Add your first one!
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{project.title}</td>
                  <td className="px-6 py-4 text-muted hidden md:table-cell">
                    {project.client_name || "-"}
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    {project.featured ? (
                      <span className="text-accent text-sm font-medium">Yes</span>
                    ) : (
                      <span className="text-muted text-sm">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-sm text-accent hover:text-accent-dark font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
