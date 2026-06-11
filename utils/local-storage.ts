import { Task, Folder, Project } from "@/types";

const KEYS = {
  tasks: "taskora_tasks",
  folders: "taskora_folders",
  projects: "taskora_projects",
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function read<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("localStorage write failed:", e);
  }
}

export function readTasks(): Task[] {
  return read<Task>(KEYS.tasks);
}

export function writeTasks(tasks: Task[]): void {
  write<Task>(KEYS.tasks, tasks);
}

export function readFolders(): Folder[] {
  return read<Folder>(KEYS.folders);
}

export function writeFolders(folders: Folder[]): void {
  write<Folder>(KEYS.folders, folders);
}

export function readProjects(): Project[] {
  return read<Project>(KEYS.projects);
}

export function writeProjects(projects: Project[]): void {
  write<Project>(KEYS.projects, projects);
}
