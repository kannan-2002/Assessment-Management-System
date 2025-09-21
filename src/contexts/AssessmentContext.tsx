import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AssessmentField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'date';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface AssessmentType {
  id: string;
  title: string;
  description: string;
  fields: AssessmentField[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResponse {
  id: string;
  assessmentTypeId: string;
  userId: string;
  responses: Record<string, any>;
  completedAt: string;
  score?: number;
}

interface AssessmentContextType {
  assessmentTypes: AssessmentType[];
  assessmentResponses: AssessmentResponse[];
  createAssessmentType: (assessmentType: Omit<AssessmentType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAssessmentType: (id: string, updates: Partial<AssessmentType>) => void;
  deleteAssessmentType: (id: string) => void;
  submitAssessmentResponse: (response: Omit<AssessmentResponse, 'id' | 'completedAt'>) => string;
  getAssessmentType: (id: string) => AssessmentType | undefined;
  getAssessmentResponse: (id: string) => AssessmentResponse | undefined;
  getUserAssessments: (userId: string) => AssessmentResponse[];
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

const initialAssessmentTypes: AssessmentType[] = [
  {
    id: 'as_hr_02',
    title: 'Health & Fitness Assessment',
    description: 'Comprehensive health and fitness evaluation',
    category: 'Health',
    fields: [
      { id: 'age', label: 'Age', type: 'number', required: true, validation: { min: 1, max: 120 } },
      { id: 'gender', label: 'Gender', type: 'radio', required: true, options: ['Male', 'Female', 'Other'] },
      { id: 'height', label: 'Height (cm)', type: 'number', required: true, validation: { min: 50, max: 250 } },
      { id: 'weight', label: 'Weight (kg)', type: 'number', required: true, validation: { min: 20, max: 300 } },
      { id: 'activity_level', label: 'Activity Level', type: 'select', required: true, options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active'] },
      { id: 'medical_conditions', label: 'Medical Conditions', type: 'checkbox', required: false, options: ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'None'] },
      { id: 'fitness_goals', label: 'Fitness Goals', type: 'textarea', required: true },
      { id: 'exercise_frequency', label: 'Exercise Frequency (per week)', type: 'number', required: true, validation: { min: 0, max: 14 } }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'as_card_01',
    title: 'Cardiac Assessment',
    description: 'Cardiovascular health evaluation and risk assessment',
    category: 'Medical',
    fields: [
      { id: 'patient_id', label: 'Patient ID', type: 'text', required: true },
      { id: 'blood_pressure_systolic', label: 'Systolic BP (mmHg)', type: 'number', required: true, validation: { min: 70, max: 250 } },
      { id: 'blood_pressure_diastolic', label: 'Diastolic BP (mmHg)', type: 'number', required: true, validation: { min: 40, max: 150 } },
      { id: 'heart_rate', label: 'Heart Rate (bpm)', type: 'number', required: true, validation: { min: 30, max: 200 } },
      { id: 'cholesterol_total', label: 'Total Cholesterol (mg/dL)', type: 'number', required: true, validation: { min: 100, max: 400 } },
      { id: 'cholesterol_hdl', label: 'HDL Cholesterol (mg/dL)', type: 'number', required: true, validation: { min: 20, max: 100 } },
      { id: 'cholesterol_ldl', label: 'LDL Cholesterol (mg/dL)', type: 'number', required: true, validation: { min: 50, max: 300 } },
      { id: 'smoking_status', label: 'Smoking Status', type: 'select', required: true, options: ['Never', 'Former', 'Current'] },
      { id: 'family_history', label: 'Family History of Heart Disease', type: 'radio', required: true, options: ['Yes', 'No'] },
      { id: 'chest_pain', label: 'Chest Pain Symptoms', type: 'checkbox', required: false, options: ['At Rest', 'During Exercise', 'After Meals', 'None'] },
      { id: 'assessment_date', label: 'Assessment Date', type: 'date', required: true }
    ],
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
];

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>(initialAssessmentTypes);
  const [assessmentResponses, setAssessmentResponses] = useState<AssessmentResponse[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedTypes = localStorage.getItem('assessmentTypes');
    const savedResponses = localStorage.getItem('assessmentResponses');
    
    if (savedTypes) {
      setAssessmentTypes(JSON.parse(savedTypes));
    }
    
    if (savedResponses) {
      setAssessmentResponses(JSON.parse(savedResponses));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem('assessmentTypes', JSON.stringify(assessmentTypes));
  }, [assessmentTypes]);

  useEffect(() => {
    localStorage.setItem('assessmentResponses', JSON.stringify(assessmentResponses));
  }, [assessmentResponses]);

  const createAssessmentType = (assessmentType: Omit<AssessmentType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAssessmentType: AssessmentType = {
      ...assessmentType,
      id: `as_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setAssessmentTypes(prev => [...prev, newAssessmentType]);
  };

  const updateAssessmentType = (id: string, updates: Partial<AssessmentType>) => {
    setAssessmentTypes(prev => 
      prev.map(type => 
        type.id === id 
          ? { ...type, ...updates, updatedAt: new Date().toISOString() }
          : type
      )
    );
  };

  const deleteAssessmentType = (id: string) => {
    setAssessmentTypes(prev => prev.filter(type => type.id !== id));
    setAssessmentResponses(prev => prev.filter(response => response.assessmentTypeId !== id));
  };

  const submitAssessmentResponse = (response: Omit<AssessmentResponse, 'id' | 'completedAt'>): string => {
    const newResponse: AssessmentResponse = {
      ...response,
      id: `resp_${Date.now()}`,
      completedAt: new Date().toISOString()
    };
    
    setAssessmentResponses(prev => [...prev, newResponse]);
    return newResponse.id;
  };

  const getAssessmentType = (id: string): AssessmentType | undefined => {
    return assessmentTypes.find(type => type.id === id);
  };

  const getAssessmentResponse = (id: string): AssessmentResponse | undefined => {
    return assessmentResponses.find(response => response.id === id);
  };

  const getUserAssessments = (userId: string): AssessmentResponse[] => {
    return assessmentResponses.filter(response => response.userId === userId);
  };

  return (
    <AssessmentContext.Provider value={{
      assessmentTypes,
      assessmentResponses,
      createAssessmentType,
      updateAssessmentType,
      deleteAssessmentType,
      submitAssessmentResponse,
      getAssessmentType,
      getAssessmentResponse,
      getUserAssessments
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};