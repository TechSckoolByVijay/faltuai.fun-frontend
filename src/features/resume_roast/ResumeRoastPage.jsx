import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../../auth/authService.js';
import { API_ENDPOINTS } from '../../config/backend.js';

/**
 * ResumeRoastPage - Protected feature for roasting resumes
 */
const ResumeRoastPage = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [roastStyles, setRoastStyles] = useState({});
  const [selectedStyle, setSelectedStyle] = useState('funny');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Text input state
  const [resumeText, setResumeText] = useState('');

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Load available roasting styles on component mount
  useEffect(() => {
    loadRoastingStyles();
  }, []);

  const loadRoastingStyles = async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get(API_ENDPOINTS.RESUME_ROAST.STYLES, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRoastStyles(response.data.styles);
    } catch (err) {
      console.error('Failed to load roasting styles:', err);
    }
  };

  const handleTextRoast = async () => {
    if (!resumeText.trim()) {
      setError('Please enter your resume text');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = authService.getToken();
      const response = await axios.post(
        API_ENDPOINTS.RESUME_ROAST.ROAST_TEXT,
        {
          resume_text: resumeText,
          roast_style: selectedStyle
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to roast resume');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('roast_style', selectedStyle);

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = authService.getToken();
      const response = await axios.post(
        API_ENDPOINTS.RESUME_ROAST.UPLOAD_AND_ROAST,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process file and roast resume');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const tryDemo = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = authService.getToken();
      const response = await axios.get(API_ENDPOINTS.RESUME_ROAST.DEMO, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setResult(response.data.roasting_result);
    } catch (err) {
      setError('Failed to load demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                🔥 Resume Roaster
              </h1>
              <p className="text-red-100 text-lg">
                Get your resume roasted by AI - because honesty hurts, but it helps!
              </p>
            </div>
            <div className="text-right">
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                💎 PREMIUM FEATURE
              </div>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">😂</div>
            <h3 className="font-semibold">Funny Roasts</h3>
            <p className="text-sm text-gray-600">Humorous feedback</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">💼</div>
            <h3 className="font-semibold">Professional</h3>
            <p className="text-sm text-gray-600">Constructive advice</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">💀</div>
            <h3 className="font-semibold">Brutal Honesty</h3>
            <p className="text-sm text-gray-600">No holds barred</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold">Actionable Tips</h3>
            <p className="text-sm text-gray-600">Specific improvements</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>

            {/* Style Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Roasting Style:
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {Object.entries(roastStyles).map(([key, style]) => (
                  <option key={key} value={key}>
                    {style.name} - {style.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-4 border-b">
              <button
                onClick={() => setActiveTab('text')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'text' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📝 Paste Text
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'file' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📄 Upload File
              </button>
            </div>

            {/* Text Input Tab */}
            {activeTab === 'text' && (
              <div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here... (minimum 50 characters)"
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {resumeText.length} characters
                  </span>
                  <button
                    onClick={handleTextRoast}
                    disabled={loading || resumeText.length < 50}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
                  >
                    {loading ? 'Roasting...' : '🔥 Roast My Resume!'}
                  </button>
                </div>
              </div>
            )}

            {/* File Upload Tab */}
            {activeTab === 'file' && (
              <div>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition duration-200 ${
                    dragOver 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 hover:border-red-400'
                  }`}
                >
                  <div className="text-4xl mb-4">📁</div>
                  <p className="text-lg font-medium mb-2">
                    Drop your resume here or click to select
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF and TXT files (max 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition duration-200"
                  >
                    Select File
                  </label>
                  
                  {selectedFile && (
                    <div className="mt-4 text-sm text-gray-600">
                      Selected: {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Demo Button */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={tryDemo}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
              >
                🎭 Try Demo (Sample Resume)
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="text-red-400 mr-3">❌</div>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Roasting Results</h2>

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-600">🔥 Roasting in progress...</p>
                <p className="text-sm text-gray-500 mt-2">This might take a few seconds</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Confidence Score */}
                {result.confidence_score && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Hireable Score:</span>
                      <span className={`font-bold text-lg ${
                        result.confidence_score >= 7 ? 'text-green-600' :
                        result.confidence_score >= 5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {result.confidence_score}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          result.confidence_score >= 7 ? 'bg-green-500' :
                          result.confidence_score >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.confidence_score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Main Roast */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    🔥 The Roast ({result.style})
                  </h3>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="whitespace-pre-wrap text-gray-800">
                      {result.roast}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      💡 Improvement Suggestions
                    </h3>
                    <div className="space-y-2">
                      {result.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setResult(null);
                      setResumeText('');
                      setSelectedFile(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                  >
                    🔄 Try Another
                  </button>
                  <button
                    onClick={() => {
                      const text = `Resume Roast Results:\n\n${result.roast}\n\nSuggestions:\n${result.suggestions?.join('\n') || 'No suggestions'}`;
                      navigator.clipboard.writeText(text);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                  >
                    📋 Copy Results
                  </button>
                </div>
              </div>
            )}

            {!loading && !result && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🔥</div>
                <p className="text-lg">Ready to roast your resume!</p>
                <p className="text-sm mt-2">Upload a file or paste your resume text to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumeRoastPage;