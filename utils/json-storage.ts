import fs from "fs";
import path from "path";
import { Task, Folder, Project } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filename: string): T[] {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

function writeJSON<T>(filename: string, data: T[]): void {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
  }
}

// Task helpers
export function readTasks(): Task[] {
  return readJSON<Task>("tasks.json");
}

export function writeTasks(tasks: Task[]): void {
  writeJSON<Task>("tasks.json", tasks);
}

export function getTaskById(id: string): Task | undefined {
  const tasks = readTasks();
  return tasks.find((t) => t.id === id);
}

export function createTask(task: Task): Task[] {
  const tasks = readTasks();
  tasks.push(task);
  writeTasks(tasks);
  return tasks;
}

export function updateTask(id: string, updates: Partial<Task>): Task[] {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
    writeTasks(tasks);
  }
  return tasks;
}

export function deleteTask(id: string): Task[] {
  let tasks = readTasks();
  tasks = tasks.filter((t) => t.id !== id);
  writeTasks(tasks);
  return tasks;
}

export function restoreTask(id: string): Task[] {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], archived: false, status: "pending", updatedAt: new Date().toISOString() };
    writeTasks(tasks);
  }
  return tasks;
}

// Folder helpers
export function readFolders(): Folder[] {
  return readJSON<Folder>("folders.json");
}

export function writeFolders(folders: Folder[]): void {
  writeJSON<Folder>("folders.json", folders);
}

export function createFolder(folder: Folder): Folder[] {
  const folders = readFolders();
  folders.push(folder);
  writeFolders(folders);
  return folders;
}

export function updateFolder(id: string, updates: Partial<Folder>): Folder[] {
  const folders = readFolders();
  const index = folders.findIndex((f) => f.id === id);
  if (index !== -1) {
    folders[index] = { ...folders[index], ...updates, updatedAt: new Date().toISOString() };
    writeFolders(folders);
  }
  return folders;
}

export function deleteFolder(id: string): Folder[] {
  let folders = readFolders();
  folders = folders.filter((f) => f.id !== id);
  writeFolders(folders);
  return folders;
}

// Project helpers
export function readProjects(): Project[] {
  return readJSON<Project>("projects.json");
}

export function writeProjects(projects: Project[]): void {
  writeJSON<Project>("projects.json", projects);
}

export function createProject(project: Project): Project[] {
  const projects = readProjects();
  projects.push(project);
  writeProjects(projects);
  return projects;
}

export function updateProject(id: string, updates: Partial<Project>): Project[] {
  const projects = readProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
    writeProjects(projects);
  }
  return projects;
}

export function deleteProject(id: string): Project[] {
  let projects = readProjects();
  projects = projects.filter((p) => p.id !== id);
  writeProjects(projects);
  return projects;
}

// Sync helpers - update counts
export function updateFolderTaskCount(folderId: string): void {
  const tasks = readTasks();
  const folders = readFolders();
  const count = tasks.filter((t) => t.folderId === folderId && !t.archived).length;
  const index = folders.findIndex((f) => f.id === folderId);
  if (index !== -1) {
    folders[index].taskCount = count;
    writeFolders(folders);
  }
}

export function updateProjectTaskCount(projectId: string): void {
  const tasks = readTasks();
  const projects = readProjects();
  const count = tasks.filter((t) => t.projectId === projectId && !t.archived).length;
  const index = projects.findIndex((p) => p.id === projectId);
  if (index !== -1) {
    projects[index].taskCount = count;
    writeProjects(projects);
  }
}

export function recalculateProjectProgress(projectId: string): void {
  const tasks = readTasks();
  const projects = readProjects();
  const projectTasks = tasks.filter((t) => t.projectId === projectId && !t.archived);
  const completed = projectTasks.filter((t) => t.status === "completed").length;
  const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
  const index = projects.findIndex((p) => p.id === projectId);
  if (index !== -1) {
    projects[index].progress = progress;
    projects[index].taskCount = projectTasks.length;
    writeProjects(projects);
  }
}
