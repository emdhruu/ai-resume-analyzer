"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import file from "@/app/assests/file.png";
import { formatMarkdown } from "@/app/lib/utils";
import Link from "next/link";

const AnalyzerPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file only');
        setSelectedFile(null);
        return; 
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const analysisText = result.result || result.analysis || result || 'Analysis completed successfully';
        console.log('Analysis Result:', analysisText);
        setAnalysis(analysisText);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen h-screen z-10 p-8 font-sans">
      <Link href="/" className="text-2xl">
        <span>ResumeAnalysis</span>
        <span className="text-teal-900">.ai</span>
      </Link>
      
      <div className="flex mt-2 h-screen flex-col items-center space-y-5">
        <p className="text-2xl">AI Web Resume Analyzer</p>
        
        {!analysis ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg w-1/3 h-1/3 flex flex-col justify-center items-center space-y-4 hover:border-teal-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Image 
              src={file} 
              alt="Upload Resume" 
              height={100} 
              width={100} 
              className="object-contain" 
            />
            
            <div className="text-center space-y-2">
              <div>
                {selectedFile ? (
                  <span className="text-green-600 font-medium">
                    Selected: {selectedFile.name}
                  </span>
                ) : (
                  <span>Upload your resume here to start analyzing</span>
                )}
              </div>
              <span className="text-sm text-gray-500 block">
                We accept PDF files only (max 10MB)
              </span>
            </div>

            {error && (
              <span className="text-red-500 text-sm">{error}</span>
            )}

            <div className="space-y-2">
              <button 
                onClick={handleButtonClick}
                disabled={uploading}
                className="bg-teal-900 text-white px-4 py-2 rounded-full font-extralight hover:bg-gray-700 hover:cursor-pointer transition disabled:opacity-50"
              >
                {selectedFile ? 'Change File' : 'Click to Select PDF'}
              </button>
              
              {selectedFile && (
                <button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-teal-900 text-white px-4 py-2 rounded-full font-extralight hover:bg-teal-700 hover:cursor-pointer transition disabled:opacity-50 ml-2"
                >
                  {uploading ? 'Analyzing...' : 'Analyze Resume'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-4/5 bg-white rounded-lg shadow-lg p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-teal-900">Resume Analysis Results</h3>
              <button 
                onClick={() => {
                  setAnalysis(null);
                  setSelectedFile(null);
                  setError(null);
                }}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
              >
                Analyze Another
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <div 
                className="formatted-content"
                dangerouslySetInnerHTML={{
                  __html: typeof analysis === 'string' ? formatMarkdown(analysis) : JSON.stringify(analysis, null, 2)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzerPage;
