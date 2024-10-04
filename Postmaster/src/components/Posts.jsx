import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
  Button,
  Space,
  Spin,
  Alert,
  Pagination,
  Modal,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PostSharingForm from "./PostSharingForm";

const { Meta } = Card;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/post/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
        setLoading(false);
      });
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleOk = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = (postId) => {
    fetch(`http://127.0.0.1:8000/post/${postId}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        // Successfully deleted
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        setError("Failed to delete post.");
      });
  };
  

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: "16px" }}
      />
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {currentPosts.map((post) => (
          <Col xs={24} sm={12} md={8} key={post.id}>
            <Card
              hoverable
              style={{ width: 300 }}
              cover={
                <img
                  alt="Post Cover"
                  src={post.image}
                  style={{ height: 350 }}
                />
              }
            >
              <Meta
                avatar={
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${post.id}`}
                  />
                }
                title={post.title}
                description={post.description}
              />
              <Space style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={() => handleEditPost(post)}
                  icon={<EditOutlined />}
                >
                  Edit
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination
        current={currentPage}
        pageSize={postsPerPage}
        total={posts.length}
        onChange={handlePageChange}
        style={{ textAlign: "center", marginTop: "16px" }}
      />

      <Modal
        title="Edit Post"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Don't show default footer
      >
        {selectedPost ? (
          <PostSharingForm data={selectedPost} onSave={handleOk} />
        ) : (
          <p>No post selected</p>
        )}
      </Modal>
    </div>
  );
};

export default Posts;
