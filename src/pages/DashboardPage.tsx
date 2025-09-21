import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAssessment } from '../contexts/AssessmentContext';
import { 
  FileText, 
  PlusCircle, 
  BarChart3, 
  Users, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { assessmentTypes, assessmentResponses, getUserAssessments } = useAssessment();
  
  const userAssessments = getUserAssessments(user?.id || '');
  const totalAssessments = assessmentTypes.length;
  const completedAssessments = userAssessments.length;
  const pendingAssessments = totalAssessments - completedAssessments;

  const recentAssessments = userAssessments
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Assessment Types',
      value: totalAssessments,
      icon: FileText,
      color: 'blue',
      description: 'Available assessments'
    },
    {
      label: 'Completed',
      value: completedAssessments,
      icon: CheckCircle,
      color: 'green',
      description: 'Assessments completed'
    },
    {
      label: 'Pending',
      value: pendingAssessments,
      icon: Clock,
      color: 'amber',
      description: 'Awaiting completion'
    },
    {
      label: 'Success Rate',
      value: totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0,
      icon: TrendingUp,
      color: 'indigo',
      description: 'Completion percentage',
      suffix: '%'
    }
  ];

  const getStatColors = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
      green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
      amber: 'from-amber-500 to-amber-600 text-amber-600 bg-amber-50',
      indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-slate-600">
          Here's an overview of your assessment activities and system status.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getStatColors(stat.color);
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colors.split(' ')[0]} ${colors.split(' ')[1]}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}{stat.suffix || ''}
                  </p>
                  <p className={`text-sm font-medium ${colors.split(' ')[2]}`}>
                    {stat.label}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500">{stat.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/assessment-types"
              className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
            >
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Browse Assessments</p>
                <p className="text-sm text-slate-500">View available assessment types</p>
              </div>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/create-assessment"
                className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-green-200 transition-all duration-200 group"
              >
                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
                  <PlusCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Create Assessment</p>
                  <p className="text-sm text-slate-500">Design new assessment types</p>
                </div>
              </Link>
            )}

            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Analytics</p>
                <p className="text-sm text-slate-500">View performance insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Recent Assessment Activity</h2>
            <Link
              to="/assessment-types"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              View All
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {recentAssessments.length > 0 ? (
              <div className="divide-y divide-slate-200">
                {recentAssessments.map((assessment) => {
                  const assessmentType = assessmentTypes.find(type => type.id === assessment.assessmentTypeId);
                  return (
                    <div key={assessment.id} className="p-4 hover:bg-slate-50 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-800 mb-1">
                            {assessmentType?.title || 'Unknown Assessment'}
                          </h3>
                          <p className="text-sm text-slate-600 mb-2">
                            {assessmentType?.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(assessment.completedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(assessment.completedAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                          <Link
                            to={`/results/${assessment.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                          >
                            View Results
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-slate-100 rounded-full mb-4">
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No assessments yet</h3>
                <p className="text-slate-600 mb-4">Start by taking your first assessment</p>
                <Link
                  to="/assessment-types"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FileText className="h-4 w-4" />
                  <span>Browse Assessments</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;