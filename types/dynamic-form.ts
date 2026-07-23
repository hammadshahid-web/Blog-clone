// types/dynamic-form.ts
import { RegisterOptions } from 'react-hook-form';

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'password' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'array' 
  | 'group';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface DynamicFieldConfig {
  name: string; // Key in form data (e.g., 'author.name' or 'tags')
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
  options?: SelectOption[]; // For 'select' fields
  rules?: RegisterOptions; // Validation rules
  
  // 🌟 Conditional Rendering Condition
  dependsOn?: {
    field: string; // The field name to watch (e.g., 'hasCoAuthor')
    value: any;    // Expected value to trigger visibility
  };

  // 🌟 Dynamic Array Config (if type === 'array')
  arrayConfig?: {
    itemLabel?: string;
    fields: DynamicFieldConfig[]; // Fields repeated in each array item
  };

  // 🌟 Nested Group Config (if type === 'group')
  groupFields?: DynamicFieldConfig[];
}