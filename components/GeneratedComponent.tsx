import React from 'react';
import DOMPurify from 'dompurify';

const GeneratedComponent = ({ jsxString }: { jsxString: string }) => {
  const sanitizedHtml = DOMPurify.sanitize(jsxString);

  return (
    <div
      className="your-container-class"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default GeneratedComponent;