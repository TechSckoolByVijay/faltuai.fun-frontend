import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const POPULAR_TOPICS = [
  { id: 'frontend', name: '🎨 Frontend Development', description: 'React, Vue, Angular, CSS, JavaScript' },
  { id: 'backend', name: '⚙️ Backend Development', description: 'Node.js, Python, Java, APIs, Databases' },
  { id: 'devops', name: '🚀 DevOps & Cloud', description: 'Docker, Kubernetes, AWS, CI/CD' },
  { id: 'data-engineering', name: '📊 Data Engineering', description: 'SQL, ETL, Data Pipelines, Big Data' },
  { id: 'ai-ml', name: '🤖 AI & Machine Learning', description: 'Python, TensorFlow, PyTorch, Data Science' },
  { id: 'mobile', name: '📱 Mobile Development', description: 'React Native, Flutter, iOS, Android' },
  { id: 'cybersecurity', name: '🛡️ Cybersecurity', description: 'Network Security, Ethical Hacking, Compliance' },
  { id: 'product-management', name: '📋 Product Management', description: 'Strategy, Analytics, User Research, Roadmaps' }
]

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
]

const SkillAssessmentStart = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/skill-assessment/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: topic,
          experience_level: experienceLevel
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start assessment');
      }

      const data = await response.json();
      
      // Navigate to quiz page with assessment data
      navigate(`/skill-assessment/quiz/${data.assessment_id}`, {
        state: { assessmentData: data }
      });
      
    } catch (error) {
      console.error('Error starting assessment:', error);
      alert('Failed to start assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 AI Skill Assessment
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get a personalized evaluation of your skills and receive a curated learning plan 
            tailored to your expertise level and career goals.
          </p>
          <div className="mt-6 flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">✅ 10-15 minutes</span>
            <span className="flex items-center">🤖 AI-powered evaluation</span>
            <span className="flex items-center">📋 Personalized roadmap</span>
            <span className="flex items-center">📄 Export as PDF</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Topic Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
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
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedTopic === topic.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
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

            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">Or enter custom topic:</span>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => {
                  setCustomTopic(e.target.value);
                  if (e.target.value) setSelectedTopic('');
                }}
                placeholder="e.g., Blockchain Development, Game Development..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              2. Select Your Experience Level
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setExperienceLevel(level.id)}
                  className={`p-6 rounded-lg border-2 text-center transition-all duration-200 ${
                    experienceLevel === level.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{level.icon}</div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
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
          <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleStartAssessment}
              disabled={isLoading || (!selectedTopic && !customTopic) || !experienceLevel}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 
                       disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                       text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200
                       shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Questions...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>🚀 Start Assessment</span>
                </span>
              )}
            </button>
            
            {(!selectedTopic && !customTopic) || !experienceLevel ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                Please select a topic and experience level to continue
              </p>
            ) : (
              <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-3">
                Ready to assess your skills in <strong>{customTopic || selectedTopic}</strong> at <strong>{experienceLevel}</strong> level
              </p>
            )}
          </div>
        </div>

        {/* What to Expect */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            What to Expect
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📝</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Questions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI-generated questions adapted to your experience level, covering fundamentals to advanced concepts.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Skills Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Detailed evaluation of strengths and weaknesses with actionable insights for improvement.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🗺️</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Learning Roadmap</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Personalized 3-6 month learning plan with resources, projects, and market insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillAssessmentStart;