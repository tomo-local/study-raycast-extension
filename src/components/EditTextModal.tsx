import { Form, ActionPanel, Action } from "@raycast/api";

interface EditTextModalProps {
  title: string;
  value: string;
  onSubmit: (value: string) => void;
}

export default function EditTextModal({ title, value, onSubmit }: EditTextModalProps) {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="保存"
            onSubmit={(values) => onSubmit(values.text)}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="text"
        title={title}
        defaultValue={value}
        autoFocus
      />
    </Form>
  );
}