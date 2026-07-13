import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/pages/Services/api/api';

export default function ViewLanguage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) return null;
    return `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
  };

  useEffect(() => {
    const fetchLang = async () => {
      if (!id) return;
      try {
        const token = getAuthToken();
        if (!token) { toast.error('Authentication required'); navigate('/adminlogin'); return; }
        const base = API_BASE_URL;
        const res = await fetch(`${base}/languages/${id}`, { headers: { Authorization: token } });
        if (res.ok) {
          const data = await res.json();
          setLanguage(data);
        } else {
          toast.error('Failed to load');
          navigate('/coding-languages');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading');
      } finally { setLoading(false); }
    };
    fetchLang();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this language?')) return;
    try {
      const token = getAuthToken();
      if (!token) { toast.error('Authentication required'); navigate('/adminlogin'); return; }
      const base = API_BASE_URL;
      const res = await fetch(`${base}/languages/${id}`, { method: 'DELETE', headers: { Authorization: token } });
      if (res.ok) { toast.success('Deleted'); navigate('/coding-languages'); }
      else { toast.error('Failed to delete'); }
    } catch (err) { console.error(err); toast.error('Error deleting'); }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!language) return null;

  return (
    <div className="bg-[#f5f3ff] min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/coding-languages')} className="p-2 bg-gray-100 rounded"><ArrowLeft size={18} /></button>
            <div>
              <h2 className="text-xl font-semibold">Language Details</h2>
              <p className="text-sm text-gray-500">Read-only view of language information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/edit-language/${id}`)} className="px-4 py-2 bg-purple-100 text-purple-700 rounded"> <Edit2 size={14} /> Edit</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded"> <Trash2 size={14} /> Delete</button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center"> </div>
            <div>
              <div className="text-sm opacity-80">Coding Language</div>
              <div className="text-2xl font-bold">{language.lang_name ?? language.name}</div>
              <div className="mt-2 text-xs bg-white/20 inline-block px-3 py-1 rounded">#{language.lang_id ?? language.id}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="mb-4 text-sm text-purple-600 font-semibold">LANGUAGE ID</div>
          <div className="p-4 bg-gray-50 rounded">{language.lang_id ?? language.id}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="mb-4 text-sm text-purple-600 font-semibold">LANGUAGE NAME</div>
          <div className="p-4 bg-gray-50 rounded">{language.lang_name ?? language.name}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="mb-4 text-sm text-purple-600 font-semibold">DESCRIPTION</div>
          <div className="p-4 bg-gray-50 rounded">{language.description ?? language.desc}</div>
        </div>
      </div>
    </div>
  );
}
