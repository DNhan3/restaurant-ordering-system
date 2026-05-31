import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, LogOut, Save, Trash2, UserPlus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';

const initialForm = {
  email: '',
  name: '',
  password: '',
  role: 'customer',
};

export default function AdminUsersPage() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingUserId, setEditingUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
      return;
    }
    loadUsers();
  }, [admin, navigate]);

  const loadUsers = async () => {
    const data = await userService.getAll();
    setUsers(data);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingUserId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);

    try {
      const payload = {
        email: form.email.trim(),
        name: form.name.trim(),
        role: form.role,
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (editingUserId) {
        await userService.update(editingUserId, payload);
        setMessage('User updated.');
      } else {
        await userService.create({ ...payload, password: form.password });
        setMessage('User created.');
      }

      resetForm();
      await loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save user.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setForm({
      email: user.email || '',
      name: user.name || '',
      password: '',
      role: user.role || 'customer',
    });
    setMessage('');
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete user "${user.email}"?`);
    if (!confirmed) return;

    try {
      await userService.remove(user.id);
      if (editingUserId === user.id) resetForm();
      setMessage('User deleted.');
      await loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete user.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  if (!admin) return null;

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-brown-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-white/75 hover:text-white mb-3">
              <ArrowLeft className="w-5 h-5" />
              Dashboard
            </Link>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-brown-300 mt-1">Create, edit, change roles, and delete users.</p>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-light">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-brown-900">{editingUserId ? 'Edit User' : 'Create User'}</h2>
            {editingUserId && (
              <button type="button" onClick={resetForm} className="p-2 rounded-lg hover:bg-brown-50">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input-field" type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input-field" type="password" placeholder={editingUserId ? 'New password (optional)' : 'Password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingUserId} />
            <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="shipper">Shipper</option>
              <option value="staff">Staff</option>
            </select>
            <button disabled={isSaving} className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {editingUserId ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isSaving ? 'Saving...' : editingUserId ? 'Update User' : 'Create User'}
            </button>
            {message && <p className="text-sm text-brown-600">{message}</p>}
          </div>
        </form>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brown-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">Role</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-brown-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-cream/50">
                    <td className="px-4 py-3 text-sm text-brown-600">#{user.id}</td>
                    <td className="px-4 py-3 font-medium text-brown-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-brown-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-brown-600">{user.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(user)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brown-200 text-brown-600 hover:bg-brown-50">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(user)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
