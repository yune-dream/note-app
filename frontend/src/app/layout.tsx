"use client";

import { ConfigProvider, Layout, Menu, Button, Dropdown, Space } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import {
  EditOutlined, FileTextOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import "./globals.css";
import { LangProvider, useLang } from "@/lib/LangContext";
import type { Locale } from "@/lib/i18n";
import { usePathname } from "next/navigation";

const { Header, Content } = Layout;

function HeaderContent() {
  const { t, locale, setLocale } = useLang();
  const pathname = usePathname();
  const selectedKey = pathname === "/notes/new" ? "/notes/new" : "/";

  const langItems = [
    { key: "zh", label: "中文" },
    { key: "en", label: "English" },
  ];

  return (
    <>
      <div className="flex items-center gap-2 mr-8">
        <FileTextOutlined style={{ fontSize: 22, color: "#fff" }} />
        <span className="text-white text-lg font-bold">{t("app.title")}</span>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={[
          {
            key: "/",
            icon: <FileTextOutlined />,
            label: <Link href="/">{t("nav.allNotes")}</Link>,
          },
          {
            key: "/notes/new",
            icon: <EditOutlined />,
            label: <Link href="/notes/new">{t("nav.newNote")}</Link>,
          },
        ]}
        style={{ flex: 1, minWidth: 0 }}
      />
      <Dropdown
        menu={{
          selectedKeys: [locale],
          onClick: ({ key }) => setLocale(key as Locale),
          items: langItems,
        }}
      >
        <Button type="text" icon={<GlobalOutlined />} style={{ color: "#fff" }}>
          {t(`lang.${locale}`)}
        </Button>
      </Dropdown>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyleProvider>
          <LangProvider>
            <ConfigProvider
              theme={{
                algorithm: ConfigProvider.config?.theme?.defaultAlgorithm,
                token: { colorPrimary: "#1677ff", borderRadius: 6 },
              }}
            >
              <Layout className="min-h-screen">
                <Header
                  className="flex items-center px-6"
                  style={{ background: "#001529" }}
                >
                  <HeaderContent />
                </Header>
                <Content className="p-6" style={{ background: "#f5f5f5" }}>
                  {children}
                </Content>
              </Layout>
            </ConfigProvider>
          </LangProvider>
        </StyleProvider>
      </body>
    </html>
  );
}
