import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Logo from "./components/Logo";
import Posts from "./components/Posts";
import NewPost from "./components/NewPost";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768); // Set initial state based on window size

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleResize = () => {
    // Collapse the sidebar if the window width is less than 768px
    if (window.innerWidth < 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize); // Add resize event listener

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const DynamicHeader = () => {
    const location = useLocation();

    let headerText = "Default Header"; // Default header
    if (location.pathname === "/") {
      headerText = "Dashboard";
    } else if (location.pathname === "/add-post") {
      headerText = "Add New Post";
    }

    return (
      <Header style={{ background: "#fff", padding: "0 16px" }}>
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{ marginLeft: 16, marginRight: 15 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        {headerText}
      </Header>
    );
  };

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleCollapsed}
          className="sidebar"
        >
          <Logo />
          <Sidebar />
        </Sider>
        <Layout>
          <DynamicHeader />
          <Content style={{ margin: "16px" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <Routes>
                <Route path="/" element={<Posts />} />
                <Route path="/add-post" element={<NewPost />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
