import React, { useState, useRef } from 'react';
import { Upload, X, FileCheck } from 'lucide-react';

const CADUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['STEP', 'STP', 'STL', 'IGES'];
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const fileExt = file.name.split('.').pop()?.toUpperCase();
    if (!fileExt || !supportedFormats.includes(fileExt)) {
      alert('Unsupported file format. Please upload: ' + supportedFormats.join(', '));
      return false;
    }
    if (file.size > maxFileSize) {
      alert('File size cannot exceed 100MB');
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGetQuote = () => {
    if (!file) {
      alert('Please upload a CAD file first');
      return;
    }
    console.log('Submitting file for quote:', file.name);
    alert('Your file has been received: ' + file.name + '. We will send you a detailed quote via email.');
  };

  return (
    <section>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 style={{ color: 'var(--theme-text)' }} className="text-4xl font-bold text-center mb-4">
          Upload Your 3D CAD File
        </h2>
        <p style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }} className="text-center mb-12">
          Drag & drop or upload STEP, STP, STL, IGES files
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div
            style={{
              border: dragActive ? '2px dashed var(--theme-primary)' : '2px dashed color-mix(in srgb, var(--theme-primary) 12%, transparent)',
              backgroundColor: dragActive ? 'color-mix(in srgb, var(--theme-primary) 5%, transparent)' : 'var(--theme-surface)',
              transition: 'all 0.3s ease'
            }}
            className="rounded-lg p-8 text-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload style={{ color: 'var(--theme-primary)' }} className="w-12 h-12 mx-auto mb-4" />
            <p style={{ color: 'var(--theme-text)' }} className="font-semibold mb-2">
              Drag & drop file here
            </p>
            <p style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }} className="text-sm mb-4">or</p>
            <button
              onClick={handleBrowseClick}
              style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-text)' }}
              className="px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 80%, black)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-primary)'}
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".step,.stp,.stl,.iges,.igs"
              onChange={handleChange}
              className="hidden"
            />
          </div>

          {/* File Status & Quote */}
          <div className="flex flex-col">
            {/* File Status */}
            <div style={{ backgroundColor: 'var(--theme-surface)' }} className="rounded-lg p-6 mb-6 flex-grow">
              <h3 style={{ color: 'var(--theme-text)' }} className="font-semibold mb-4">{t('react.cadupload.upload_status')}</h3>
              {file ? (
                <div className="flex items-start gap-3">
                  <FileCheck style={{ color: 'var(--theme-primary)' }} className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <p style={{ color: 'var(--theme-text)' }} className="font-medium">{file.name}</p>
                    <p style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }} className="text-sm">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={handleClear}
                    style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
                    className="hover:text-theme-text"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <p style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>{t('react.cadupload.no_file_selected')}</p>
              )}
            </div>

            {/* Quote Section */}
            <div style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid var(--theme-primary)' }} className="rounded-lg p-6">
              <h3 style={{ color: 'var(--theme-text)' }} className="font-semibold mb-2">
                Get a Quote
              </h3>
              <p style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }} className="text-sm mb-4">
                No file upload required. Click below to proceed with your quote request.
              </p>
              <div className="mb-4 text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}>
                <p style={{ color: 'var(--theme-text)' }} className="font-medium mb-1">
                  📧 A detailed quote will be emailed to you
                </p>
              </div>
              <button
                onClick={handleGetQuote}
                style={{
                  backgroundColor: file ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
                  color: file ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 55%, transparent)',
                  cursor: file ? 'pointer' : 'not-allowed'
                }}
                className="w-full py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
                disabled={!file}
                onMouseOver={(e) => { if (file) e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 80%, black)'; }}
                onMouseOut={(e) => { if (file) e.currentTarget.style.backgroundColor = 'var(--theme-primary)'; }}
              >
                Get Instant Quote
              </button>
            </div>
          </div>
        </div>

        {/* Supported Formats Info */}
        <div style={{ backgroundColor: 'var(--theme-surface)' }} className="mt-8 p-4 rounded-lg">
          <p style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }} className="text-sm">
            <span style={{ color: 'var(--theme-text)' }} className="font-semibold">{t('react.cadupload.supported_formats')}</span> STEP (.step), STP (.stp), STL (.stl), IGES (.iges, .igs)
          </p>
          <p style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }} className="text-sm mt-2">
            <span style={{ color: 'var(--theme-text)' }} className="font-semibold">{t('react.cadupload.max_file_size')}</span> 100 MB
          </p>
        </div>
      </div>
    </section>
  );
};

export default CADUpload;
