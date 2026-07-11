"use client";

import { useState } from "react";
import { Form, Input, Button, message, Typography, Card } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { notesApi } from "@/lib/api";

const { TextArea } = Input;

export default function NewNotePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

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
      message.success("笔记创建成功");
      router.push(`/notes/${note.id}`);
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "创建失败");
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
        返回笔记列表
      </Button>

      <Typography.Title level={3}>新建笔记</Typography.Title>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[
              { required: true, message: "请输入笔记标题" },
              { max: 200, message: "标题不超过200个字符" },
            ]}
          >
            <Input placeholder="输入笔记标题..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[
              { required: true, message: "请输入笔记内容" },
              { max: 50000, message: "内容不超过50000个字符" },
            ]}
          >
            <TextArea
              rows={12}
              placeholder="在这里写笔记内容..."
              showCount
              maxLength={50000}
            />
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Input placeholder="多个标签用逗号分隔，如: 工作,技术,React" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
            >
              保存笔记
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
