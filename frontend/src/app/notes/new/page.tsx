"use client";

import { useEffect, useState } from "react";
import { Form, Input, Button, message, Typography, Card, Tabs, Tag } from "antd";
import {
  ArrowLeftOutlined, SaveOutlined, FormOutlined, EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { notesApi } from "@/lib/api";
import { saveDraft, loadDraft, clearDraft, hasDraft } from "@/lib/draft";
import { useLang } from "@/lib/LangContext";

const { TextArea } = Input;
const DRAFT_KEY = "new_note";

export default function NewNotePage() {
  const router = useRouter();
  const { t } = useLang();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [tabKey, setTabKey] = useState("write");

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

  useEffect(() => {
    if (!draftSaved) return;
    const timer = setTimeout(() => {
      saveDraft(DRAFT_KEY, form.getFieldsValue());
    }, 500);
    return () => clearTimeout(timer);
  }, [draftSaved, content]);

  const handleValuesChange = (_: unknown, all: Record<string, string>) => {
    setContent(all.content || "");
    setDraftSaved(true);
    saveDraft(DRAFT_KEY, all);
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setSubmitting(true);
    try {
      const note = await notesApi.create({
        title: values.title.trim(),
        content: values.content.trim(),
        tags: values.tags.trim(),
      });
      clearDraft(DRAFT_KEY);
      message.success(t("new.success"));
      router.push(`/notes/${note.id}`);
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t("new.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button type="link" icon={<ArrowLeftOutlined />}
        onClick={() => router.push("/")} style={{ padding: 0 }} className="mb-4">
        {t("new.back")}
      </Button>

      <div className="flex items-center justify-between mb-4">
        <Typography.Title level={3} style={{ margin: 0 }}>{t("new.title")}</Typography.Title>
        {draftSaved && <Tag icon={<FormOutlined />} color="processing">{t("new.draftSaved")}</Tag>}
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}
          autoComplete="off" onValuesChange={handleValuesChange}>
          <Form.Item name="title" label={t("new.titleLabel")}
            rules={[{ required: true, message: t("new.titleRequired") }, { max: 200, message: t("new.titleMax") }]}>
            <Input placeholder={t("new.titlePlaceholder")} />
          </Form.Item>

          {/* Tabs control (outside Form.Item, purely for UI) */}
          <div className="mb-2">
            <Tabs activeKey={tabKey} onChange={setTabKey}
              items={[
                { key: "write", label: <span><FormOutlined /> {t("new.write")}</span> },
                { key: "preview", label: <span><EyeOutlined /> {t("new.preview")}</span> },
              ]} />
          </div>

          {/* Form.Item directly wraps the input component for proper form binding */}
          <Form.Item name="content" label={t("new.contentLabel")}
            rules={[{ required: true, message: t("new.contentRequired") }, { max: 50000, message: t("new.contentMax") }]}>
            {tabKey === "write" ? (
              <TextArea rows={12} placeholder={t("new.contentPlaceholder")}
                showCount maxLength={50000} />
            ) : (
              <div className="note-content" style={{
                minHeight: 300, padding: "8px 12px",
                border: "1px solid #d9d9d9", borderRadius: 6, background: "#fff",
              }}>
                {content ? <ReactMarkdown>{content}</ReactMarkdown>
                  : <Typography.Text type="secondary">{t("new.noPreview")}</Typography.Text>}
              </div>
            )}
          </Form.Item>

          <Form.Item name="tags" label={t("new.tagsLabel")}>
            <Input placeholder={t("new.tagsPlaceholder")} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting}>
              {t("new.save")}
            </Button>
            {hasDraft(DRAFT_KEY) && (
              <Button type="link" danger onClick={() => {
                clearDraft(DRAFT_KEY);
                form.resetFields();
                setContent("");
                setDraftSaved(false);
              }} style={{ marginLeft: 12 }}>
                {t("new.discardDraft")}
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
