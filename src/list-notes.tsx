import { ActionPanel, Action, List, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { loadNotes as loadNotesFromFile, Note } from "./utils/notes";
import path from "path";
import os from "os";

export default function Command() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const loadedNotes = await loadNotesFromFile();
      setNotes(loadedNotes);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "メモの読み込みに失敗しました",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <List isLoading={isLoading}>
      {notes.map((note) => (
        <List.Item
          key={note.id}
          title={note.title}
          subtitle={note.content.split("\n")[0]}
          accessories={[
            {
              text: note.createdAt.toLocaleString(),
            },
          ]}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="メモをコピー"
                content={note.content}
              />
              <Action.ShowInFinder
                title="フォルダを開く"
                path={path.join(os.homedir(), "raycast-notes", `${note.id}.md`)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}