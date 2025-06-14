import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const developers = [
  'dev1', 'dev2', 'dev3'
];

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['open', 'in progress', 'closed'];

const TaskForm = ({
  onCreate,
  editTask,
  onCancelEdit
}: {
  onCreate: (task: any) => void,
  editTask?: any,
  onCancelEdit?: () => void
}) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'open',
    assignedTo: user?.username || '',
    date: new Date().toISOString().slice(0, 10),
    dueDate: '',
    tags: '',
    timeSpent: 0,
  });

  useEffect(() => {
    if (editTask) {
      setForm({
        ...editTask,
        date: editTask.date || new Date().toISOString().slice(0, 10),
        timeSpent: editTask.timeSpent || 0,
      });
    }
  }, [editTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(form);
    setForm({
      title: '',
      description: '',
      priority: 'Low',
      status: 'open',
      assignedTo: user?.username || '',
      date: new Date().toISOString().slice(0, 10),
      dueDate: '',
      tags: '',
      timeSpent: 0,
    });
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{editTask ? 'Edit Task/Bug' : 'Create New Task/Bug'}</h3>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 w-full mb-2" required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full mb-2" required />
      <select name="priority" value={form.priority} onChange={handleChange} className="border p-2 w-full mb-2">
        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <select name="status" value={form.status} onChange={handleChange} className="border p-2 w-full mb-2">
        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="border p-2 w-full mb-2">
        {developers.map(dev => <option key={dev} value={dev}>{dev}</option>)}
      </select>
      <label className="block mb-1">Date Created</label>
      <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 w-full mb-2" />
      <label className="block mb-1">Due Date</label>
      <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input type="number" name="timeSpent" placeholder="Time Spent (hours)" value={form.timeSpent} onChange={handleChange} className="border p-2 w-full mb-2" min={0} />
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editTask ? 'Update' : 'Add'} Task/Bug</button>
        {editTask && onCancelEdit && (
          <button type="button" onClick={onCancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;