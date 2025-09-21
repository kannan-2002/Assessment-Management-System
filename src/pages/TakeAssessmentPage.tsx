import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAssessment } from '../contexts/AssessmentContext';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import DynamicFormField from '../components/DynamicFormField';

const TakeAssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getAssessmentType, submitAssessmentResponse } = useAssessment();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(getAssessmentType(id || ''));
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!assessment) {
      navigate('/assessment-types');
    }
  }, [assessment, navigate]);

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const validateField = (field: any, value: any): string | null => {
    if (field.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }

    if (field.type === 'number' && value !== '' && value != null) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return 'Please enter a valid number';
      }
      if (field.validation?.min != null && numValue < field.validation.min) {
        return `Value must be at least ${field.validation.min}`;
      }
      if (field.validation?.max != null && numValue > field.validation.max) {
        return `Value must be at most ${field.validation.max}`;
      }
    }

    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all fields
      const newErrors: Record<string, string> = {};
      
      assessment.fields.forEach(field => {
        const error = validateField(field, responses[field.id]);
        if (error) {
          newErrors[field.id] = error;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // Calculate a simple score based on completion
      const completedFields = assessment.fields.filter(field => {
        const value = responses[field.id];
        return value !== undefined && value !== '' && value !== null;
      });
      const score = Math.round((completedFields.length / assessment.fields.length) * 100);

      // Submit the assessment
      const responseId = submitAssessmentResponse({
        assessmentTypeId: assessment.id,
        userId: user?.id || '',
        responses,
        score
      });

      navigate(`/results/${responseId}`);
    } catch (error) {
      alert('Failed to submit assessment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const completedFields = assessment.fields.filter(field => {
    const value = responses[field.id];
    return value !== undefined && value !== '' && value !== null;
  }).length;

  const progress = (completedFields / assessment.fields.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/assessment-types')}
            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{assessment.title}</h1>
            <p className="text-slate-600">{assessment.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm text-slate-600">
              {completedFields} of {assessment.fields.length} completed
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Assessment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="space-y-6">
            {assessment.fields.map((field) => (
              <DynamicFormField
                key={field.id}
                field={field}
                value={responses[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
                error={errors[field.id]}
              />
            ))}
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {progress === 100 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">Ready to submit</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <span className="text-amber-600 font-medium">
                    {assessment.fields.length - completedFields} field(s) remaining
                  </span>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>{isSubmitting ? 'Submitting...' : 'Submit Assessment'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TakeAssessmentPage;