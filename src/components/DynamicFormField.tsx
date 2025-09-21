import React from 'react';
import { AssessmentField } from '../contexts/AssessmentContext';
import { AlertCircle } from 'lucide-react';

interface DynamicFormFieldProps {
  field: AssessmentField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({ field, value, onChange, error }) => {
  const inputClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
    error 
      ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
      : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  }`;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
            className={inputClasses}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className={inputClasses}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-slate-700 group-hover:text-slate-800 transition-colors duration-200">
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    if (e.target.checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <span className="text-slate-700 group-hover:text-slate-800 transition-colors duration-200">
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderField()}
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Field hints */}
      {field.validation?.min != null && field.validation?.max != null && field.type === 'number' && (
        <p className="text-xs text-slate-500">
          Value should be between {field.validation.min} and {field.validation.max}
        </p>
      )}
    </div>
  );
};

export default DynamicFormField;