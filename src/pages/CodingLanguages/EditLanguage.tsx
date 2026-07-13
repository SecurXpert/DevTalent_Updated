import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/pages/Services/api/api';

export default function EditLanguage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getAuthToken = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) return null;
    return `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const token = getAuthToken();
        if (!token) {
          toast.error('Authentication required');
          navigate('/adminlogin');
          return;
        }
        const base = API_BASE_URL;
        const res = await fetch(`${base}/languages/${id}`, { headers: { Authorization: token } });
        if (res.ok) {
          const data = await res.json();
          setName(data.lang_name ?? data.name ?? '');
          setDescription(data.description ?? data.desc ?? '');
        } else {
          toast.error('Failed to load language');
          navigate('/coding-languages');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading language');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name required');
      return;
    }
    setSaving(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        navigate('/adminlogin');
        return;
      }
      const base = API_BASE_URL;
      const res = await fetch(`${base}/languages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ lang_name: name.trim(), description: description.trim() }),
      });
      if (res.ok) {
        toast.success('Language updated');
        navigate('/coding-languages');
      } else {
        const text = await res.text();
        toast.error(`Failed: ${res.status} ${text}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating language');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this language?')) return;
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        navigate('/adminlogin');
        return;
      }
      const base = API_BASE_URL;
      const res = await fetch(`${base}/languages/${id}`, { method: 'DELETE', headers: { Authorization: token } });
      if (res.ok) {
        toast.success('Language deleted');
        navigate('/coding-languages');
      } else {
        const text = await res.text();
        toast.error(`Failed: ${res.status} ${text}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-[#f5f3ff] min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/coding-languages')} className="p-2 bg-gray-100 rounded">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-semibold">Edit Language</h2>
            <p className="text-sm text-gray-500">Modify coding language details</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" rows={4} />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-purple-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
