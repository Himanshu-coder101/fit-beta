import React, { useState } from 'react';

export default function ProfileModal({ open, onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || {
    name: '', age: '', gender: '', weight: ''
  });
  const genders = ['Male', 'Female', 'Other'];
  const ages = Array.from({length: 62}, (_, i) => 18 + i);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender || !form.weight) return;
    onSubmit(form);
  };

  return open ? (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40">
      <div className="bg-gradient-to-br from-white via-gray-50 to-blue-100 dark:from-slate-800 dark:to-slate-950 p-8 rounded-3xl shadow-2xl max-w-sm w-full">
        <div className="mx-auto flex flex-col items-center mb-2">
          <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-blue-200">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-2xl tracking-tight font-extrabold text-gray-800 dark:text-gray-100 mb-0.5">Finish Your Profile</h2>
          <div className="text-blue-500 mb-3 font-medium text-sm">Just a few basics and you're set!</div>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800 dark:text-blue-200">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none shadow transition dark:bg-slate-900 dark:border-blue-800" placeholder="Your name" required />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-blue-800 dark:text-blue-200">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-lg border px-2 py-2 shadow border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900" required>
                <option value="">Select</option>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 text-blue-800 dark:text-blue-200">Age</label>
              <select name="age" value={form.age} onChange={handleChange} className="w-full rounded-lg border px-2 py-2 shadow border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900" required>
                <option value="">Age</option>
                {ages.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-800 dark:text-blue-200">Weight (kg)</label>
            <input name="weight" type="number" value={form.weight} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none shadow transition dark:bg-slate-900 dark:border-blue-800" placeholder="e.g., 72" required />
          </div>
          <button type="submit" className="mt-3 bg-blue-600 text-white font-bold text-lg py-2 rounded-xl shadow hover:bg-blue-700 transition">Save Profile</button>
        </form>
      </div>
    </div>
  ) : null;
}
