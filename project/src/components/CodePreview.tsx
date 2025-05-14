import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface CodePreviewProps {
  projectId: string;
  language: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ projectId, language }) => {
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-code`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projectId, language }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch preview');
        }

        const data = await response.json();
        setOutput(data.output);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [projectId, language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg overflow-hidden">
      {language === 'python' ? (
        <pre className="p-4 bg-gray-900 text-white font-mono text-sm overflow-auto max-h-96">
          {output}
        </pre>
      ) : (
        <iframe
          srcDoc={output}
          className="w-full h-96 border-0"
          sandbox="allow-scripts"
          title="Code Preview"
          onContextMenu={(e) => e.preventDefault()}
        />
      )}
    </div>
  );
};

export default CodePreview;