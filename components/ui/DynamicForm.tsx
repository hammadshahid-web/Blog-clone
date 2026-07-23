'use client';

import React from 'react';
import { useForm, FormProvider, useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { DynamicFieldConfig } from '@/types/dynamic-form';

interface DynamicFormProps {
  config: DynamicFieldConfig[];
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  submitText?: string;
  isSubmitting?: boolean;
}

// 1. Dynamic Field Helper Component using useFormContext
function DynamicField({ field }: { field: DynamicFieldConfig }) {
  const { register, control, formState: { errors } } = useFormContext();

  const watchedValue = useWatch({
    control,
    name: field.dependsOn?.field || '',
  });

  if (field.dependsOn && watchedValue !== field.dependsOn.value) {
    return null;
  }

  // Safe nested error retrieval
  const getNestedError = (path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], errors as any)?.message;
  };

  const errorMessage = getNestedError(field.name);

  return (
    <div className="space-y-1.5 w-full">
      {field.type !== 'checkbox' && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {field.label}
        </label>
      )}

      {/* Basic Inputs */}
      {['text', 'number', 'email', 'password'].includes(field.type) && (
        <input
          type={field.type}
          placeholder={field.placeholder}
          {...register(field.name, field.rules)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {/* Textarea */}
      {field.type === 'textarea' && (
        <textarea
          rows={4}
          placeholder={field.placeholder}
          {...register(field.name, field.rules)}
          className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {/* Checkbox */}
      {field.type === 'checkbox' && (
        <label className="flex items-center gap-3 cursor-pointer py-1">
          <input
            type="checkbox"
            {...register(field.name, field.rules)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-800 bg-slate-900"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {field.label}
          </span>
        </label>
      )}

      {/* Group Object */}
      {field.type === 'group' && field.groupFields && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
          {field.groupFields.map((subField) => (
            <DynamicField
              key={subField.name}
              field={{ ...subField, name: `${field.name}.${subField.name}` }}
            />
          ))}
        </div>
      )}

      {/* Dynamic Array */}
      {field.type === 'array' && field.arrayConfig && (
        <DynamicArrayField field={field} />
      )}

      {errorMessage && (
        <p className="text-xs font-semibold text-red-500 dark:text-red-400 mt-1">
          ⚠️ {String(errorMessage)}
        </p>
      )}
    </div>
  );
}

// 2. Array Field Component
function DynamicArrayField({ field }: { field: DynamicFieldConfig }) {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: field.name,
  });

  return (
    <div className="space-y-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {field.label}
        </h4>
        <button
          type="button"
          onClick={() => append({})}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add {field.arrayConfig?.itemLabel || 'Item'}
        </button>
      </div>

      {fields.map((item, index) => (
        <div
          key={item.id}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 relative"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
            <span className="text-xs font-semibold text-slate-500">
              #{index + 1} {field.arrayConfig?.itemLabel || 'Item'}
            </span>
            <div className="flex items-center gap-1">
              {index > 0 && (
                <button type="button" onClick={() => move(index, index - 1)} className="p-1 rounded text-slate-400 hover:text-slate-200">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              )}
              {index < fields.length - 1 && (
                <button type="button" onClick={() => move(index, index + 1)} className="p-1 rounded text-slate-400 hover:text-slate-200">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}
              <button type="button" onClick={() => remove(index)} className="p-1 rounded text-slate-400 hover:text-red-500 transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field.arrayConfig?.fields.map((subField) => (
              <DynamicField
                key={subField.name}
                field={{
                  ...subField,
                  name: `${field.name}.${index}.${subField.name}`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 3. Main DynamicForm Component
export function DynamicForm({
  config,
  onSubmit,
  defaultValues = {},
  submitText = 'Submit Form',
  isSubmitting = false,
}: DynamicFormProps) {
  // 💡 Auto-generate defaultValues for array fields to prevent undefined state
  const computedDefaults = React.useMemo(() => {
    const initial: Record<string, any> = { ...defaultValues };
    config.forEach((field) => {
      if (field.type === 'array' && !initial[field.name]) {
        initial[field.name] = []; // Ensure arrays always initialize as []
      }
    });
    return initial;
  }, [config, defaultValues]);

  const methods = useForm({
    defaultValues: computedDefaults,
    mode: 'onSubmit',
  });

  const handleFormSubmit = (data: any) => {
    console.log('🚀 SUCCESS! Form Data Submitted:', data);
    onSubmit(data);
  };

  const handleFormError = (errors: any) => {
    console.warn('❌ FORM BLOCKED! Validation Errors:', errors);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleFormSubmit, handleFormError)}
        className="space-y-6"
      >
        {config.map((field) => (
          <DynamicField key={field.name} field={field} />
        ))}

        {/* Global Error Notice */}
        {Object.keys(methods.formState.errors).length > 0 && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-semibold">
            ⚠️ Form submit nahi ho saka! Missing/invalid fields check karein.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Processing...' : submitText}
        </button>
      </form>
    </FormProvider>
  );

}