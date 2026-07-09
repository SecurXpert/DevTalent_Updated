import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronDown, Search, Eye, Edit2, Bookmark, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/pages/Services/api/api';

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  modules: string[];
  createdDate: string;
  status: 'Active' | 'Inactive';
}

const getRoleColor = (role: string) => {
  const roles: Record<string, { bg: string; text: string }> = {
    admin: { bg: 'bg-blue-100', text: 'text-blue-700' },
    super_admin: { bg: 'bg-purple-100', text: 'text-purple-700' },
    exam_manager: { bg: 'bg-green-100', text: 'text-green-700' },
    content_manager: { bg: 'bg-orange-100', text: 'text-orange-700' },
    student_manager: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  };
  return roles[role] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-amber-500', 'bg-lime-500'
  ];
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length];
};

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

export default function AdminManagement() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All Roles');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getAuthToken = () => {
    const possibleKeys = ['adminToken', 'token', 'access_token', 'auth_token', 'jwt', 'userToken'];
    let token = null;
    let source = '';

    for (const key of possibleKeys) {
      token = localStorage.getItem(key);
      if (token) {
        source = `localStorage.${key}`;
        break;
      }
      token = sessionStorage.getItem(key);
      if (token) {
        source = `sessionStorage.${key}`;
        break;
      }
    }

    if (!token) {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (possibleKeys.some(key => name.toLowerCase().includes(key.toLowerCase()))) {
          token = decodeURIComponent(value);
          source = `cookie.${name}`;
          break;
        }
      }
    }

    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      return `Bearer ${cleanToken}`;
    }

    return null;
  };

  const normalizeAdmin = (item: any): Admin => ({
    id: item.id,
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    role: item.role || 'admin',
    modules: Array.isArray(item.modules) ? item.modules : [],
    createdDate: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : '—',
    status: item.is_active ? 'Active' : 'Inactive',
  });

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication token not found. Please login first.');
        navigate('/login');
        return;
      }

      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      if (filterRole !== 'All Roles') params.set('role', filterRole.toLowerCase().replace(/\s+/g, '_'));
      if (filterStatus === 'Active') params.set('active_only', 'true');
      if (filterStatus === 'Inactive') params.set('active_only', 'false');
      params.set('skip', '0');
      params.set('limit', '100');

      const response = await fetch(`${API_BASE_URL}/auth/super-admin/admins?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userRole');
        toast.error('Session expired or unauthorized. Please login again.');
        navigate('/adminlogin');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        const mappedAdmins = items.map(normalizeAdmin);
        setAdmins(mappedAdmins);
        localStorage.setItem('adminManagementList', JSON.stringify(mappedAdmins));
      } else {
        const errorText = await response.text();
        let errMsg = `Failed to load admins: ${response.status}`;
        try {
          const errData = JSON.parse(errorText);
          errMsg = errData.detail?.[0]?.msg || errData.message || errMsg;
        } catch {
          if (errorText) errMsg += ` - ${errorText.substring(0, 150)}`;
        }
        toast.error(errMsg);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      toast.error('An error occurred while loading admins.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [searchTerm, filterRole, filterStatus]);

  const filteredAndSortedAdmins = useMemo(() => {
    let result = [...admins];

    // Client-side fallback for extra filtering/sorting while API handles the main list.
    result.sort((a, b) => {
      const dateA = a.createdDate === '—' ? 0 : new Date(a.createdDate).getTime();
      const dateB = b.createdDate === '—' ? 0 : new Date(b.createdDate).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [admins, sortOrder]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    setDeletingId(id);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication token not found. Please login first.');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/super-admin/admins/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userRole');
        toast.error('Session expired or unauthorized. Please login again.');
        navigate('/adminlogin');
        return;
      }

      if (response.ok) {
        const updated = admins.filter((a) => a.id !== id);
        setAdmins(updated);
        localStorage.setItem('adminManagementList', JSON.stringify(updated));
        toast.success('Admin removed');
      } else {
        const errorText = await response.text();
        let errMsg = `Failed to delete admin: ${response.status}`;
        try {
          const errData = JSON.parse(errorText);
          errMsg = errData.detail?.[0]?.msg || errData.message || errMsg;
        } catch {
          if (errorText) errMsg += ` - ${errorText.substring(0, 150)}`;
        }
        toast.error(errMsg);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('An error occurred while deleting the admin.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin-management/edit/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/admin-management/view/${id}`);
  };

  const roles = ['All Roles', 'Admin', 'Super Admin', 'Exam Manager', 'Content Manager', 'Student Manager'];
  const statuses = ['All Status', 'Active', 'Inactive'];

  return (
    <div className="bg-[#f5f3ff] min-h-screen p-4 sm:p-6 md:p-8 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage system administrators and their permissions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin-management/create')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition font-medium"
          >
            <Plus size={18} /> Create Admin
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 md:flex-initial md:w-80">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3 flex-wrap md:flex-nowrap w-full md:w-auto">
              {/* Role Filter */}
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Info */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredAndSortedAdmins.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{admins.length}</span> admins
          </span>
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            Sort by date: {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading admins...</div>
        ) : filteredAndSortedAdmins.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 font-medium mb-2">No administrators found</p>
            <p className="text-sm text-gray-400">
              {admins.length === 0 ? 'Click "Create Admin" to add one.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Admin Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedAdmins.map((admin) => {
                  const roleColor = getRoleColor(admin.role);
                  const avatarColor = getAvatarColor(admin.name);
                  const initials = getInitials(admin.name);

                  return (
                    <tr key={admin.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${avatarColor} text-white font-semibold text-sm flex items-center justify-center`}>
                            {initials}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{admin.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor.bg} ${roleColor.text}`}>
                          {admin.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {admin.modules.slice(0, 2).map((module) => (
                            <span key={module} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                              {module}
                            </span>
                          ))}
                          {admin.modules.length > 2 && (
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                              +{admin.modules.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.createdDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            admin.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleView(admin.id)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(admin.id)}
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Bookmark"
                          >
                            <Bookmark size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(admin.id)}
                            disabled={deletingId === admin.id}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
