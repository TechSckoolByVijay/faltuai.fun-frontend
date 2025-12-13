import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/authService.js';

const SkillAssessmentsList = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/skill-assessment/assessments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      } else {
        setError('Failed to fetch assessments');
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setError('Failed to load assessments');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'started': { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
      'evaluated': { color: 'bg-blue-100 text-blue-800', text: 'Completed' },
      'completed': { color: 'bg-green-100 text-green-800', text: 'With Learning Plan' }
    };

    const config = statusConfig[status] || statusConfig['started'];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
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

  const handleViewResults = (assessment) => {
    if (assessment.completion_status === 'started') {
      // If assessment is just started, could navigate to continue quiz
      navigate(`/skill-assessment`);
    } else {
      // Navigate to results page
      navigate(`/skill-assessment/results/${assessment.assessment_id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading assessments...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Your Skill Assessments
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track your progress and view your personalized learning plans
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => navigate('/skill-assessment')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            ✨ Take New Assessment
          </button>
        </div>

        {/* Assessments List */}
        {assessments.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4 text-6xl">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No assessments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Take your first skill assessment to get personalized learning recommendations
            </p>
            <button
              onClick={() => navigate('/skill-assessment')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assessments.map((assessment) => (
              <div
                key={assessment.assessment_id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                      {assessment.topic.replace('-', ' ')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(assessment.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(assessment.completion_status)}
                </div>

                {/* Evaluation Summary */}
                {assessment.evaluation && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Overall Score</span>
                      <span className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                        {Math.round(assessment.evaluation.overall_score)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${assessment.evaluation.overall_score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 capitalize">
                      Expertise Level: {assessment.evaluation.expertise_level}
                    </p>
                  </div>
                )}

                {/* Learning Plan Status */}
                {assessment.learning_plan && (
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <span className="mr-2">✅</span>
                      Learning plan generated ({assessment.learning_plan.timeline_weeks} weeks)
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewResults(assessment)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm"
                  >
                    {assessment.completion_status === 'started' ? 'Continue' : 'View Results'}
                  </button>
                  
                  {assessment.learning_plan && (
                    <button
                      onClick={() => navigate(`/skill-assessment/results/${assessment.assessment_id}`)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-sm"
                    >
                      📋 Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillAssessmentsList;