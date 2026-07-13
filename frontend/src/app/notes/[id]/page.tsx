"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card, Tag, Spin, Button, Input, Form, message,
  Typography, Space, Popconfirm, Divider,
} from "antd";
import {
  ArrowLeftOutlined, EditOutlined, DeleteOutlined,
  SaveOutlined, CloseOutlined, CalendarOutlined, TagsOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { notesApi, Note } from "@/lib/api";
import { saveDraft, loadDraft, clearDraft } from "@/lib/draft";

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const noteId = Number(params.id);
  const draftKey = `edit_${noteId}`;

  const fetchNote = async () => {
    try {
      const data = await notesApi.get(noteId);
      setNote(data);
      // Check for saved draft
      const draft = loadDraft(draftKey);
      form.setFieldsValue({
        title: draft?.title ?? data.title,
        content: draft?.content ?? data.content,
        tags: draft?.tags ?? data.tags,
      });
    } catch {
      message.error("Note not found");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (noteId) fetchNote();
  }, [noteId]);

  const handleSave = async (values: {
    title: string;
    content: string;
    tags: string;
  }) => {
    setSaving(true);
    try {
      const updated = await notesApi.update(noteId, {
        title: values.title.trim(),
        content: values.content.trim(),
        tags: values.tags.trim(),
      });
      setNote(updated);
      setEditing(false);
      clearDraft(draftKey);
      message.success("Saved successfully");
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await notesApi.delete(noteId);
      message.success("Note deleted");
      router.push("/");
    } catch {
      message.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: 300 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!note) return null;

  const tags = note.tags?.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto">
      <Button type="link" icon={<ArrowLeftOutlined />}
        onClick={() => router.push("/")} style={{ padding: 0 }} className="mb-4">
        Back to notes
      </Button>

      {editing ? (
        <Card>
          <Title level={3} style={{ marginTop: 0 }}>Edit Note</Title>
          <Form form={form} layout="vertical" onFinish={handleSave} autoComplete="off"
            onValuesChange={(_, all) => saveDraft(draftKey, all)}>
            <Form.Item name="title" label="Title"
              rules={[{ required: true, message: "Please enter a title" }, { max: 200 }]}>
              <Input />
            </Form.Item>
            <Form.Item name="content" label="Content"
              rules={[{ required: true, message: "Please enter content" }, { max: 50000 }]}>
              <TextArea rows={12} showCount maxLength={50000} />
            </Form.Item>
            <Form.Item name="tags" label="Tags">
              <Input placeholder="Separate tags with commas" />
            </Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                Save
              </Button>
              <Button icon={<CloseOutlined />} onClick={() => {
                setEditing(false);
                clearDraft(draftKey);
                form.setFieldsValue({
                  title: note.title, content: note.content, tags: note.tags,
                });
              }}>
                Cancel
              </Button>
            </Space>
          </Form>
        </Card>
      ) : (
        <Card extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>Edit</Button>
            <Popconfirm title="Delete this note?" onConfirm={handleDelete}>
              <Button danger icon={<DeleteOutlined />}>Delete</Button>
            </Popconfirm>
          </Space>
        }>
          <Title level={3}>{note.title}</Title>
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <Space><CalendarOutlined /><Text type="secondary">Created: {note.created_at}</Text></Space>
            <Text type="secondary">|</Text>
            <Space><CalendarOutlined /><Text type="secondary">Updated: {note.updated_at}</Text></Space>
          </div>
          {tags.length > 0 && (
            <div className="mb-4">
              <Space>
                <TagsOutlined />
                {tags.map((tag) => (<Tag key={tag} color="blue">{tag}</Tag>))}
              </Space>
            </div>
          )}
          <Divider />
          <div className="note-content">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        </Card>
      )}
    </div>
  );
}
