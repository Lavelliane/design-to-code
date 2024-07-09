"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Upload, UploadProps } from "antd";
import axios from "axios";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import * as prettier from "prettier";
import { UploadOutlined } from "@ant-design/icons";
import { renderToStaticMarkup } from "react-dom/server";
import parse from 'html-react-parser';

const HomePage: React.FC = () => {
  const [designForm] = Form.useForm();
  const [codePreview, setCodePreview] = useState(null);
  const [isGeneratingUI, setIsGeneratingUI] = useState(false);
  const [jsxElement, setJsxElement] = useState(null);

  const props: UploadProps = {
    name: "file",
    action: "/api/v1/image",
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        if (info.file.response?.data) {
          setCodePreview(info.file.response?.data);
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      <div className="flex flex-col h-screen w-full px-20 py-10">
        <Form
          form={designForm}
          layout="vertical"
          // onFinish={handleSubmit}
          className="mb-8"
        >
          {/* <Form.Item name="projectId" label="Figma Project ID" required>
            <Input />
          </Form.Item>
          <Form.Item name="nodeIds" label="Project Node ID" required>
            <Input />
          </Form.Item> */}
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {/* <Button loading={isGeneratingUI} htmlType="submit">
            Generate
          </Button> */}
        </Form>
        <LiveProvider code={`${codePreview}`}>
          <p className="mb-4">Code Editor:</p>
          <LiveEditor />
          <p className="mt-4">Errors:</p>
          <LiveError />
        </LiveProvider>
        <p className="font-bold text-xl">Preview</p>
        <div className="w-full">
          { codePreview && parse(codePreview) }
        </div>
      </div>
    </>
  );
};

export default HomePage;
