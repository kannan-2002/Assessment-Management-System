import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssessment } from '../contexts/AssessmentContext';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Calendar, 
  User, 
  BarChart3,
  FileText,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const AssessmentResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAssessmentResponse, getAssessmentType } = useAssessment();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  const response = getAssessmentResponse(id || '');
  const assessmentType = response ? getAssessmentType(response.assessmentTypeId) : null;

  if (!response || !assessmentType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Assessment not found</h2>
          <p className="text-slate-600 mb-4">The assessment results you're looking for don't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getFieldDisplayValue = (field: any, value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'Not provided';
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'None selected';
    }

    if (field.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }

    return String(value);
  };

  const generateInsights = () => {
    const insights = [];
    
    if (response.score) {
      if (response.score >= 90) {
        insights.push({
          type: 'success',
          title: 'Excellent Completion',
          description: 'You provided comprehensive information across all assessment areas.'
        });
      } else if (response.score >= 70) {
        insights.push({
          type: 'good',
          title: 'Good Completion',
          description: 'Most assessment areas were completed thoroughly.'
        });
      } else {
        insights.push({
          type: 'warning',
          title: 'Partial Completion',
          description: 'Consider completing remaining fields for a more comprehensive assessment.'
        });
      }
    }

    // Add specific insights based on assessment type
    if (assessmentType.id === 'as_hr_02') {
      const bmi = calculateBMI(response.responses.height, response.responses.weight);
      if (bmi) {
        insights.push({
          type: 'info',
          title: `BMI: ${bmi.toFixed(1)}`,
          description: getBMICategory(bmi)
        });
      }
    }

    if (assessmentType.id === 'as_card_01') {
      const systolic = response.responses.blood_pressure_systolic;
      const diastolic = response.responses.blood_pressure_diastolic;
      if (systolic && diastolic) {
        const category = getBloodPressureCategory(systolic, diastolic);
        insights.push({
          type: category.type,
          title: `Blood Pressure: ${systolic}/${diastolic} mmHg`,
          description: category.description
        });
      }
    }

    return insights;
  };

  const calculateBMI = (height: number, weight: number) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getBloodPressureCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) {
      return { type: 'success', description: 'Normal blood pressure' };
    }
    if (systolic < 130 && diastolic < 80) {
      return { type: 'warning', description: 'Elevated blood pressure' };
    }
    if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) {
      return { type: 'warning', description: 'Stage 1 Hypertension' };
    }
    return { type: 'error', description: 'Stage 2 Hypertension - Consult a physician' };
  };

  const insights = generateInsights();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Assessment Results</h1>
              <p className="text-slate-600">{assessmentType.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Completion Score</p>
                <p className="text-xl font-bold text-slate-800">{response.score || 0}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Fields Completed</p>
                <p className="text-xl font-bold text-slate-800">
                  {Object.values(response.responses).filter(v => v !== null && v !== '' && v !== undefined).length}
                  /{assessmentType.fields.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Completed On</p>
                <p className="text-sm font-semibold text-slate-800">
                  {new Date(response.completedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Assessment ID</p>
                <p className="text-xs font-mono text-slate-800">{response.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detailed Results */}
        <div className="lg:col-span-2">
          <div ref={printRef} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Detailed Results</span>
            </h2>

            <div className="space-y-6">
              {assessmentType.fields.map((field) => {
                const fieldValue = response.responses[field.id];
                const displayValue = getFieldDisplayValue(field, fieldValue);
                
                return (
                  <div key={field.id} className="border-b border-slate-100 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-800 mb-1">{field.label}</h3>
                        <p className="text-slate-600">
                          {displayValue}
                        </p>
                        {field.required && !fieldValue && (
                          <span className="inline-flex items-center space-x-1 text-xs text-amber-600 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>Required field not completed</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono ml-4">
                        {field.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Insights and Analysis */}
        <div className="space-y-6">
          {/* Score Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Assessment Score</span>
            </h3>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
                <span className="text-2xl font-bold text-white">{response.score || 0}%</span>
              </div>
              <p className="text-sm text-slate-600">
                Completion Rate
              </p>
            </div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Insights & Analysis</h3>
              
              <div className="space-y-4">
                {insights.map((insight, index) => {
                  const bgColors = {
                    success: 'bg-green-50 border-green-200',
                    good: 'bg-blue-50 border-blue-200',
                    warning: 'bg-amber-50 border-amber-200',
                    error: 'bg-red-50 border-red-200',
                    info: 'bg-purple-50 border-purple-200'
                  };

                  const textColors = {
                    success: 'text-green-800',
                    good: 'text-blue-800',
                    warning: 'text-amber-800',
                    error: 'text-red-800',
                    info: 'text-purple-800'
                  };

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${bgColors[insight.type as keyof typeof bgColors]}`}
                    >
                      <h4 className={`font-medium mb-1 ${textColors[insight.type as keyof typeof textColors]}`}>
                        {insight.title}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {insight.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Assessment Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Assessment Type:</span>
                <span className="font-medium text-slate-800">{assessmentType.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Category:</span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {assessmentType.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Completed:</span>
                <span className="font-medium text-slate-800">
                  {new Date(response.completedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Response ID:</span>
                <span className="font-mono text-xs text-slate-600">{response.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResultsPage;