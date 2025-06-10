import { ActionPanel, Action, Detail, showToast, Toast, popToRoot, type LaunchProps } from "@raycast/api";
import { useState } from "react";
import { saveNote } from "./utils/notes";
import EditTextModal from "./components/EditTextModal";

export default function Command(props: LaunchProps<{ arguments: Arguments.CreateNote }>) {
  const [title, setTitle] = useState(props.arguments.title || "");
  const [content, setContent] = useState("");

  const [mode, setMode] = useState<"view" | "edit">("edit");
  const [editingField, setEditingField] = useState<"title" | "content">("content");

  const isLoading = mode === "edit";
  const handleSave = async () => {
    try {
      await saveNote(title, content);
      await showToast({
        style: Toast.Style.Success,
        title: "メモを保存しました",
      });
      popToRoot();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "メモの保存に失敗しました",
        message: String(error),
      });
    }
  };

  if (mode === "edit") {
    return (
      <EditTextModal
        title={editingField === "title" ? "タイトルを編集" : "内容を編集"}
        value={editingField === "title" ? title : content}
        onSubmit={(value) => {
          if (editingField === "title") {
            setTitle(value);
          } else {
            setContent(value);
          }
          setMode("view");
          setEditingField("content");
        }}
      />
    );
  }

  const markdown = `
## ${title || "ファイル名"}
-----
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
          <Action title="保存" shortcut={{ modifiers: ["cmd"], key: "s" }} onAction={handleSave}  />
          <Action
            title="内容を編集"
            shortcut={{ modifiers: ["cmd"], key: "backspace" }}
            onAction={() => {
              setEditingField("content");
              setMode("edit");
            }}
          />
          <Action
            title="タイトルを編集"
            shortcut={{ modifiers: ["cmd"], key: "t" }}
            onAction={() => {
              setEditingField("title");
              setMode("edit");
            }}
          />
        </ActionPanel>
      }
    />
  );
}
