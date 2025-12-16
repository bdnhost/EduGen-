import React, { useEffect, useRef, useState } from 'react';

interface GuidePreviewProps {
  htmlContent: string;
}

const GuidePreview: React.FC<GuidePreviewProps> = ({ htmlContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (iframeRef.current && htmlContent && htmlContent.trim()) {
      setIsLoading(true);
      setError(null);

      const iframe = iframeRef.current;

      // Wait for iframe to be ready
      const loadContent = () => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            // Clear existing content
            doc.open();

            // Create a complete HTML document with proper encoding and fallback styles
            const completeHtml = htmlContent.includes('<!DOCTYPE html>')
              ? htmlContent
              : `<!DOCTYPE html>
                 <html lang="he" dir="rtl">
                 <head>
                   <meta charset="UTF-8">
                   <meta name="viewport" content="width=device-width, initial-scale=1.0">
                   <base href="${window.location.origin}/">
                   <style>
                     body { 
                       font-family: 'Heebo', Arial, sans-serif; 
                       margin: 0; 
                       padding: 20px; 
                       line-height: 1.6; 
                       background: #f8f9fa;
                     }
                     .concept-card { 
                       background: white; 
                       padding: 2rem; 
                       border-radius: 12px; 
                       margin-bottom: 2rem; 
                       box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                     }
                     .page-header { 
                       background: linear-gradient(135deg, #1a1a2e 0%, #6c5ce7 100%); 
                       color: white; 
                       padding: 3rem 1rem; 
                       text-align: center; 
                       margin: -20px -20px 20px -20px;
                     }
                   </style>
                 </head>
                 <body>${htmlContent}</body>
                 </html>`;

            doc.write(completeHtml);
            doc.close();

            // Wait a bit for content to render, then hide loading
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }
        } catch (err) {
          console.error('Error loading preview:', err);
          setError('שגיאה בטעינת התצוגה המקדימה');
          setIsLoading(false);
        }
      };

      // Add a small delay to ensure iframe is ready
      setTimeout(() => {
        if (iframe.contentDocument) {
          loadContent();
        } else {
          iframe.onload = loadContent;
        }
      }, 100);
    } else if (!htmlContent || !htmlContent.trim()) {
      setIsLoading(false);
      setError(null);
    }
  }, [htmlContent]);

  const openInNewWindow = () => {
    if (htmlContent) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    }
  };

  const refreshPreview = () => {
    if (iframeRef.current && htmlContent) {
      setIsLoading(true);
      setError(null);

      // Force reload by clearing and reloading content
      const iframe = iframeRef.current;
      setTimeout(() => {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.open();
          const completeHtml = htmlContent.includes('<!DOCTYPE html>')
            ? htmlContent
            : `<!DOCTYPE html>
               <html lang="he" dir="rtl">
               <head>
                 <meta charset="UTF-8">
                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                 <base href="${window.location.origin}/">
                 <style>
                   body { 
                     font-family: 'Heebo', Arial, sans-serif; 
                     margin: 0; 
                     padding: 20px; 
                     line-height: 1.6; 
                     background: #f8f9fa;
                   }
                   .concept-card { 
                     background: white; 
                     padding: 2rem; 
                     border-radius: 12px; 
                     margin-bottom: 2rem; 
                     box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                   }
                   .page-header { 
                     background: linear-gradient(135deg, #1a1a2e 0%, #6c5ce7 100%); 
                     color: white; 
                     padding: 3rem 1rem; 
                     text-align: center; 
                     margin: -20px -20px 20px -20px;
                   }
                 </style>
               </head>
               <body>${htmlContent}</body>
               </html>`;

          doc.write(completeHtml);
          doc.close();

          setTimeout(() => setIsLoading(false), 500);
        }
      }, 100);
    }
  };

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm relative">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            תצוגה מקדימה (Live Preview)
          </span>
          {isLoading && <span className="text-xs text-blue-500">• טוען...</span>}
          {error && <span className="text-xs text-red-500">• שגיאה</span>}
          {!isLoading && !error && <span className="text-xs text-green-500">• מוכן</span>}
        </div>

        <div className="flex items-center gap-2">
          {/* Action buttons */}
          <button
            onClick={refreshPreview}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            title="רענן תצוגה"
          >
            🔄
          </button>
          <button
            onClick={openInNewWindow}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            title="פתח בחלון חדש"
          >
            🔗
          </button>

          {/* Status indicators */}
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-400' : isLoading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="w-full h-[calc(100%-40px)] flex items-center justify-center bg-red-50">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️</div>
            <div className="text-red-700 font-medium">{error}</div>
            <div className="text-red-600 text-sm mt-1">נסה לרענן או לבדוק את התוכן</div>
            <button
              onClick={refreshPreview}
              className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
            >
              רענן תצוגה
            </button>
          </div>
        </div>
      ) : !htmlContent || !htmlContent.trim() ? (
        <div className="w-full h-[calc(100%-40px)] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-4">📄</div>
            <div className="text-gray-600 font-medium mb-2">אין תוכן לתצוגה מקדימה</div>
            <div className="text-gray-500 text-sm">צור מדריך כדי לראות את התצוגה המקדימה</div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[calc(100%-40px)]">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <div className="text-gray-600 text-sm">טוען תצוגה מקדימה...</div>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            title="Guide Preview"
            className="w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-top-navigation"
            style={{ border: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default GuidePreview;