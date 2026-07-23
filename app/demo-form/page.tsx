// app/demo-form/page.tsx
'use client';

import { DynamicForm } from '@/components/ui/DynamicForm';
import { DynamicFieldConfig } from '@/types/dynamic-form';

const formSchema: DynamicFieldConfig[] = [
  // 1. Basic Fields
  {
    name: 'title',
    label: 'Article Title',
    type: 'text',
    placeholder: 'Enter title...',
    rules: { required: 'Title is required' },
  },

  // 2. Nested Group Object
  {
    name: 'author',
    label: 'Author Details',
    type: 'group',
    groupFields: [
      {
        name: 'name',
        label: 'Author Name',
        type: 'text',
        rules: { required: 'Author name is required' },
      },
      {
        name: 'bio',
        label: 'Author Bio',
        type: 'textarea',
      },
    ],
  },

  // 3. Conditional Trigger Field
  {
    name: 'hasCoAuthor',
    label: 'Include Co-Author?',
    type: 'checkbox',
  },

  // 4. Conditional Field (Only shows when hasCoAuthor === true)
  {
    name: 'coAuthorName',
    label: 'Co-Author Name',
    type: 'text',
    placeholder: 'Enter co-author name',
    dependsOn: {
      field: 'hasCoAuthor',
      value: true,
    },
  },

  // 5. Dynamic Array Field (Add multiple resource links)
  {
    name: 'references',
    label: 'Article References & Links',
    type: 'array',
    arrayConfig: {
      itemLabel: 'Reference Link',
      fields: [
        {
          name: 'label',
          label: 'Link Title',
          type: 'text',
          placeholder: 'e.g. Next.js Docs',
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          placeholder: 'https://...',
        },
      ],
    },
  },
];

export default function DemoFormPage() {
  const handleFormSubmit = (data: any) => {
    console.log('Processed Form Output:', JSON.stringify(data, null, 2));
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold dark:text-white mb-6">
        Dynamic Form Builder
      </h2>
      <DynamicForm config={formSchema} onSubmit={handleFormSubmit} />
    </div>
  );
}