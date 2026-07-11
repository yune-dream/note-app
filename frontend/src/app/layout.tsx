"use client";

import { ConfigProvider, Layout, Menu, theme } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { EditOutlined, FileTextOutlined } from "@ant-design/icons";
import Link from "next/link";
import "./globals.css";

const { Header, Content } = Layout;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyleProvider>
          <ConfigProvider
            theme={{
              algorithm: theme.defaultAlgorithm,
              token: {
                colorPrimary: "#1677ff",
                borderRadius: 6,
              },
            }}
          >
            <Layout className="min-h-screen">
              <Header
                className="flex items-center px-6"
                style={{ background: "#001529" }}
              >
                <div className="flex items-center gap-2 mr-8">
                  <FileTextOutlined style={{ fontSize: 22, color: "#fff" }} />
                  <span className="text-white text-lg font-bold">
                    Note App
                  </span>
                </div>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={["/"]}
                  items={[
                    {
                      key: "/",
                      icon: <FileTextOutlined />,
                      label: <Link href="/">All Notes</Link>,
                    },
                    {
                      key: "/notes/new",
                      icon: <EditOutlined />,
                      label: <Link href="/notes/new">New Note</Link>,
                    },
                  ]}
                  style={{ flex: 1, minWidth: 0 }}
                />
              </Header>
              <Content
                className="p-6"
                style={{ background: "#f5f5f5" }}
              >
                {children}
              </Content>
            </Layout>
          </ConfigProvider>
        </StyleProvider>
      </body>
    </html>
  );
}
