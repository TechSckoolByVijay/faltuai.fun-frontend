import React, { useState, useEffect, useMemo } from 'react';
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
      console.log('🔍 Fetching evaluation data for assessment:', assessmentId);
      const token = authService.getToken();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/skill-assessment/assessment/${assessmentId}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Received evaluation data:', data);
        console.log('📊 Learning plan modules count:', data.learning_plan?.learning_modules?.length);
        console.log('📊 Market insights available:', !!data.learning_plan?.market_research_insights);
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
        console.log('📊 Learning Plan Data:', planData);
        console.log('📊 Market Research Insights:', planData.market_research_insights);
        console.log('📊 Market Demand:', planData.market_research_insights?.market_demand);
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

  // Memoize expensive computations
  const limitedModules = useMemo(() => 
    (learningPlan?.learning_modules || []).slice(0, 3),
    [learningPlan]
  );

  const limitedStrengths = useMemo(() => 
    (evaluationData?.strengths || []).slice(0, 10),
    [evaluationData]
  );

  const limitedWeaknesses = useMemo(() => 
    (evaluationData?.weaknesses || []).slice(0, 10),
    [evaluationData]
  );

  if (!evaluationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  console.log('🎨 Rendering SkillAssessmentResults with:', {
    hasEvaluation: !!evaluationData,
    hasLearningPlan: !!learningPlan,
    modulesCount: learningPlan?.learning_modules?.length,
    strengthsCount: evaluationData?.strengths?.length,
    weaknessesCount: evaluationData?.weaknesses?.length
  });
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
              {(evaluationData.strengths || []).slice(0, 10).map((strength, index) => (
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
              {(evaluationData.weaknesses || []).slice(0, 10).map((weakness, index) => (
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
              {(evaluationData.skill_breakdown || []).slice(0, 15).map((skill, index) => (
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
                    {(learningPlan.priority_skills || []).slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Market Insights Dashboard - NEW SECTION */}
              {learningPlan.market_research_insights && (
                <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/10 dark:via-blue-900/10 dark:to-purple-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Live Market Intelligence</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Real data from Serper, GitHub, YouTube & HackerNews APIs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-800 dark:text-green-200">Live Data</span>
                    </div>
                  </div>

                  {/* Market Demand Stats */}
                  {learningPlan.market_research_insights.market_demand && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="text-lg mr-2">🔥</span>
                        Job Market Demand
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {learningPlan.market_research_insights.market_demand.job_postings_analyzed > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              {learningPlan.market_research_insights.market_demand.job_postings_analyzed.toLocaleString()}+
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Job Postings</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Analyzed from Google Search</div>
                          </div>
                        )}
                        
                        {learningPlan.market_research_insights.market_demand.remote_work_percentage > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                              {learningPlan.market_research_insights.market_demand.remote_work_percentage}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Remote Positions</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">From HackerNews data</div>
                          </div>
                        )}
                        
                        {learningPlan.market_research_insights.market_demand.google_search_results > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                              {(learningPlan.market_research_insights.market_demand.google_search_results / 1000).toFixed(1)}K+
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Search Results</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Serper API (Google)</div>
                          </div>
                        )}
                      </div>

                      {/* Top Required Skills */}
                      {learningPlan.market_research_insights.market_demand?.required_skills && 
                       learningPlan.market_research_insights.market_demand.required_skills.length > 0 && (
                        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            🎯 Top Skills in Job Postings (From Real Searches)
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(learningPlan.market_research_insights.market_demand.required_skills || []).slice(0, 10).map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Salary Mentions */}
                      {learningPlan.market_research_insights.market_demand?.salary_mentions && 
                       learningPlan.market_research_insights.market_demand.salary_mentions.length > 0 && (
                        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            💰 Salary Insights (Real Data)
                          </div>
                          <div className="space-y-2">
                            {(learningPlan.market_research_insights.market_demand.salary_mentions || []).slice(0, 3).map((mention, idx) => (
                              <div key={idx} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-500">
                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                  {mention.salary_mention || mention}
                                </div>
                                {mention.context && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {mention.context}
                                  </div>
                                )}
                                {mention.source && (
                                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    Source: {mention.source}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* GitHub Technology Adoption */}
                  {learningPlan.market_research_insights.skill_gaps && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="text-lg mr-2">⭐</span>
                        Technology Adoption (GitHub Metrics)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {learningPlan.market_research_insights.skill_gaps.github_total_repos > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Repositories</span>
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {(learningPlan.market_research_insights.skill_gaps.github_total_repos / 1000).toFixed(1)}K
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '75%'}}></div>
                            </div>
                          </div>
                        )}
                        
                        {learningPlan.market_research_insights.skill_gaps.github_total_stars > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Community Stars</span>
                              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {(learningPlan.market_research_insights.skill_gaps.github_total_stars / 1000).toFixed(1)}K
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{width: '85%'}}></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Popular Repositories */}
                      {learningPlan.market_research_insights.skill_gaps?.popular_repositories && 
                       learningPlan.market_research_insights.skill_gaps.popular_repositories.length > 0 && (
                        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            🌟 Trending Repositories to Study
                          </div>
                          <div className="space-y-2">
                            {(learningPlan.market_research_insights.skill_gaps.popular_repositories || []).slice(0, 5).map((repo, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                                <a href={repo.url} target="_blank" rel="noopener noreferrer" 
                                   className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex-1">
                                  {repo.name}
                                </a>
                                <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 flex items-center ml-2">
                                  ⭐ {(repo.stars / 1000).toFixed(1)}k
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Emerging Technologies */}
                      {learningPlan.market_research_insights.skill_gaps?.emerging_technologies && 
                       learningPlan.market_research_insights.skill_gaps.emerging_technologies.length > 0 && (
                        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            🚀 Emerging Technologies (GitHub Trending)
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(learningPlan.market_research_insights.skill_gaps.emerging_technologies || []).slice(0, 8).map((tech, idx) => (
                              <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Learning Resources Stats */}
                  {learningPlan.market_research_insights.learning_resources && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="text-lg mr-2">📺</span>
                        Learning Content Available (YouTube Analytics)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {learningPlan.market_research_insights.learning_resources.youtube_videos_found > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                              {learningPlan.market_research_insights.learning_resources.youtube_videos_found.toLocaleString()}+
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tutorial Videos</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">YouTube API results</div>
                          </div>
                        )}
                        
                        {learningPlan.market_research_insights.learning_resources.total_views && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {(learningPlan.market_research_insights.learning_resources.total_views / 1000000).toFixed(1)}M+
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Views</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Community engagement</div>
                          </div>
                        )}
                        
                        {learningPlan.market_research_insights.learning_resources.average_rating > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                              {learningPlan.market_research_insights.learning_resources.average_rating.toFixed(1)}/5.0
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg. Rating</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Quality content</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Career Path & Salary Data */}
                  {learningPlan.market_research_insights.career_paths && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="text-lg mr-2">💼</span>
                        Career Path & Salary Trends
                      </h5>
                      
                      {learningPlan.market_research_insights.career_paths?.real_salary_data && 
                       learningPlan.market_research_insights.career_paths.real_salary_data.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            💰 Real Salary Data (from job postings)
                          </div>
                          <div className="space-y-2">
                            {(learningPlan.market_research_insights.career_paths.real_salary_data || []).slice(0, 5).map((data, idx) => {
                              const salaryText = Array.isArray(data.salary_mention) 
                                ? data.salary_mention.join(' - ') 
                                : (data.salary || data.range || 'N/A');
                              return (
                                <a key={idx} 
                                   href={data.url || '#'} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors border-l-4 border-green-500">
                                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{data.title || data.role}</span>
                                  <span className="text-sm font-bold text-green-600 dark:text-green-400 ml-2">
                                    {salaryText}
                                  </span>
                                  <span className="text-blue-500 ml-2">🔗</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tech Trends */}
                  {learningPlan.market_research_insights.tech_trends && (
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="text-lg mr-2">📰</span>
                        Latest Industry Trends (News & Discussions)
                      </h5>
                      
                      {learningPlan.market_research_insights.tech_trends?.news_articles && 
                       learningPlan.market_research_insights.tech_trends.news_articles.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            📰 Recent News Articles (Serper API)
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {(learningPlan.market_research_insights.tech_trends.news_articles || []).slice(0, 5).map((article, idx) => (
                              <a key={idx} href={article.link || article.url || '#'} target="_blank" rel="noopener noreferrer"
                                 className="block p-3 bg-gray-50 dark:bg-gray-900/50 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border-l-4 border-blue-500">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                      {article.title}
                                    </div>
                                    {article.date && (
                                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{article.date}</div>
                                    )}
                                    {article.source && (
                                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Source: {article.source}</div>
                                    )}
                                  </div>
                                  <span className="text-blue-500 ml-2">🔗</span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Data Source Attribution */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>✅ Serper API (Google Search)</span>
                        <span>✅ GitHub API</span>
                        <span>✅ YouTube Data API v3</span>
                        <span>✅ HackerNews API</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Updated: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weekly Breakdown */}
              {learningPlan.weekly_breakdown && learningPlan.weekly_breakdown.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">📅 Weekly Learning Plan</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {(learningPlan.weekly_breakdown || []).slice(0, 8).map((week, index) => (
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
                              {(week.objectives || []).slice(0, 5).map((obj, objIndex) => (
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
                    {(learningPlan.learning_modules || []).slice(0, 3).map((module, index) => (
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
                            {(module.weekly_breakdown || []).slice(0, 4).map((week, weekIdx) => (
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
                                      {(week.goals || []).slice(0, 5).map((goal, gIdx) => (
                                        <li key={gIdx}>{goal}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {week.daily_breakdown && week.daily_breakdown.length > 0 && (
                                  <div className="mb-2">
                                    <strong className="text-xs text-gray-700 dark:text-gray-300">Daily Plan:</strong>
                                    <ul className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                                      {(week.daily_breakdown || []).slice(0, 7).map((day, dIdx) => (
                                        <li key={dIdx}>• {day}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {week.deliverables && week.deliverables.length > 0 && (
                                  <div>
                                    <strong className="text-xs text-green-700 dark:text-green-300">Deliverables:</strong>
                                    <ul className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                                      {(week.deliverables || []).slice(0, 5).map((del, delIdx) => (
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
                    {(learningPlan.learning_resources || []).slice(0, 6).map((resource, index) => (
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
                    {(learningPlan.project_ideas || []).slice(0, 4).map((project, index) => (
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
                              {(project.technologies || []).slice(0, 6).map((tech, techIdx) => (
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