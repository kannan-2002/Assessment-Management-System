import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAssessment } from '../contexts/AssessmentContext';
import { 
  FileText, 
  PlusCircle, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Play,
  Users,
  Calendar,
  Tag
} from 'lucide-react';

const AssessmentTypesPage: React.FC = () => {
  const { user } = useAuth();
  const { assessmentTypes, deleteAssessmentType, assessmentResponses } = useAssessment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(assessmentTypes.map(type => type.category)))];

  const filteredAssessments = assessmentTypes.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || assessment.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAssessmentStats = (assessmentId: string) => {
    const responses = assessmentResponses.filter(response => response.assessmentTypeId === assessmentId);
    return {
      totalResponses: responses.length,
      avgScore: responses.length > 0 
        ? Math.round(responses.reduce((sum, r) => sum + (r.score || 0), 0) / responses.length)
        : 0
    };
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this assessment type?')) {
      deleteAssessmentType(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Assessment Types</h1>
            <p className="text-slate-600">Manage and organize your assessment configurations</p>
          </div>
          
          {user?.role === 'admin' && (
            <Link
              to="/create-assessment"
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Assessment</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => {
          const stats = getAssessmentStats(assessment.id);
          
          return (
            <div
              key={assessment.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {assessment.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {assessment.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {assessment.description}
                    </p>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Assessment"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(assessment.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Assessment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-slate-500 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Responses</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">{stats.totalResponses}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-slate-500 mb-1">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs">Fields</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">{assessment.fields.length}</p>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/take-assessment/${assessment.id}`}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                >
                  <Play className="h-4 w-4" />
                  <span>Take Assessment</span>
                </Link>

                {/* Metadata */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Created {new Date(assessment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="font-mono text-slate-400">{assessment.id}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center p-4 bg-slate-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No assessments found</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first assessment to get started'
            }
          </p>
          {user?.role === 'admin' && (
            <Link
              to="/create-assessment"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Assessment</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentTypesPage;