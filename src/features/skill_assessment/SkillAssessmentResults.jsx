import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../auth/authService.js';

const SkillAssessmentResults = () => {
  const { assessmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [evaluationData, setEvaluationData] = useState(null);
  const [learningPlan, setLearningPlan] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (location.state?.evaluationData) {
      setEvaluationData(location.state.evaluationData);
    } else {
      // Fetch evaluation data if not provided
      fetchEvaluationData();
    }
  }, [location.state, assessmentId]);

  const fetchEvaluationData = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/skill-assessment/assessment/${assessmentId}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvaluationData(data.evaluation);
        setLearningPlan(data.learning_plan);
      }
    } catch (error) {
      console.error('Error fetching evaluation data:', error);
    }
  };

  const generateLearningPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/skill-assessment/assessment/${assessmentId}/learning-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const planData = await response.json();
        setLearningPlan(planData);
      } else {
        throw new Error('Failed to generate learning plan');
      }
    } catch (error) {
      console.error('Error generating learning plan:', error);
      alert('Failed to generate learning plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const token = authService.getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/skill-assessment/assessment/${assessmentId}/export/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Handle PDF download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `learning_plan_${(evaluationData?.topic || 'assessment').replace(/\s+/g, '_')}_${assessmentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        alert('PDF downloaded successfully!');
      } else {
        throw new Error('Failed to export PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (!evaluationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Assessment Results
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here's your personalized skill evaluation and growth roadmap
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${getScoreBg(evaluationData.overall_score)} ${getScoreColor(evaluationData.overall_score)}`}>
              {Math.round(evaluationData.overall_score)}%
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
              Overall Score: {evaluationData.expertise_level}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You've demonstrated {evaluationData.expertise_level} level expertise in this skill area.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Strengths */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              💪 Strengths
            </h3>
            <div className="space-y-3">
              {evaluationData.strengths.map((strength, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-600 dark:text-green-400 mr-3">✅</span>
                  <span className="text-gray-900 dark:text-white">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              🎯 Areas for Improvement
            </h3>
            <div className="space-y-3">
              {evaluationData.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-orange-600 dark:text-orange-400 mr-3">🔄</span>
                  <span className="text-gray-900 dark:text-white">{weakness}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Breakdown */}
        {evaluationData.skill_breakdown && evaluationData.skill_breakdown.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              📊 Detailed Skill Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {evaluationData.skill_breakdown.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">{skill.area}</span>
                    <span className={`font-semibold ${getScoreColor(skill.score)}`}>
                      {Math.round(skill.score)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Plan Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              🗺️ Personalized Learning Plan
            </h3>
            <div className="space-x-3">
              {learningPlan && (
                <button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg 
                           transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {isExporting ? 'Exporting...' : '📄 Export PDF'}
                </button>
              )}
              
              {!learningPlan && (
                <button
                  onClick={generateLearningPlan}
                  disabled={isGeneratingPlan}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 
                           disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold
                           transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {isGeneratingPlan ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Researching Q4 2025 Market Trends...</span>
                    </div>
                  ) : (
                    '🔥 Generate Fresh Learning Plan (Q4 2025)'
                  )}
                </button>
              )}
            </div>
          </div>

          {learningPlan ? (
            <div className="space-y-6">
              {/* Market Research Badge */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    🔥 Learning plan generated with FRESH Q4 2025 market research
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-300">
                    • Latest industry trends • Current job demand • December 2025 skills
                  </span>
                </div>
              </div>

              {/* Timeline & Priority Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    📅 Recommended Timeline
                  </h4>
                  <p className="text-blue-800 dark:text-blue-300">
                    {learningPlan.timeline_weeks} weeks to complete
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                    🎯 Priority Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {learningPlan.priority_skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Breakdown */}
              {learningPlan.weekly_breakdown && learningPlan.weekly_breakdown.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">📅 Weekly Learning Plan</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {learningPlan.weekly_breakdown.slice(0, 8).map((week, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            Week {week.week}: {week.theme}
                          </h5>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 rounded">
                            {week.hours_per_week}h/week
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <strong className="text-sm text-gray-700 dark:text-gray-300">Objectives:</strong>
                            <ul className="list-disc list-inside ml-2 text-sm text-gray-600 dark:text-gray-400">
                              {week.objectives.map((obj, objIndex) => (
                                <li key={objIndex}>{obj}</li>
                              ))}
                            </ul>
                          </div>
                          {week.milestone && (
                            <div>
                              <strong className="text-sm text-green-700 dark:text-green-300">Milestone:</strong>
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-2">{week.milestone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {learningPlan.weekly_breakdown.length > 8 && (
                      <div className="text-center py-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ... and {learningPlan.weekly_breakdown.length - 8} more weeks
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Learning Modules */}
              {learningPlan.learning_modules && learningPlan.learning_modules.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">📚 Learning Modules</h4>
                  <div className="space-y-4">
                    {learningPlan.learning_modules.slice(0, 3).map((module, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">{module.title}</h5>
                          <span className={`px-2 py-1 text-xs rounded ${
                            module.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                            module.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                          }`}>
                            {module.duration_weeks} weeks
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 whitespace-pre-line">{module.description}</p>
                        
                        {/* Weekly Breakdown within Module */}
                        {module.weekly_breakdown && module.weekly_breakdown.length > 0 && (
                          <div className="mt-4 space-y-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h6 className="font-medium text-gray-900 dark:text-white text-sm mb-3">📅 Week-by-Week Plan</h6>
                            {module.weekly_breakdown.map((week, weekIdx) => (
                              <div key={weekIdx} className="border-l-4 border-blue-500 pl-4 py-2">
                                <div className="flex justify-between items-start mb-2">
                                  <h6 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                    Week {week.week}: {week.theme}
                                  </h6>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {week.time_commitment_hours}h
                                  </span>
                                </div>
                                
                                {week.focus_area && (
                                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                                    <strong>Focus:</strong> {week.focus_area}
                                  </p>
                                )}
                                
                                {week.why_this_week && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 whitespace-pre-line italic bg-blue-50 dark:bg-blue-900/10 p-2 rounded">
                                    <strong>Why:</strong> {week.why_this_week}
                                  </p>
                                )}
                                
                                {week.goals && week.goals.length > 0 && (
                                  <div className="mb-2">
                                    <strong className="text-xs text-gray-700 dark:text-gray-300">Goals:</strong>
                                    <ul className="list-disc list-inside ml-2 text-xs text-gray-600 dark:text-gray-400">
                                      {week.goals.map((goal, gIdx) => (
                                        <li key={gIdx}>{goal}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {week.daily_breakdown && week.daily_breakdown.length > 0 && (
                                  <div className="mb-2">
                                    <strong className="text-xs text-gray-700 dark:text-gray-300">Daily Plan:</strong>
                                    <ul className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                                      {week.daily_breakdown.map((day, dIdx) => (
                                        <li key={dIdx}>• {day}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {week.deliverables && week.deliverables.length > 0 && (
                                  <div>
                                    <strong className="text-xs text-green-700 dark:text-green-300">Deliverables:</strong>
                                    <ul className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                                      {week.deliverables.map((del, delIdx) => (
                                        <li key={delIdx}>✓ {del}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Resources */}
              {learningPlan.learning_resources && learningPlan.learning_resources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">📖 Learning Resources</h4>
                  <div className="space-y-3">
                    {learningPlan.learning_resources.slice(0, 6).map((resource, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">{resource.title || resource.name}</h5>
                          <span className={`px-2 py-1 text-xs rounded ${
                            resource.type === 'course' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
                            resource.type === 'book' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                            resource.type === 'video' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {resource.type || 'Resource'}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{resource.description}</p>
                        {resource.url && (
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                          >
                            View Resource →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Ideas */}
              {learningPlan.project_ideas && learningPlan.project_ideas.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">🛠️ Project Ideas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningPlan.project_ideas.slice(0, 4).map((project, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-medium text-gray-900 dark:text-white">{project.title}</h5>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200 rounded">
                              {project.difficulty}
                            </span>
                            {project.duration_weeks && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded">
                                {project.duration_weeks}w
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Project Description with formatted paragraphs */}
                        <div className="text-gray-600 dark:text-gray-300 text-sm mb-3 space-y-2">
                          {project.description && project.description.split('\\n\\n').map((paragraph, pIdx) => (
                            paragraph.trim() && (
                              <p key={pIdx} className="leading-relaxed">
                                {paragraph.trim()}
                              </p>
                            )
                          ))}
                        </div>
                        
                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="mb-2">
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 6).map((tech, techIdx) => (
                                <span key={techIdx} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {project.estimated_hours && `${project.estimated_hours}h`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Progression */}
              {learningPlan.career_progression && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">🚀 Career Progression</h4>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {learningPlan.career_progression}
                    </p>
                  </div>
                </div>
              )}

              {/* Market Insights */}
              {learningPlan.market_research_insights && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">📊 Market Insights</h4>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="space-y-2">
                      {learningPlan.market_research_insights.demand_analysis && (
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Market Demand:</strong> {learningPlan.market_research_insights.demand_analysis}
                        </p>
                      )}
                      {learningPlan.market_research_insights.skill_gaps && (
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Skill Gaps:</strong> {learningPlan.market_research_insights.skill_gaps}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🗺️</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready for Your Learning Journey?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Generate a personalized roadmap with curated resources, project ideas, and market insights.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <button
            onClick={() => navigate('/skill-assessment')}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 
                     text-white font-semibold rounded-lg transition-all duration-200"
          >
            🎯 Take Another Assessment
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <button 
              onClick={() => navigate('/dashboard')}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillAssessmentResults;