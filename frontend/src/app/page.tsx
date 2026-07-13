"use client";

import { useEffect, useState, useRef } from "react";
import {
  Card, Input, Tag, Spin, Empty, Button, Space, Popconfirm,
  message, Typography, Pagination, Select,
} from "antd";
import {
  PlusOutlined, SearchOutlined, DeleteOutlined,
  DownloadOutlined, UploadOutlined,
  CalendarOutlined, TagsOutlined, SortAscendingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { notesApi } from "@/lib/api";
import { useLang } from "@/lib/LangContext";

const { Text, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();
  const { t } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("updated_at");
  const perPage = 10;

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await notesApi.list({
        search: search || undefined,
        tag: selectedTag || undefined,
        page, perPage, sortBy,
      });
      setNotes(res.notes);
      setTotal(res.total);
    } catch {
      message.error(t("notes.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, [search, selectedTag, page, sortBy]);
  useEffect(() => { setPage(1); }, [search, selectedTag, sortBy]);

  const handleDelete = async (id: number) => {
    try {
      await notesApi.delete(id);
      message.success(t("notes.deleteSuccess"));
      fetchNotes();
    } catch {
      message.error(t("notes.deleteFailed"));
    }
  };

  const handleExport = async () => {
    try {
      const allNotes = await notesApi.exportAll();
      const blob = new Blob([JSON.stringify(allNotes, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `notes_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      message.success(t("notes.exportSuccess"));
    } catch {
      message.error(t("notes.exportFailed"));
    }
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        message.error(t("notes.importInvalid"));
        return;
      }
      const result = await notesApi.importNotes(data);
      message.success(t("notes.importSuccess").replace("{n}", String(result.imported)));
      fetchNotes();
    } catch {
      message.error(t("notes.importFailed"));
    }
  };

  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags.split(",").map((t) => t.trim()).filter(Boolean)))
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Typography.Title level={3} style={{ margin: 0 }}>{t("notes.all")}</Typography.Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>{t("notes.export")}</Button>
          <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>{t("notes.import")}</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/notes/new")}>
            {t("notes.new")}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = "";
            }}
          />
        </Space>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Input
          placeholder={t("notes.search")}
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 300 }}
        />
        <Select
          value={sortBy}
          onChange={(v) => setSortBy(v)}
          style={{ width: 150 }}
          options={[
            { value: "updated_at", label: t("sort.lastUpdated") },
            { value: "created_at", label: t("sort.dateCreated") },
            { value: "title", label: t("sort.titleAZ") },
          ]}
          prefix={<SortAscendingOutlined />}
        />
      </div>

      {allTags.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <TagsOutlined />
          <Space size={4} wrap>
            <Tag color={selectedTag === null ? "blue" : "default"}
              style={{ cursor: "pointer" }} onClick={() => setSelectedTag(null)}>
              {t("notes.allTags")}
            </Tag>
            {allTags.map((tag) => (
              <Tag key={tag} color={selectedTag === tag ? "blue" : "default"}
                style={{ cursor: "pointer" }} onClick={() => setSelectedTag(tag)}>
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      <Spin spinning={loading}>
        {notes.length === 0 ? (
          <Empty description={search || selectedTag ? t("notes.noMatch") : t("notes.noNotes")} className="mt-16">
            {!search && !selectedTag && (
              <Button type="primary" onClick={() => router.push("/notes/new")}>
                {t("notes.createFirst")}
              </Button>
            )}
          </Empty>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <Card key={note.id} hoverable size="small"
                onClick={() => router.push(`/notes/${note.id}`)}
                actions={[
                  <Popconfirm key="delete" title={t("notes.deleteConfirm")}
                    onConfirm={(e) => { e?.stopPropagation(); handleDelete(note.id); }}
                    onCancel={(e) => e?.stopPropagation()}>
                    <DeleteOutlined key="delete" onClick={(e) => e.stopPropagation()} />
                  </Popconfirm>,
                ]}>
                <Card.Meta
                  title={<Text strong ellipsis style={{ maxWidth: "100%" }}>{note.title}</Text>}
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginBottom: 8 }}>
                        {note.content}
                      </Paragraph>
                      <div className="flex items-center justify-between">
                        <Space size={4}>
                          <CalendarOutlined />
                          <Text type="secondary" style={{ fontSize: 12 }}>{note.updated_at}</Text>
                        </Space>
                        <Space size={4}>
                          {note.tags?.split(",").map((tt) => tt.trim()).filter(Boolean).slice(0, 3).map((tag) => (
                            <Tag key={tag} color="processing" style={{ fontSize: 11 }}>{tag}</Tag>
                          ))}
                        </Space>
                      </div>
                    </>
                  } />
              </Card>
            ))}
          </div>
        )}
      </Spin>

      {total > perPage && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            total={total}
            pageSize={perPage}
            onChange={(p) => setPage(p)}
            showTotal={(total) => `${t("notes.totalPrefix")} ${total} ${t("notes.totalSuffix")}`}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
