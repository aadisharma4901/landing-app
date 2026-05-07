'use client';

import { useState } from 'react';

interface ProfileSettingsFormProps {
  initialFirstName: string | null;
  initialLastName: string | null;
  initialEmail: string | null;
  onSuccess?: () => void;
}

export default function ProfileSettingsForm({
  initialFirstName,
  initialLastName,
  initialEmail,
  onSuccess,
}: ProfileSettingsFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialFirstName || '',
    lastName: initialLastName || '',
    email: initialEmail || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent transition-all"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent transition-all"
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 cursor-not-allowed"
            placeholder="Email"
          />
          <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Email cannot be changed. Contact support to update your email.
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-interactive px-8 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
