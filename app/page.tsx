"use client";
import React, { useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import axios from "axios";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import * as prettier from "prettier";

const HomePage: React.FC = () => {
  const [designForm] = Form.useForm();
  const [codePreview, setCodePreview] = useState("<></>");
  const [isGeneratingUI, setIsGeneratingUI] = useState(false);

  async function handleSubmit() {
    const formData = designForm.getFieldsValue();
    try {
      setIsGeneratingUI(true);
      const res = await axios.post("/api/v1/figma", formData);
      const { data } = res.data;
      setIsGeneratingUI(false);
      // const prettyCode = await prettier.format(data.code, {
      //   parser: "html",
      //   plugins: [require("prettier/parser-html")],
      //   singleQuote: true,
      //   jsxSingleQuote: true,
      // });
      setCodePreview(data.code);
    } catch (error) {
      setIsGeneratingUI(false);
      console.error(error);
    }
  }
  return (
    <>
      <div className="flex flex-col h-screen w-full px-20 py-10">
        <Form
          form={designForm}
          layout="vertical"
          onFinish={handleSubmit}
          className="mb-8"
        >
          <Form.Item name="projectId" label="Figma Project ID" required>
            <Input />
          </Form.Item>
          <Form.Item name="nodeIds" label="Project Node ID" required>
            <Input />
          </Form.Item>
          <Button loading={isGeneratingUI} htmlType="submit">
            Generate
          </Button>
        </Form>
        <LiveProvider code={codePreview}>
          <p className="mb-4">Code Editor:</p>
          <LiveEditor />
          <p className="mt-4">Errors:</p>
          <LiveError />
          <p className="mt-4">Preview:</p>
          <LivePreview />
        </LiveProvider>
      </div>
    </>
  );
};

export default HomePage;
