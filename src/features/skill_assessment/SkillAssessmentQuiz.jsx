import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../auth/authService.js';

const SkillAssessmentQuiz = () => {
  const { assessmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [assessmentData, setAssessmentData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  useEffect(() => {
    // Get assessment data from navigation state
    if (location.state?.assessmentData) {
      console.log('Assessment data received:', location.state.assessmentData);
      setAssessmentData(location.state.assessmentData);
      setTimeLeft(location.state.assessmentData.estimated_minutes * 60); // Convert to seconds
    } else {
      console.error('No assessment data provided in navigation state');
      // Show error and redirect back to start
      setTimeout(() => {
        navigate('/skill-assessment', { 
          state: { error: 'Assessment session expired. Please start a new assessment.' }
        });
      }, 3000);
    }
  }, [location.state, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = assessmentData?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (assessmentData?.questions.length - 1);

  const handleAnswerSelect = (optionId, optionText) => {
    setSelectedAnswer(optionText);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        user_answer: optionText,
        time_taken: 60 - (timeLeft % 60), // Simple time tracking per question
        is_unsure: false
      }
    }));
  };

  const handleNotSure = () => {
    const notSureAnswer = "Not Sure";
    setSelectedAnswer(notSureAnswer);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        user_answer: notSureAnswer,
        time_taken: 60 - (timeLeft % 60),
        is_unsure: true
      }
    }));
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      alert('Please select an answer before continuing');
      return;
    }

    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[assessmentData.questions[currentQuestionIndex + 1]?.id]?.user_answer || '');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[assessmentData.questions[currentQuestionIndex - 1]?.id]?.user_answer || '');
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/skill-assessment/assessment/${assessmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: Object.values(answers)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const evaluationData = await response.json();
      
      // Navigate to results page
      navigate(`/skill-assessment/results/${assessmentId}`, {
        state: { evaluationData }
      });
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assessmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading assessment...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            If this takes too long, you'll be redirected to start a new assessment.
          </p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / assessmentData.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assessmentData.topic} Assessment
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Time Left: <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {currentQuestionIndex + 1} of {assessmentData.questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Progress: {Math.round(progress)}%</span>
            <span>Answered: {answeredCount}/{assessmentData.questions.length}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                Question {currentQuestionIndex + 1}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {currentQuestion?.difficulty_level}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {currentQuestion?.question_text}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion?.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id, option.text)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                  selectedAnswer === option.text
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedAnswer === option.text
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedAnswer === option.text && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-[2px]"></div>
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white">{option.text}</span>
                </div>
              </button>
            ))}
            
            {/* Not Sure Option */}
            <button
              onClick={handleNotSure}
              className={`w-full p-4 text-center border-2 rounded-lg transition-all duration-200 ${ selectedAnswer === 'Not Sure'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-yellow-200 dark:border-yellow-600 hover:border-yellow-400 dark:hover:border-yellow-500'
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="text-lg mr-2">🤔</span>
                <span className={`font-medium ${
                  selectedAnswer === 'Not Sure'
                    ? 'text-yellow-700 dark:text-yellow-300'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>Not Sure - Need to Learn This</span>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 
                     hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
          >
            ← Previous
          </button>

          <div className="flex space-x-4">
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || answeredCount === 0}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg 
                       transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Now'}
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 
                       disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold
                       transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Question Navigator (Optional) */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Navigation</h3>
          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
            {assessmentData.questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer(answers[question.id]?.user_answer || '');
                }}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors duration-200 ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : answers[question.id]
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-primary-600 rounded mr-1"></div>
              Current
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-100 dark:bg-green-800 rounded mr-1"></div>
              Answered
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 rounded mr-1"></div>
              Unanswered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillAssessmentQuiz;