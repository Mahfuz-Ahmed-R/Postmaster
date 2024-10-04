import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const PostSharingForm = ({ data, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    author: '',
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title,
        description: data.description,
        image: null, // Keep this null to allow for new uploads
        author: data.author,
      });
    }
  }, [data]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file upload
  const handleImageUpload = (info) => {
    // Only accept the latest uploaded file
    if (info.file.status === 'done') {
      setFormData({
        ...formData,
        image: info.file.originFileObj,
      });
    }
  };

  const handleSubmit = () => {
    const { title, description, image, author } = formData;
    const newFormData = new FormData();
    newFormData.append('title', title);
    newFormData.append('description', description);
    
    // Append new image only if it's not null
    if (image) {
      newFormData.append('image', image);
    }
    
    newFormData.append('author', author);

    fetch(`http://127.0.0.1:8000/post/${data.id}/`, {
      method: "PUT", // Use PUT for updating
      body: newFormData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        message.success("Post updated successfully!");
        onSave(data); // Call onSave to update the post in the parent component
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Failed to update post.");
      });
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="Author">
        <Input
          name="author"
          value={formData.author}
          onChange={handleFormChange}
        />
      </Form.Item>
      <Form.Item label="Title">
        <Input
          name="title"
          value={formData.title}
          onChange={handleFormChange}
        />
      </Form.Item>
      <Form.Item label="Body">
        <Input.TextArea
          name="description"
          value={formData.description}
          onChange={handleFormChange}
        />
      </Form.Item>

      {/* Image upload field */}
      <Form.Item label="Upload Image">
        <Upload
          name="image"
          listType="picture"
          beforeUpload={() => false} // Prevent automatic upload
          onChange={handleImageUpload}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
        {formData.image && <p>Image: {formData.image.name}</p>} {/* Show the selected image */}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostSharingForm;
