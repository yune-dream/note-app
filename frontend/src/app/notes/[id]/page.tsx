"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Tag,
  Spin,
  Button,
  Input,
  Form,
  message,
  Typography,
  Space,
  Popconfirm,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  CalendarOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { notesApi, Note } from "@/lib/api";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const noteId = Number(params.id);

  const fetchNote = async () => {
    try {
      const data = await notesApi.get(noteId);
      setNote(data);
      form.setFieldsValue({
        title: data.title,
        content: data.content,
        tags: data.tags,
      });
    } catch {
      message.error("笔记不存在");
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
      message.success("保存成功");
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await notesApi.delete(noteId);
      message.success("笔记已删除");
      router.push("/");
    } catch {
      message.error("删除失败");
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

  const tags = note.tags
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push("/")}
        style={{ padding: 0 }}
        className="mb-4"
      >
        返回笔记列表
      </Button>

      {editing ? (
        <Card>
          <Title level={3} style={{ marginTop: 0 }}>
            编辑笔记
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            autoComplete="off"
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[
                { required: true, message: "请输入笔记标题" },
                { max: 200 },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="content"
              label="内容"
              rules={[
                { required: true, message: "请输入笔记内容" },
                { max: 50000 },
              ]}
            >
              <TextArea rows={12} showCount maxLength={50000} />
            </Form.Item>
            <Form.Item name="tags" label="标签">
              <Input placeholder="多个标签用逗号分隔" />
            </Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
              >
                保存
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={() => {
                  setEditing(false);
                  form.setFieldsValue({
                    title: note.title,
                    content: note.content,
                    tags: note.tags,
                  });
                }}
              >
                取消
              </Button>
            </Space>
          </Form>
        </Card>
      ) : (
        <>
          <Card
            extra={
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setEditing(true)}
                >
                  编辑
                </Button>
                <Popconfirm
                  title="确认删除这条笔记？"
                  onConfirm={handleDelete}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <Title level={3}>{note.title}</Title>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <Space>
                <CalendarOutlined />
                <Text type="secondary">
                  创建于 {note.created_at}
                </Text>
              </Space>
              <Text type="secondary">|</Text>
              <Space>
                <CalendarOutlined />
                <Text type="secondary">
                  更新于 {note.updated_at}
                </Text>
              </Space>
            </div>

            {tags.length > 0 && (
              <div className="mb-4">
                <Space>
                  <TagsOutlined />
                  {tags.map((tag) => (
                    <Tag key={tag} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

            <Divider />

            <div className="note-content">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
