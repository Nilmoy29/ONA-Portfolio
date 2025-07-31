"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/components/admin/project-form'

// Temporary debug component
function DebugProjectForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleDebugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    console.log('🐛 DEBUG: Form submission started');

    try {
      const testData = {
        title: 'Debug Test Project',
        slug: 'debug-test-project',
        description: 'Testing from debug form'
      };

      console.log('🐛 DEBUG: Sending data:', testData);

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('🐛 DEBUG: Response received:', response.status);
      
      const data = await response.json();
      console.log('🐛 DEBUG: Response data:', data);

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/projects');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('🐛 DEBUG: Error caught:', error);
      setError('Network error occurred');
    } finally {
      console.log('🐛 DEBUG: Setting loading to false');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-zinc-900">Debug Project Creation</h2>
        <p className="text-zinc-600">Simplified form for debugging</p>
      </div>

      <form onSubmit={handleDebugSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">Project created successfully! Redirecting...</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Debug Project'}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t">
        <h3 className="text-lg font-medium mb-4">Regular Form:</h3>
        <ProjectForm />
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  // Temporarily use debug form
  return <DebugProjectForm />
}