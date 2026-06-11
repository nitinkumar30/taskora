import { NextResponse } from "next/server";
import { readProjects, createProject } from "@/utils/json-storage";

export async function GET() {
  const projects = readProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const projects = createProject(body);
  return NextResponse.json(projects);
}
