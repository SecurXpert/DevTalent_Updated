import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/pages/Services/api/api';

export default function CreateLanguage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAuthToken = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) return null;
    return `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a language name');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        navigate('/adminlogin');
        return;
      }
      const payload = { lang_name: name.trim(), description: description.trim() };
      const base = API_BASE_URL;
      const res = await fetch(`${base}/languages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        toast.success('Language created');
        navigate('/coding-languages');
      } else {
        const json = await res.json().catch(() => null);
        const msg = json?.detail || json?.message || JSON.stringify(json) || (await res.text());
        toast.error(`Failed: ${res.status} ${msg}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error creating language');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f5f3ff] min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/coding-languages')} className="p-2 bg-gray-100 rounded">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-semibold">Add Language</h2>
            <p className="text-sm text-gray-500">Create a new coding language</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" rows={4} />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/coding-languages')} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-purple-600 text-white rounded">{isSubmitting ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
