import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/authService.js';

const POPULAR_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: '🏭 Conglomerate' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: '💻 IT Services' },
  { symbol: 'INFY', name: 'Infosys', sector: '💻 IT Services' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: '🏦 Banking' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: '🏦 Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: '📱 Telecom' },
  { symbol: 'ITC', name: 'ITC Limited', sector: '🏢 Diversified' },
  { symbol: 'WIPRO', name: 'Wipro', sector: '💻 IT Services' }
];

const StockAnalysisStart = () => {
  const navigate = useNavigate();
  const [userQuestion, setUserQuestion] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [customStockSymbol, setCustomStockSymbol] = useState('');
  const [customStockName, setCustomStockName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousAnalyses, setPreviousAnalyses] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchAnalysisHistory();
    } else {
      setIsLoadingHistory(false);
    }
  }, []);

  const fetchAnalysisHistory = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/stock-analysis/history?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPreviousAnalyses(data.analyses || []);
      }
    } catch (error) {
      console.error('Error fetching analysis history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!userQuestion.trim()) {
      alert('Please enter your investment question');
      return;
    }

    setIsLoading(true);
    try {
      const token = authService.getToken();
      
      // Prepare request
      let stockSymbol = customStockSymbol.trim();
      let stockName = customStockName.trim();
      
      if (selectedStock) {
        const stock = POPULAR_STOCKS.find(s => s.symbol === selectedStock);
        if (stock) {
          stockSymbol = stock.symbol;
          stockName = stock.name;
        }
      }

      const requestBody = {
        user_question: userQuestion.trim(),
        stock_symbol: stockSymbol || null,
        stock_name: stockName || null
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/stock-analysis/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to results page
        navigate(`/stock-analysis/report/${data.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to start analysis'}`);
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      alert('Failed to start stock analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAnalysis = (analysisId) => {
    navigate(`/stock-analysis/report/${analysisId}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-gray-100 text-gray-800', text: 'Pending', icon: '⏳' },
      'processing': { color: 'bg-blue-100 text-blue-800', text: 'Processing', icon: '⚙️' },
      'completed': { color: 'bg-green-100 text-green-800', text: 'Completed', icon: '✅' },
      'failed': { color: 'bg-red-100 text-red-800', text: 'Failed', icon: '❌' }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <span>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📈 Stock Fundamental Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get comprehensive equity research reports powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Start New Analysis
              </h2>

              {/* Investment Question */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Investment Question *
                </label>
                <textarea
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="e.g., Should I invest in Reliance Industries for long-term growth? Is TCS a good buy at current valuations?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows="4"
                />
              </div>

              {/* Stock Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Stock (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {POPULAR_STOCKS.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => {
                        setSelectedStock(stock.symbol);
                        setCustomStockSymbol('');
                        setCustomStockName('');
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedStock === stock.symbol
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {stock.sector}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Stock Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or Enter Custom Stock
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={customStockSymbol}
                    onChange={(e) => {
                      setCustomStockSymbol(e.target.value);
                      setSelectedStock('');
                    }}
                    placeholder="Stock Symbol (e.g., TATAMOTORS)"
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    value={customStockName}
                    onChange={(e) => setCustomStockName(e.target.value)}
                    placeholder="Company Name (optional)"
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleStartAnalysis}
                disabled={isLoading || !userQuestion.trim()}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                  isLoading || !userQuestion.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Initiating Analysis...
                  </span>
                ) : (
                  '🚀 Start Analysis'
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Analysis typically takes 2-5 minutes. You'll receive a comprehensive equity research report covering financial analysis, valuation, risks, and recommendations.
              </p>
            </div>
          </div>

          {/* Recent Analyses Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Analyses
              </h3>

              {isLoadingHistory ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : previousAnalyses.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No previous analyses</p>
                  <p className="text-sm mt-2">Your analysis history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {previousAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      onClick={() => handleViewAnalysis(analysis.id)}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                          {analysis.stock_symbol || 'Custom Query'}
                        </div>
                        {getStatusBadge(analysis.analysis_status)}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {analysis.user_question}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(analysis.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysisStart;
