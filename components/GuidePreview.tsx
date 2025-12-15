import React, { useEffect, useRef } from 'react';

interface GuidePreviewProps {
  htmlContent: string;
}

const GuidePreview: React.FC<GuidePreviewProps> = ({ htmlContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [htmlContent]);

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">תצוגה מקדימה (Live Preview)</span>
        <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        title="Guide Preview"
        className="w-full h-[calc(100%-40px)]"
        sandbox="allow-scripts" // Allow scripts for the 'copy code' button to work in preview
      />
    </div>
  );
};

export default GuidePreview;