"use client";
import React, { useState } from "react";
import CodePreview from "@uiw/react-code-preview";
import { Button, Form, Input } from "antd";
import axios from "axios";



const HomePage: React.FC = () => {
  const [designForm] = Form.useForm();
  const [codePreview, setCodePreview] = useState('<></>')
  
  function codePreviewer(jsxCode: string){
    return `
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    
    ReactDOM.createRoot(_mount_).render(
      ${jsxCode}
    );`;
  }

  async function handleSubmit(){
    const formData = designForm.getFieldsValue()
    try {
      const res = await axios.post('/api/v1/figma', formData)
      const { data } = res.data
      const testPreview = codePreviewer(data.code)
      setCodePreview(testPreview)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <div className="flex flex-col h-screen w-full px-20 py-10">
        <Form form={designForm} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="projectId" label="Figma Project ID" required>
            <Input />
          </Form.Item>
          <Form.Item name="nodeIds" label="Project Node ID" required>
            <Input />
          </Form.Item>
          <Button htmlType="submit">Generate</Button>
        </Form>
        <CodePreview code={codePreview} className="mt-8"/>
      </div>
    </>
  );
};

export default HomePage;
