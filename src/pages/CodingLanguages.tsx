import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UploadCloud, Eye, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/pages/Services/api/api';

interface Language {
  id: string;
  name: string;
  description: string;
}

export default function CodingLanguages() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getAuthToken = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) return null;
    return `Bearer ${token.replace(/^Bearer\s+/i, '')}`;
  };

  const normalize = (item: any): Language => ({
    id: item.id || item.language_id || String(item.id),
    name: item.name || item.language_name || '',
    description: item.description || item.desc || '',
  });

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      const base = API_BASE_URL || 'http://192.168.0.100:8000';
      const res = await fetch(`${base}/languages/`, { headers: { Authorization: token } });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];
        setLanguages(items.map((it: any) => ({ id: String(it.lang_id ?? it.id ?? it.language_id ?? it.languageId), name: it.lang_name ?? it.name ?? it.language_name, description: it.description ?? it.desc })));
      } else {
        toast.error('Failed to load languages');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading languages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLanguages(); }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return languages;
    const q = query.toLowerCase();
    return languages.filter(l => l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q));
  }, [languages, query]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this language?')) return;
    try {
      const token = getAuthToken();
      if (!token) { toast.error('Authentication required'); return; }
      const base = API_BASE_URL || 'http://192.168.0.100:8000';
      const res = await fetch(`${base}/languages/${id}`, { method: 'DELETE', headers: { Authorization: token } });
      if (res.ok) {
        toast.success('Deleted');
        setLanguages(prev => prev.filter(l => l.id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting');
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        toast.error('CSV must have header and at least one row');
        return;
      }

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const langNameIdx = headers.findIndex(h => h.includes('lang_name') || h.includes('name'));
      const descIdx = headers.findIndex(h => h.includes('description') || h.includes('desc'));

      if (langNameIdx === -1) {
        toast.error('CSV must have lang_name or name column');
        return;
      }

      const token = getAuthToken();
      if (!token) { toast.error('Auth required'); return; }
      const base = API_BASE_URL || 'http://192.168.0.100:8000';

      let created = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (!cols[langNameIdx]) continue;

        const res = await fetch(`${base}/languages/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token },
          body: JSON.stringify({ lang_name: cols[langNameIdx], description: descIdx >= 0 ? cols[descIdx] : '' }),
        });
        if (res.ok) created++;
      }

      toast.success(`${created} languages created`);
      fetchLanguages();
    } catch (err) {
      console.error(err);
      toast.error('Error uploading file');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="bg-[#f5f3ff] min-h-screen p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coding Languages</h1>
          <p className="text-sm text-gray-600 mt-1">Manage programming languages available for examination questions</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
            <UploadCloud size={16} /> {uploading ? 'Uploading...' : 'Bulk Upload'}
            <input type="file" accept=".csv" onChange={handleBulkUpload} disabled={uploading} hidden />
          </label>
          <button onClick={() => navigate('/create-language')} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg flex items-center gap-2">
            <Plus size={16} /> Add Language
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <input
            type="search"
            placeholder="Search languages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-1/3 pl-4 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="text-sm text-gray-500">Total Language : <span className="font-semibold text-purple-700">{languages.length}</span></div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading languages...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">LANGUAGE ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">LANGUAGE NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">DESCRIPTION</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((lang) => (
                  <tr key={lang.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-purple-700 font-medium">{lang.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lang.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lang.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <button onClick={() => navigate(`/view-language/${lang.id}`)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View"><Eye size={16} /></button>
                        <button onClick={() => navigate(`/edit-language/${lang.id}`)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(lang.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
