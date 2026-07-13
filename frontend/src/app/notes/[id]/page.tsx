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
import { useLang } from "@/lib/LangContext";

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLang();
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
      const draft = loadDraft(draftKey);
      form.setFieldsValue({
        title: draft?.title ?? data.title,
        content: draft?.content ?? data.content,
        tags: draft?.tags ?? data.tags,
      });
    } catch {
      message.error(t("detail.notFound"));
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (noteId) fetchNote(); }, [noteId]);

  const handleSave = async (values: Record<string, string>) => {
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
      message.success(t("detail.saved"));
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t("detail.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await notesApi.delete(noteId);
      message.success(t("detail.deleted"));
      router.push("/");
    } catch {
      message.error(t("detail.deleteFailed"));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center" style={{ minHeight: 300 }}>
      <Spin size="large" />
    </div>;
  }
  if (!note) return null;

  const tags = note.tags?.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto">
      <Button type="link" icon={<ArrowLeftOutlined />}
        onClick={() => router.push("/")} style={{ padding: 0 }} className="mb-4">
        {t("detail.back")}
      </Button>

      {editing ? (
        <Card>
          <Title level={3} style={{ marginTop: 0 }}>{t("detail.editTitle")}</Title>
          <Form form={form} layout="vertical" onFinish={handleSave} autoComplete="off"
            onValuesChange={(_, all) => saveDraft(draftKey, all)}>
            <Form.Item name="title" label={t("detail.titleLabel")}
              rules={[{ required: true, message: t("detail.titleRequired") }, { max: 200 }]}>
              <Input />
            </Form.Item>
            <Form.Item name="content" label={t("detail.contentLabel")}
              rules={[{ required: true, message: t("detail.contentRequired") }, { max: 50000 }]}>
              <TextArea rows={12} showCount maxLength={50000} />
            </Form.Item>
            <Form.Item name="tags" label={t("detail.tagsLabel")}>
              <Input placeholder={t("detail.tagsPlaceholder")} />
            </Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                {t("detail.save")}
              </Button>
              <Button icon={<CloseOutlined />} onClick={() => {
                setEditing(false);
                clearDraft(draftKey);
                form.setFieldsValue({
                  title: note.title, content: note.content, tags: note.tags,
                });
              }}>
                {t("detail.cancel")}
              </Button>
            </Space>
          </Form>
        </Card>
      ) : (
        <Card extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>{t("detail.edit")}</Button>
            <Popconfirm title={t("detail.deleteConfirm")} onConfirm={handleDelete}>
              <Button danger icon={<DeleteOutlined />}>{t("detail.delete")}</Button>
            </Popconfirm>
          </Space>
        }>
          <Title level={3}>{note.title}</Title>
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <Space><CalendarOutlined /><Text type="secondary">{t("detail.created")} {note.created_at}</Text></Space>
            <Text type="secondary">|</Text>
            <Space><CalendarOutlined /><Text type="secondary">{t("detail.updated")} {note.updated_at}</Text></Space>
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
          <div className="note-content"><ReactMarkdown>{note.content}</ReactMarkdown></div>
        </Card>
      )}
    </div>
  );
}
