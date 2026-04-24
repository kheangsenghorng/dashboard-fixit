"use client";
import React, { useState } from 'react';
import { PlusCircle, Users, Trash2 } from 'lucide-react';

const ProvidersPage = () => {
  // State for the list of providers (Mock data)
  const [providers, setProviders] = useState([
    { provider_id: 1, user_id: 101, owner_id: 50, category_id: 1, status: 'Active', provider_type: 'staff' },
    { provider_id: 2, user_id: 102, owner_id: 50, category_id: 2, status: 'Pending', provider_type: 'freelancer' },
  ]);

  // State for the form
  const [formData, setFormData] = useState({
    user_id: '',
    owner_id: '',
    category_id: '',
    status: 'Active',
    provider_type: 'staff' // Default ENUM value
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProvider = {
      ...formData,
      provider_id: providers.length + 1, // Mock PK generation
    };
    setProviders([...providers, newProvider]);
    // Reset form
    setFormData({ user_id: '', owner_id: '', category_id: '', status: 'Active', provider_type: 'staff' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Users className="text-blue-600" /> Provider Management
        </h1>

        {/* --- CREATE SECTION --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={20} /> Add New Provider
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">User ID (FK)</label>
              <input
                type="number"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Owner ID (FK)</label>
              <input
                type="number"
                name="owner_id"
                value={formData.owner_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category ID (FK)</label>
              <input
                type="number"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                placeholder="e.g. Active"
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Provider Type (ENUM)</label>
              <select
                name="provider_type"
                value={formData.provider_type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="staff">Staff</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
              >
                Add Provider
              </button>
            </div>
          </form>
        </div>

        {/* --- DISPLAY SECTION --- */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 border-b font-bold text-gray-700">ID (PK)</th>
                <th className="p-4 border-b font-bold text-gray-700">User ID</th>
                <th className="p-4 border-b font-bold text-gray-700">Owner</th>
                <th className="p-4 border-b font-bold text-gray-700">Category</th>
                <th className="p-4 border-b font-bold text-gray-700">Type</th>
                <th className="p-4 border-b font-bold text-gray-700">Status</th>
                <th className="p-4 border-b font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.provider_id} className="hover:bg-gray-50 transition">
                  <td className="p-4 border-b font-mono text-blue-600">{p.provider_id}</td>
                  <td className="p-4 border-b">{p.user_id}</td>
                  <td className="p-4 border-b">{p.owner_id}</td>
                  <td className="p-4 border-b">{p.category_id}</td>
                  <td className="p-4 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.provider_type === 'staff' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {p.provider_type.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 border-b italic text-gray-600">{p.status}</td>
                  <td className="p-4 border-b">
                    <button 
                      onClick={() => setProviders(providers.filter(item => item.provider_id !== p.provider_id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;