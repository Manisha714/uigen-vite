import { useState, useEffect, useCallback } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { FileSystemProvider, useFileSystem } from "@/contexts/FileSystemContext";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { LogIn, LogOut, Plus, FolderOpen, Download, LayoutGrid } from "lucide-react";
import { ComponentGallery } from "@/components/gallery/ComponentGallery";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

function MainContent() {
  const [activeView, setActiveView] = useState<"preview" | "code" | "gallery">("preview");
  const [authOpen, setAuthOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const { user, signOut } = useAuth();
  const { files, loadFiles, reset } = useFileSystem();
  const [saving, setSaving] = useState(false);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [chatKey, setChatKey] = useState(0);
  const [projectName, setProjectName] = useState<string>("");

  // Fetch user's projects when logged in
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/projects", { credentials: "include" });
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Start a new (blank) project. Does NOT persist until the user sends a message.
  const createProject = () => {
    setProjectId(undefined);
    setProjectName("");
    setInitialMessages([]);
    setChatKey((k) => k + 1);
    reset();
    setShowProjects(false);
  };

  // Lazily ensure a project exists before sending the first message.
  // Does NOT remount the chat or reset files (that would interrupt the in-flight submit).
  const ensureProject = async (): Promise<string | undefined> => {
    if (projectId) return projectId;
    if (!user) return undefined;
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: `Design ${new Date().toLocaleString()}` }),
      });
      const data = await res.json();
      if (data.project) {
        setProjectId(data.project.id);
        setProjectName(data.project.name);
        fetchProjects();
        return data.project.id;
      }
    } catch (err) {
      console.error("Failed to create project:", err);
    }
    return undefined;
  };

  // Save generated files to disk
  const saveFiles = async () => {
    if (files.size === 0) return;
    setSaving(true);
    try {
      const filesObj: Record<string, string> = {};
      files.forEach((content, path) => {
        filesObj[path] = content;
      });
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ files: filesObj }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Saved ${data.files.length} files to ${data.outputDir}`);
      } else {
        alert("Failed to save: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save files");
    } finally {
      setSaving(false);
    }
  };

  // Load a saved project
  const loadProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { credentials: "include" });
      const data = await res.json();
      if (data.project) {
        setProjectId(id);
        setProjectName(data.project.name);
        if (data.project.data) {
          loadFiles(data.project.data);
        }
        if (data.project.messages && Array.isArray(data.project.messages)) {
          setInitialMessages(data.project.messages);
        } else {
          setInitialMessages([]);
        }
        setChatKey((k) => k + 1);
        setShowProjects(false);
      }
    } catch (err) {
      console.error("Failed to load project:", err);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-neutral-50">
      <PanelGroup direction="horizontal" className="h-full">
        {/* Left Panel — Chat */}
        <Panel defaultSize={35} minSize={25} maxSize={50}>
          <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-6 border-b border-neutral-200/60">
              <div>
                <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">
                  UI Generator
                </h1>
                {projectName && (
                  <p className="text-[10px] text-gray-400 -mt-0.5 truncate max-w-[140px]">
                    {projectName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <button
                      onClick={() => setShowProjects(!showProjects)}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                      title="My Projects"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={createProject}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                      title="New Project"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-gray-500">{user.email}</span>
                    <button
                      onClick={() => {
                        signOut();
                        setProjectId(undefined);
                        setProjectName("");
                        setProjects([]);
                        setInitialMessages([]);
                        setChatKey((k) => k + 1);
                        reset();
                      }}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                      title="Sign out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Project List */}
            {showProjects && (
              <div className="border-b border-neutral-200 bg-neutral-50 p-3 max-h-48 overflow-y-auto">
                <p className="text-xs font-medium text-gray-500 mb-2">Your Projects</p>
                {projects.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No saved projects yet</p>
                ) : (
                  projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => loadProject(p.id)}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded hover:bg-white truncate ${
                        projectId === p.id ? "bg-white font-medium text-neutral-900" : "text-gray-600"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Chat */}
            <div className="flex-1 overflow-hidden">
              <ChatInterface key={chatKey} projectId={projectId} initialMessages={initialMessages} onEnsureProject={ensureProject} onChatFinish={() => {
                fetchProjects();
                // Refresh current project name
                if (projectId) {
                  fetch(`/api/projects/${projectId}`, { credentials: "include" })
                    .then((r) => r.json())
                    .then((d) => { if (d.project?.name) setProjectName(d.project.name); })
                    .catch(() => {});
                }
              }} />
            </div>
          </div>
        </Panel>

          <PanelResizeHandle className="w-[1px] bg-neutral-200 hover:bg-neutral-400 transition-colors" />

          {/* Right Panel — Preview/Code */}
          <Panel defaultSize={65}>
            <div className="h-full flex flex-col bg-white">
              {/* Tab Bar */}
              <div className="h-14 border-b border-neutral-200/60 px-6 flex items-center gap-4 bg-neutral-50/50">
                <button
                  onClick={() => setActiveView("preview")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeView === "preview"
                      ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveView("code")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeView === "code"
                      ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setActiveView("gallery")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeView === "gallery"
                      ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Gallery
                </button>
                <div className="flex-1" />
                <button
                  onClick={saveFiles}
                  disabled={files.size === 0 || saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  {saving ? "Saving..." : "Save to Disk"}
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden bg-neutral-50">
                {activeView === "preview" ? (
                  <div className="h-full bg-white">
                    <PreviewFrame />
                  </div>
                ) : activeView === "gallery" ? (
                  <div className="h-full bg-white">
                    <ComponentGallery onBack={() => setActiveView("preview")} />
                  </div>
                ) : (
                  <PanelGroup direction="horizontal" className="h-full">
                    <Panel defaultSize={30} minSize={20} maxSize={50}>
                      <div className="h-full bg-neutral-50 border-r border-neutral-200">
                        <FileTree />
                      </div>
                    </Panel>
                    <PanelResizeHandle className="w-[1px] bg-neutral-200 hover:bg-neutral-400 transition-colors" />
                    <Panel defaultSize={70}>
                      <div className="h-full bg-white">
                        <CodeEditor />
                      </div>
                    </Panel>
                  </PanelGroup>
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
        <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FileSystemProvider>
        <MainContent />
      </FileSystemProvider>
    </AuthProvider>
  );
}
