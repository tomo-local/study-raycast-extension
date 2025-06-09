import { ActionPanel, Action, Detail, showToast, Toast, popToRoot } from "@raycast/api";
import { useState } from "react";
import { saveNote } from "../utils/notes";
import EditTextModal from "../components/EditTextModal";

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingField, setEditingField] = useState<"title" | "content" | null>(null);

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "タイトルと内容を入力してください",
      });
      return;
    }

    setIsLoading(true);
    try {
      const note = await saveNote(title, content);
      await showToast({
        style: Toast.Style.Success,
        title: "メモを作成しました",
        message: note.title,
      });
      setTitle("");
      setContent("");
      await popToRoot();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "エラーが発生しました",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (editingField === "title") {
    return (
      <EditTextModal
        title="タイトルを編集"
        value={title}
        onSubmit={(value) => {
          setTitle(value);
          setEditingField(null);
        }}
      />
    );
  }

  if (editingField === "content") {
    return (
      <EditTextModal
        title="内容を編集"
        value={content}
        onSubmit={(value) => {
          setContent(value);
          setEditingField(null);
        }}
      />
    );
  }

  const markdown = `
# メモ作成

${isLoading ? "保存中..." : ""}

## タイトル
${title || "（タイトルを入力）"}

## 内容
${content || "（内容を入力）"}

---
作成日時: ${new Date().toLocaleString()}
`;

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action
            title="タイトルを編集"
            shortcut={{ modifiers: ["cmd"], key: "t" }}
            onAction={() => setEditingField("title")}
          />
          <Action
            title="内容を編集"
            shortcut={{ modifiers: ["cmd"], key: "e" }}
            onAction={() => setEditingField("content")}
          />
          <Action
            title="保存"
            shortcut={{ modifiers: ["cmd"], key: "s" }}
            onAction={handleSave}
          />
        </ActionPanel>
      }
    />
  );
}