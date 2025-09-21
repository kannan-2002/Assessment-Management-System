import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAssessment, AssessmentField } from '../contexts/AssessmentContext';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Type,
  Hash,
  List,
  CheckSquare,
  Calendar,
  MessageSquare,
  Settings
} from 'lucide-react';

const CreateAssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const { createAssessmentType } = useAssessment();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  
  const [fields, setFields] = useState<AssessmentField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect non-admin users
  if (user?.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: Type },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'select', label: 'Dropdown', icon: List },
    { value: 'radio', label: 'Radio Buttons', icon: CheckSquare },
    { value: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
    { value: 'textarea', label: 'Text Area', icon: MessageSquare },
    { value: 'date', label: 'Date Picker', icon: Calendar }
  ];

  const addField = () => {
    const newField: AssessmentField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      options: [],
      validation: {}
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updates: Partial<AssessmentField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      if (fields.length === 0) {
        alert('Please add at least one field to the assessment');
        return;
      }

      createAssessmentType({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        fields: fields.filter(field => field.label.trim() !== '')
      });

      navigate('/assessment-types');
    } catch (error) {
      alert('Failed to create assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Create Assessment Type</h1>
            <p className="text-slate-600">Design a new assessment with custom fields and validation</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Basic Information</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Assessment Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Health & Fitness Assessment"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Health, Education, Skill"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Provide a detailed description of what this assessment measures..."
                required
              />
            </div>
          </div>
        </div>

        {/* Fields Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Assessment Fields</span>
            </h2>
            <button
              type="button"
              onClick={addField}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Field</span>
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No fields added yet</p>
              <button
                type="button"
                onClick={addField}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Field</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field, index) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  index={index}
                  onUpdate={(updates) => updateField(index, updates)}
                  onRemove={() => removeField(index)}
                  fieldTypes={fieldTypes}
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/assessment-types')}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || fields.length === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'Creating...' : 'Create Assessment'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

interface FieldEditorProps {
  field: AssessmentField;
  index: number;
  onUpdate: (updates: Partial<AssessmentField>) => void;
  onRemove: () => void;
  fieldTypes: Array<{ value: string; label: string; icon: React.ComponentType<any> }>;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, index, onUpdate, onRemove, fieldTypes }) => {
  const needsOptions = ['select', 'radio', 'checkbox'].includes(field.type);
  
  const addOption = () => {
    const options = [...(field.options || []), ''];
    onUpdate({ options });
  };

  const updateOption = (optionIndex: number, value: string) => {
    const options = [...(field.options || [])];
    options[optionIndex] = value;
    onUpdate({ options });
  };

  const removeOption = (optionIndex: number) => {
    const options = (field.options || []).filter((_, i) => i !== optionIndex);
    onUpdate({ options });
  };

  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-600">Field #{index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-slate-400 hover:text-red-600 transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Field Label *
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter field label"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Field Type *
          </label>
          <select
            value={field.type}
            onChange={(e) => onUpdate({ type: e.target.value as AssessmentField['type'] })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {fieldTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Required field</span>
        </label>
      </div>

      {/* Validation Rules */}
      {(field.type === 'number') && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Minimum Value
            </label>
            <input
              type="number"
              value={field.validation?.min || ''}
              onChange={(e) => onUpdate({ 
                validation: { 
                  ...field.validation, 
                  min: e.target.value ? Number(e.target.value) : undefined 
                }
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Min value"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Maximum Value
            </label>
            <input
              type="number"
              value={field.validation?.max || ''}
              onChange={(e) => onUpdate({ 
                validation: { 
                  ...field.validation, 
                  max: e.target.value ? Number(e.target.value) : undefined 
                }
              })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Max value"
            />
          </div>
        </div>
      )}

      {/* Options for select, radio, checkbox */}
      {needsOptions && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700">
              Options *
            </label>
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              + Add Option
            </button>
          </div>
          
          <div className="space-y-2">
            {(field.options || []).map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(optionIndex, e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Option ${optionIndex + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeOption(optionIndex)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          {(field.options || []).length === 0 && (
            <button
              type="button"
              onClick={addOption}
              className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
            >
              Click to add your first option
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateAssessmentPage;