import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Typography, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

const PostSharingForm = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("author", values.author);

    fetch("http://127.0.0.1:8000/post/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        message.success("Post shared successfully!");
        form.resetFields();
        setImageUrl("");
        setImageFile(null);
        window.location.href = '/';
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Failed to share post.");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const handleChange = (info) => {
    if (info.file.status !== "uploading") {
      setImageFile(info.file.originFileObj);
      setImageUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Card style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Share Your Post
      </Title>
      <Form
        form={form}
        name="post-sharing"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          name="image"
          label="Image"
          rules={[{ required: true, message: "Please upload an image!" }]}
        >
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            // beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input placeholder="Enter post title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <TextArea rows={4} placeholder="Enter post description" />
        </Form.Item>

        <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please input the author!" }]}
        >
          <TextArea rows={4} placeholder="Enter post author" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Share Post
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PostSharingForm;