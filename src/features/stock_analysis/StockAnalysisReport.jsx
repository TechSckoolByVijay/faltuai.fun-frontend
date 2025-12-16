import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../auth/authService.js';
import ReactMarkdown from 'react-markdown';

const StockAnalysisReport = () => {
  const { analysisId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
    fetchAnalysis();
    
    // Set up polling for pending/processing analyses
    const interval = setInterval(() => {
      if (analysis && (analysis.analysis_status === 'pending' || analysis.analysis_status === 'processing')) {
        fetchAnalysis();
      }
    }, 5000); // Poll every 5 seconds

    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [analysisId]);

  const fetchAnalysis = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/stock-analysis/analyze/${analysisId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        
        // Stop polling if analysis is completed or failed
        if (data.analysis_status === 'completed' || data.analysis_status === 'failed') {
          if (pollingInterval) {
            clearInterval(pollingInterval);
          }
        }
      } else if (response.status === 404) {
        setError('Analysis not found');
      } else {
        setError('Failed to load analysis');
      }
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('Failed to load analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      const token = authService.getToken();
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/stock-analysis/analyze/${analysisId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        navigate('/stock-analysis');
      } else {
        alert('Failed to delete analysis');
      }
    } catch (err) {
      console.error('Error deleting analysis:', err);
      alert('Failed to delete analysis');
    }
  };

  const downloadReport = () => {
    if (!analysis || !analysis.final_report) return;

    const blob = new Blob([analysis.final_report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-analysis-${analysis.stock_symbol || 'report'}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h2>
          <button
            onClick={() => navigate('/stock-analysis')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const getStatusDisplay = (status) => {
    const configs = {
      'pending': {
        icon: '⏳',
        text: 'Pending',
        color: 'bg-gray-100 text-gray-800',
        message: 'Your analysis is queued and will start shortly...'
      },
      'processing': {
        icon: '⚙️',
        text: 'Processing',
        color: 'bg-blue-100 text-blue-800',
        message: 'AI is analyzing the stock. This may take a few minutes...'
      },
      'completed': {
        icon: '✅',
        text: 'Completed',
        color: 'bg-green-100 text-green-800',
        message: null
      },
      'failed': {
        icon: '❌',
        text: 'Failed',
        color: 'bg-red-100 text-red-800',
        message: analysis.error_message || 'Analysis failed. Please try again.'
      }
    };

    return configs[status] || configs['pending'];
  };

  const statusDisplay = getStatusDisplay(analysis.analysis_status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {analysis.stock_symbol ? `${analysis.stock_symbol} Analysis` : 'Stock Analysis Report'}
              </h1>
              {analysis.stock_name && (
                <p className="text-lg text-gray-600 dark:text-gray-400">{analysis.stock_name}</p>
              )}
            </div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${statusDisplay.color}`}>
              <span className="text-xl">{statusDisplay.icon}</span>
              {statusDisplay.text}
            </span>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p className="mb-1"><strong>Question:</strong> {analysis.user_question}</p>
            <p><strong>Created:</strong> {new Date(analysis.created_at).toLocaleString()}</p>
            {analysis.completed_at && (
              <p><strong>Completed:</strong> {new Date(analysis.completed_at).toLocaleString()}</p>
            )}
            {analysis.model_name && (
              <p><strong>Model:</strong> {analysis.model_name}</p>
            )}
          </div>

          {/* Action Buttons */}
          {analysis.analysis_status === 'completed' && (
            <div className="flex gap-3">
              <button
                onClick={downloadReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                📥 Download Report
              </button>
              <button
                onClick={() => navigate('/stock-analysis')}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                ← Back
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-auto"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        {/* Status Message */}
        {statusDisplay.message && (
          <div className={`rounded-lg p-6 mb-6 ${
            analysis.analysis_status === 'failed' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <div className="flex items-center gap-3">
              {analysis.analysis_status === 'processing' && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              )}
              <p className={`text-lg ${
                analysis.analysis_status === 'failed' ? 'text-red-800 dark:text-red-200' : 'text-blue-800 dark:text-blue-200'
              }`}>
                {statusDisplay.message}
              </p>
            </div>
          </div>
        )}

        {/* Final Report */}
        {analysis.analysis_status === 'completed' && analysis.final_report && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{analysis.final_report}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Research Data (collapsible) */}
        {analysis.research_data && analysis.analysis_status === 'completed' && (
          <details className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white mb-4">
              📊 Research Data (Click to expand)
            </summary>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {analysis.research_data}
              </pre>
            </div>
          </details>
        )}

        {/* Analysis Plan (collapsible) */}
        {analysis.analysis_plan && analysis.analysis_status === 'completed' && (
          <details className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white mb-4">
              📋 Analysis Plan (Click to expand)
            </summary>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {analysis.analysis_plan}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default StockAnalysisReport;
