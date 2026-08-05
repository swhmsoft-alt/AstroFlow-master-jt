import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, User, Building2, Briefcase, Warehouse, Factory, Truck, Network, Wrench, Cpu, Calendar, Package, Upload, X, FileCheck } from 'lucide-react';
import { useState, useRef } from 'react';

export default function RFQForm() {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // In a real application, you would send this to your backend
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your request! We will contact you within 24 hours.');
    form.reset();
    setFile(null);
  };

  const t = 'var(--theme-text)';
  const p = 'var(--theme-primary)';
  const s = 'var(--theme-surface)';
  const border = 'color-mix(in srgb, var(--theme-primary) 12%, transparent)';
  const muted = 'color-mix(in srgb, var(--theme-text) 65%, transparent)';
  const subtle = 'color-mix(in srgb, var(--theme-text) 55%, transparent)';
  const grad = 'linear-gradient(135deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 80%, black))';

  const inputStyle = {
    backgroundColor: s,
    borderColor: border,
    color: t,
  } as React.CSSProperties;

  const labelStyle = { color: muted } as React.CSSProperties;
  const requiredStyle = { color: p } as React.CSSProperties;
  const placeholderStyle = subtle;

  return (
    <form className="space-y-6" id="rfq-form" onSubmit={handleSubmit} name="rfq-form">
      {/* Contact Information */}
      <div>
        <div className="flex items-center mb-6">
          <div style={{background: grad}} className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-theme-text" />
          </div>
          <h2 style={{color: t}} className="text-2xl font-bold">
            Contact Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label.Root
              htmlFor="firstName"
              style={labelStyle}
              className="block text-sm font-medium mb-2"
            >
              First Name <span style={requiredStyle}>*</span>
            </Label.Root>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              style={inputStyle}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent transition"
              placeholder="First name"
            />
          </div>
          <div>
            <Label.Root
              htmlFor="lastName"
              style={labelStyle}
              className="block text-sm font-medium mb-2"
            >
              Last Name <span style={requiredStyle}>*</span>
            </Label.Root>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              style={inputStyle}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent transition"
              placeholder="Last name"
            />
          </div>
          <div>
            <Label.Root
              htmlFor="email"
              style={labelStyle}
              className="block text-sm font-medium mb-2"
            >
              Email Address <span style={requiredStyle}>*</span>
            </Label.Root>
            <input
              type="email"
              id="email"
              name="email"
              required
              style={inputStyle}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent transition"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <Label.Root
              htmlFor="phone"
              style={labelStyle}
              className="block text-sm font-medium mb-2"
            >
              Phone Number <span style={requiredStyle}>*</span>
            </Label.Root>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              style={inputStyle}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent transition"
              placeholder="+86 123 4567 8900"
            />
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div style={{borderTop: '1px solid ' + border}} className="pt-6">
        <div className="flex items-center mb-6">
          <div style={{background: grad}} className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-5 h-5 text-theme-text" />
          </div>
          <h2 style={{color: t}} className="text-2xl font-bold">
            Company Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label.Root
              htmlFor="company"
              style={labelStyle}
              className="block text-sm font-medium mb-2"
            >
              Company Name <span style={requiredStyle}>*</span>
            </Label.Root>
            <input
              type="text"
              id="company"
              name="company"
              required
              style={inputStyle}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent transition"
              placeholder="Company name"
            />
          </div>
          <div>
            <Label.Root
              htmlFor="industry"
              style={labelStyle}
              className="block text-sm font-medium mb-2"
            >
              Industry <span style={requiredStyle}>*</span>
            </Label.Root>
            <select
              id="industry"
              name="industry"
              required
              style={inputStyle}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent transition"
            >
              <option value="" style={{color: muted}}>Select an industry</option>
              <option value="ecommerce">E-Commerce & Retail</option>
              <option value="healthcare">Healthcare & Pharmaceuticals</option>
              <option value="automotive">Automotive & Manufacturing</option>
              <option value="technology">Technology & Electronics</option>
              <option value="consumer-goods">Consumer Goods</option>
              <option value="food-beverage">Food & Beverage</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Requirements */}
      <div style={{borderTop: '1px solid ' + border}} className="pt-6">
        <div className="flex items-center mb-6">
          <div style={{background: grad}} className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
            <Briefcase className="w-5 h-5 text-theme-text" />
          </div>
          <h2 style={{color: t}} className="text-2xl font-bold">
            Service Requirements
          </h2>
        </div>
        <div className="space-y-6">
          <div>
            <Label.Root style={labelStyle} className="block text-sm font-medium mb-3">
              Services Needed <span style={requiredStyle}>*</span>
            </Label.Root>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'warehousing', label: 'Warehousing & Storage', icon: Warehouse },
                { id: 'manufacturing', label: 'Manufacturing Services', icon: Factory },
                { id: 'transportation', label: 'Transportation & Distribution', icon: Truck },
                { id: 'supply-chain', label: 'Supply Chain Management', icon: Network },
                { id: 'value-added', label: 'Value-Added Services', icon: Wrench },
                { id: 'technology', label: 'Technology Integration', icon: Cpu },
              ].map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    style={{borderColor: border, backgroundColor: s}}
                    className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-theme-primary hover:bg-theme-primary-hover transition-all cursor-pointer group"
                  >
                    <Checkbox.Root
                      id={service.id}
                      name="services"
                      value={service.id}
                      className="w-5 h-5 flex items-center justify-center border-2 rounded data-[state=checked]:bg-theme-primary data-[state=checked]:border-theme-primary transition-colors shrink-0"
                      style={{borderColor: subtle}}
                    >
                      <Checkbox.Indicator>
                        <Check className="w-4 h-4 text-theme-text" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors" style={{backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)', color: p}}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <Label.Root
                      htmlFor={service.id}
                      style={{color: muted}}
                      className="text-sm font-medium cursor-pointer flex-1 group-hover:text-theme-text transition-colors"
                    >
                      {service.label}
                    </Label.Root>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label.Root
                htmlFor="timeline"
                style={labelStyle}
                className="flex items-center text-sm font-medium mb-2"
              >
                <Calendar style={{color: p}} className="w-4 h-4 mr-2" />
                Timeline <span style={requiredStyle} className="ml-1">*</span>
              </Label.Root>
              <div className="relative">
                <select
                  id="timeline"
                  name="timeline"
                  required
                  style={inputStyle}
                  className="w-full px-4 py-2 pl-10 border-2 rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition appearance-none"
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (Within 1 month)</option>
                  <option value="1-3-months">1-3 months</option>
                  <option value="3-6-months">3-6 months</option>
                  <option value="6-plus-months">6+ months</option>
                  <option value="flexible">Flexible</option>
                </select>
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{color: subtle}} />
              </div>
            </div>
            <div>
              <Label.Root
                htmlFor="volume"
                style={labelStyle}
                className="flex items-center text-sm font-medium mb-2"
              >
                <Package style={{color: p}} className="w-4 h-4 mr-2" />
                Estimated Monthly Volume
              </Label.Root>
              <div className="relative">
                <input
                  type="text"
                  id="volume"
                  name="volume"
                  placeholder="e.g., 10,000 units"
                  style={inputStyle}
                  className="w-full px-4 py-2 pl-10 border-2 rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-theme-primary transition"
                />
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{color: subtle}} />
              </div>
            </div>
          </div>

          {/* Upload Your 3D CAD File */}
          <div className="pt-4">
            <div className="flex items-center mb-4">
              <div style={{background: grad}} className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                <Upload className="w-5 h-5 text-theme-text" />
              </div>
              <h3 style={{color: t}} className="text-xl font-bold">
                Upload Your 3D CAD File
              </h3>
            </div>
            <p style={{color: muted}} className="text-sm mb-4">
              Drag & drop or upload STEP, STP, STL, IGES files
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Upload Area */}
              <div
                style={{
                  borderWidth: '2px',
                  borderStyle: 'dashed',
                  borderColor: dragActive ? p : border,
                  backgroundColor: dragActive ? 'color-mix(in srgb, var(--theme-primary) 5%, transparent)' : s,
                }}
                className="rounded-lg p-6 text-center transition-all"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload style={{color: p}} className="w-10 h-10 mx-auto mb-3" />
                <p style={{color: t}} className="font-semibold mb-2 text-sm">
                  Drag & drop file here
                </p>
                <p style={{color: subtle}} className="text-xs mb-3">or</p>
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  style={{backgroundColor: p, color: t}}
                  className="px-5 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".step,.stp,.stl,.iges,.igs"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* File Status */}
              <div className="flex flex-col">
                <div style={{backgroundColor: s}} className="rounded-lg p-4 flex-grow">
                  <h4 style={{color: t}} className="font-semibold text-sm mb-3">Upload Status</h4>
                  {file ? (
                    <div className="flex items-start gap-2">
                      <FileCheck style={{color: p}} className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-grow min-w-0">
                        <p style={{color: t}} className="font-medium text-sm truncate">{file.name}</p>
                        <p style={{color: muted}} className="text-xs">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleClear}
                        style={{color: subtle}}
                        className="hover:text-theme-text shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p style={{color: subtle}} className="text-sm">No file selected</p>
                  )}
                </div>
              </div>
            </div>
            {/* Supported Formats Info */}
            <div style={{backgroundColor: s}} className="p-3 rounded-lg">
              <p style={{color: muted}} className="text-xs">
                <span style={{color: t}} className="font-semibold">Supported formats:</span> STEP (.step), STP (.stp), STL (.stl), IGES (.iges, .igs)
              </p>
              <p style={{color: muted}} className="text-xs mt-1">
                <span style={{color: t}} className="font-semibold">Max file size:</span> 100 MB
              </p>
            </div>
          </div>

          <div>
            <Label.Root
              htmlFor="details"
              style={labelStyle}
              className="block text-sm font-medium mb-2"
            >
              Project Details <span style={requiredStyle}>*</span>
            </Label.Root>
            <textarea
              id="details"
              name="details"
              rows={6}
              required
              placeholder="Please provide details about your requirements..."
              style={inputStyle}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          style={{backgroundColor: p, color: t}}
          className="w-full px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2 hover:opacity-90"
        >
          <span>Submit Request</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <p style={{color: subtle}} className="text-sm text-center mt-4">
          By submitting this form, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </form>
  );
}
