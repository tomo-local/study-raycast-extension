import { promises as fs } from "fs";
import path from "path";
import os from "os";

const NOTES_DIR = path.join(os.homedir(), "raycast-notes");

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export async function ensureNotesDirectory() {
  try {
    await fs.access(NOTES_DIR);
  } catch {
    await fs.mkdir(NOTES_DIR, { recursive: true });
  }
}

export async function saveNote(title: string, content: string): Promise<Note> {
  await ensureNotesDirectory();

  const id = Date.now().toString();
  const createdAt = new Date();
  const fileName = `${id}.md`;
  const filePath = path.join(NOTES_DIR, fileName);

  const markdownContent = `# ${title}\n\n${content}\n\n---\n作成日時: ${createdAt.toLocaleString()}`;

  await fs.writeFile(filePath, markdownContent, "utf-8");

  return {
    id,
    title,
    content,
    createdAt,
  };
}

export async function loadNotes(): Promise<Note[]> {
  await ensureNotesDirectory();

  const files = await fs.readdir(NOTES_DIR);
  const notes: Note[] = [];

  for (const file of files) {
    if (file.endsWith(".md")) {
      const filePath = path.join(NOTES_DIR, file);
      const content = await fs.readFile(filePath, "utf-8");

      // マークダウンファイルからタイトルを抽出
      const titleMatch = content.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace(".md", "");

      // 作成日時を抽出
      const dateMatch = content.match(/作成日時: (.+)$/m);
      const createdAt = dateMatch ? new Date(dateMatch[1]) : new Date();

      notes.push({
        id: file.replace(".md", ""),
        title,
        content,
        createdAt,
      });
    }
  }

  return notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}