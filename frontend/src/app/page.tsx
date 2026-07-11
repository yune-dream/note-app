"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Input,
  Tag,
  Spin,
  Empty,
  Button,
  Space,
  Popconfirm,
  message,
  Typography,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  CalendarOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { notesApi, Note } from "@/lib/api";

const { Text, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await notesApi.list(search || undefined, selectedTag || undefined);
      setNotes(data);
    } catch {
      message.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search, selectedTag]);

  const handleDelete = async (id: number) => {
    try {
      await notesApi.delete(id);
      message.success("Note deleted");
      fetchNotes();
    } catch {
      message.error("Delete failed");
    }
  };

  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags.split(",").map((t) => t.trim()).filter(Boolean)))
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Typography.Title level={3} style={{ margin: 0 }}>
          All Notes
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/notes/new")}>
          New Note
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Search notes..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 360 }}
        />
      </div>

      {allTags.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <TagsOutlined />
          <Space size={4} wrap>
            <Tag
              color={selectedTag === null ? "blue" : "default"}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedTag(null)}
            >
              All
            </Tag>
            {allTags.map((tag) => (
              <Tag
                key={tag}
                color={selectedTag === tag ? "blue" : "default"}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      <Spin spinning={loading}>
        {notes.length === 0 ? (
          <Empty
            description={search || selectedTag ? "No matching notes" : "No notes yet"}
            className="mt-16"
          >
            {!search && !selectedTag && (
              <Button type="primary" onClick={() => router.push("/notes/new")}>
                Create first note
              </Button>
            )}
          </Empty>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                hoverable
                size="small"
                onClick={() => router.push(`/notes/${note.id}`)}
                actions={[
                  <Popconfirm
                    key="delete"
                    title="Delete this note?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      handleDelete(note.id);
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                  >
                    <DeleteOutlined
                      key="delete"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={
                    <Text strong ellipsis style={{ maxWidth: "100%" }}>
                      {note.title}
                    </Text>
                  }
                  description={
                    <>
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        type="secondary"
                        style={{ marginBottom: 8 }}
                      >
                        {note.content}
                      </Paragraph>
                      <div className="flex items-center justify-between">
                        <Space size={4}>
                          <CalendarOutlined />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {note.updated_at}
                          </Text>
                        </Space>
                        <Space size={4}>
                          {note.tags
                            ?.split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((tag) => (
                              <Tag key={tag} color="processing" style={{ fontSize: 11 }}>
                                {tag}
                              </Tag>
                            ))}
                        </Space>
                      </div>
                    </>
                  }
                />
              </Card>
            ))}
          </div>
        )}
      </Spin>
    </div>
  );
}
