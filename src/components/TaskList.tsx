import React, { useEffect, useState } from 'react';
import { taskService, Task } from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const TaskList = () => {
  const { role } = useAuth();
  const username = role === 'developer' ? 'dev' : '';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
  }>({
    title: '',
    description: '',
    priority: 'Low',
  });
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  const fetchTasks = async () => {
    const data = role === 'developer' ? await taskService.getByAssignee(username) : await taskService.getAll();
    setTasks(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTaskId !== null) {
      await taskService.update({
        id: editTaskId,
        ...form,
        assignee: username,
        status: 'Open',
        dateCreated: new Date().toISOString(),
        timeSpent: 0,
      });
    } else {
      await taskService.create({
        ...form,
        assignee: username,
        status: 'Open',
      });
    }
    setForm({ title: '', description: '', priority: 'Low' });
    setEditTaskId(null);
    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    await taskService.delete(id);
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    setForm({ title: task.title, description: task.description, priority: task.priority });
    setEditTaskId(task.id);
  };

  return (
    <div>
      {role === 'developer' && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">{editTaskId ? 'Edit Task' : 'Create New Task'}</h3>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 w-full mb-2" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full mb-2" />
          <select name="priority" value={form.priority} onChange={handleChange} className="border p-2 w-full mb-2">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editTaskId ? 'Update Task' : 'Add Task'}
          </button>
        </form>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">{role === 'developer' ? 'My Tasks' : 'All Tasks'}</h3>
        {tasks.map(task => (
          <div key={task.id} className="border p-4 rounded mb-2">
            <h4 className="font-bold">{task.title}</h4>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Assignee: {task.assignee}</p>
            <p>Date Created: {new Date(task.dateCreated).toLocaleDateString()}</p>
            {role === 'developer' && (
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleEdit(task)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(task.id)} className="text-red-600">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;