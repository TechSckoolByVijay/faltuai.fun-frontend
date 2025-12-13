import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/authService.js';

const POPULAR_TOPICS = [
  { id: 'frontend', name: '🎨 Frontend Development', description: 'React, Vue, Angular, CSS, JavaScript' },
  { id: 'backend', name: '⚙️ Backend Development', description: 'Node.js, Python, Java, APIs, Databases' },
  { id: 'devops', name: '🚀 DevOps & Cloud', description: 'Docker, Kubernetes, AWS, CI/CD' },
  { id: 'data-engineering', name: '📊 Data Engineering', description: 'SQL, ETL, Data Pipelines, Big Data' },
  { id: 'ai-ml', name: '🤖 AI & Machine Learning', description: 'Python, TensorFlow, PyTorch, Data Science' },
  { id: 'mobile', name: '📱 Mobile Development', description: 'React Native, Flutter, iOS, Android' },
  { id: 'cybersecurity', name: '🛡️ Cybersecurity', description: 'Network Security, Ethical Hacking, Compliance' },
  { id: 'product-management', name: '📋 Product Management', description: 'Strategy, Analytics, User Research, Roadmaps' }
];

const EXPERIENCE_LEVELS = [
  { 
    id: 'beginner', 
    name: 'Beginner', 
    description: '0-1 years experience, learning fundamentals',
    icon: '🌱'
  },
  { 
    id: 'intermediate', 
    name: 'Intermediate', 
    description: '1-3 years experience, building projects',
    icon: '🌿' 
  },
  { 
    id: 'advanced', 
    name: 'Advanced', 
    description: '3+ years experience, leading teams',
    icon: '🌳'
  }
];

const SkillAssessmentStart = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousAssessments, setPreviousAssessments] = useState([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    if (authService.isAuthenticated()) {
      fetchPreviousAssessments();
    } else {
      setIsLoadingAssessments(false);
    }
  }, []);

  const fetchPreviousAssessments = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/skill-assessment/assessments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPreviousAssessments(data);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setIsLoadingAssessments(false);
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

  const handleViewAssessment = (assessment) => {
    if (assessment.completion_status === 'started') {
      navigate(`/skill-assessment`);
    } else {
      navigate(`/skill-assessment/results/${assessment.assessment_id}`);
    }
  };

  const handleStartAssessment = async () => {
    if (!selectedTopic && !customTopic) {
      alert('Please select a topic or enter a custom one');
      return;
    }

    if (!experienceLevel) {
      alert('Please select your experience level');
      return;
    }

    const topic = customTopic || selectedTopic;
    
    setIsLoading(true);
    try {
      const token = authService.getToken();
      
      if (!token || !authService.isAuthenticated()) {
        setIsAuthenticated(false);
        return;
      }

      console.log('Making request with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/skill-assessment/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: topic,
          experience_level: experienceLevel,
          custom_topic: customTopic || null
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      
      // Navigate to quiz with assessment ID and pass the assessment data
      navigate(`/skill-assessment/quiz/${data.assessment_id}`, {
        state: { assessmentData: data }
      });
    } catch (error) {
      console.error('Error starting assessment:', error);
      alert(`Failed to start assessment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🔐</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Authentication Required
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Please log in with your Google account to access the AI Skill Assessment feature.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Why do I need to log in?
              </h2>
              <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Save your assessment progress and results</li>
                <li>• Generate personalized learning plans</li>
                <li>• Track your skill development over time</li>
                <li>• Export your assessments as PDF reports</li>
              </ul>
            </div>
            <button
              onClick={() => authService.loginWithGoogle()}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              We use Google OAuth for secure authentication. Your data is safe with us.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 AI Skill Assessment
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get a personalized evaluation of your skills and receive a curated learning plan
            tailored to your expertise level and career goals.
          </p>
        </div>

        {/* What to Expect */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Questions</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                AI-generated questions adapted to your experience level, covering fundamentals to advanced concepts.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skills Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Detailed evaluation of strengths and weaknesses with actionable insights for improvement.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Learning Roadmap</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Personalized curriculum with resources, projects, and timeline based on your goals.
              </p>
            </div>
          </div>
        </div>

        {/* Assessment Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="space-y-8">
            {/* Topic Selection */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                1. Choose Your Skill Area
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {POPULAR_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setCustomTopic('');
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTopic === topic.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {topic.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {topic.description}
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or enter a custom topic:
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => {
                    setCustomTopic(e.target.value);
                    setSelectedTopic('');
                  }}
                  placeholder="e.g., React Native, Kubernetes, Machine Learning..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                           dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                2. Select Your Experience Level
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setExperienceLevel(level.id)}
                    className={`p-6 rounded-lg border-2 text-center transition-all ${
                      experienceLevel === level.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400'
                    }`}
                  >
                    <div className="text-3xl mb-3">{level.icon}</div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">
                      {level.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleStartAssessment}
                disabled={isLoading || (!selectedTopic && !customTopic) || !experienceLevel}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 
                         disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold text-lg
                         transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Starting Assessment...</span>
                  </div>
                ) : (
                  '🚀 Start My Assessment'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Previous Assessments */}
        {!isLoadingAssessments && previousAssessments.length > 0 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              📊 Your Previous Assessments
            </h3>
            
            <div className="space-y-4">
              {previousAssessments.slice(0, 5).map((assessment) => (
                <div
                  key={assessment.assessment_id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={() => handleViewAssessment(assessment)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                        {assessment.topic.replace('-', ' ')}
                      </h4>
                      {getStatusBadge(assessment.completion_status)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(assessment.created_at)}
                    </p>
                    {assessment.evaluation ? (
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Score: <strong>{Math.round(assessment.evaluation.overall_score)}%</strong>
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                          Level: <strong>{assessment.evaluation.expertise_level}</strong>
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Assessment in progress...
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {assessment.learning_plan && (
                      <span className="text-green-600 dark:text-green-400 text-sm">
                        📋 Learning Plan
                      </span>
                    )}
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
              
              {previousAssessments.length > 5 && (
                <div className="text-center pt-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Showing latest 5 assessments out of {previousAssessments.length} total
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State for No Previous Assessments */}
        {!isLoadingAssessments && previousAssessments.length === 0 && (
          <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Previous Assessments
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your first skill assessment above to see your progress history here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillAssessmentStart;