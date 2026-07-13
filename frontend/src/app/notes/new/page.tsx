"use client";

import { useEffect, useState } from "react";
import { Form, Input, Button, message, Typography, Card, Tabs, Tag } from "antd";
import {
  ArrowLeftOutlined, SaveOutlined,
  FormOutlined, EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { notesApi } from "@/lib/api";
import { saveDraft, loadDraft, clearDraft, hasDraft } from "@/lib/draft";

const { TextArea } = Input;
const DRAFT_KEY = "new_note";

export default function NewNotePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    const draft = loadDraft(DRAFT_KEY);
    if (draft) {
      form.setFieldsValue({
        title: draft.title || "",
        content: draft.content || "",
        tags: draft.tags || "",
      });
      setContent(draft.content || "");
    }
  }, []);

  // Auto-save to localStorage on changes
  useEffect(() => {
    if (!draftSaved) return;
    const timer = setTimeout(() => {
      const values = form.getFieldsValue();
      saveDraft(DRAFT_KEY, values);
    }, 500);
    return () => clearTimeout(timer);
  }, [draftSaved, content]);

  const handleValuesChange = (_: unknown, all: Record<string, string>) => {
    setContent(all.content || "");
    setDraftSaved(true);
    saveDraft(DRAFT_KEY, all);
  };

  const handleSubmit = async (values: {
    title: string;
    content: string;
    tags: string;
  }) => {
    setSubmitting(true);
    try {
      const note = await notesApi.create({
        title: values.title.trim(),
        content: values.content.trim(),
        tags: values.tags.trim(),
      });
      clearDraft(DRAFT_KEY);
      message.success("Note created successfully");
      router.push(`/notes/${note.id}`);
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push("/")}
        className="mb-4"
        style={{ padding: 0 }}
      >
        Back to notes
      </Button>

      <div className="flex items-center justify-between mb-4">
        <Typography.Title level={3} style={{ margin: 0 }}>
          New Note
        </Typography.Title>
        {draftSaved && (
          <Tag icon={<FormOutlined />} color="processing">
            Draft auto-saved
          </Tag>
        )}
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          onValuesChange={handleValuesChange}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please enter a title" },
              { max: 200, message: "Title cannot exceed 200 characters" },
            ]}
          >
            <Input placeholder="Enter note title..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[
              { required: true, message: "Please enter content" },
              { max: 50000, message: "Content cannot exceed 50000 characters" },
            ]}
          >
            <Tabs
              items={[
                {
                  key: "write",
                  label: <span><FormOutlined /> Write</span>,
                  children: (
                    <TextArea
                      rows={12}
                      placeholder="Write your note here... (Markdown supported)"
                      showCount
                      maxLength={50000}
                    />
                  ),
                },
                {
                  key: "preview",
                  label: <span><EyeOutlined /> Preview</span>,
                  children: (
                    <div
                      className="note-content"
                      style={{
                        minHeight: 300,
                        padding: "8px 12px",
                        border: "1px solid #d9d9d9",
                        borderRadius: 6,
                        background: "#fff",
                      }}
                    >
                      {content ? (
                        <ReactMarkdown>{content}</ReactMarkdown>
                      ) : (
                        <Typography.Text type="secondary">
                          Nothing to preview yet
                        </Typography.Text>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Input placeholder="Separate tags with commas, e.g. work,tech,react" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
            >
              Save Note
            </Button>
            {hasDraft(DRAFT_KEY) && (
              <Button
                type="link"
                danger
                onClick={() => {
                  clearDraft(DRAFT_KEY);
                  form.resetFields();
                  setContent("");
                  setDraftSaved(false);
                }}
                style={{ marginLeft: 12 }}
              >
                Discard draft
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
