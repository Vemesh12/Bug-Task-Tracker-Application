import React, { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dummy data for tasks/bugs
const dummyTasks = [
  { id: 1, title: 'Fix login bug', status: 'open', assignedTo: 'dev1', date: '2025-06-12', priority: 'High', description: 'Login fails on Chrome', dueDate: '', tags: '', timeSpent: 0 },
  { id: 2, title: 'UI glitch on dashboard', status: 'closed', assignedTo: 'dev2', date: '2025-06-13', priority: 'Medium', description: 'Sidebar overlaps', dueDate: '', tags: '', timeSpent: 2 },
  { id: 3, title: 'API error on submit', status: 'open', assignedTo: 'dev1', date: '2025-06-14', priority: 'High', description: '500 error', dueDate: '', tags: '', timeSpent: 0 },
  // ...more tasks
];

// Helper to generate trend data
function getTrendData(tasks: any[]) {
  const dateMap: { [date: string]: number } = {};
  tasks.forEach(task => {
    dateMap[task.date] = (dateMap[task.date] || 0) + 1;
  });
  return Object.entries(dateMap).map(([date, count]) => ({ date, count }));
}

const Dashboard = () => {
  const { role, logout, user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [filter, setFilter] = useState({ priority: '', status: '' });
  const [logTimeId, setLogTimeId] = useState<number | null>(null);
  const [logTimeValue, setLogTimeValue] = useState<number>(0);

  useEffect(() => {
    setTasks(dummyTasks);
  }, []);

  // Filtering logic
  let visibleTasks = role === 'manager'
    ? tasks
    : tasks.filter(task => task.assignedTo === user?.username);

  if (filter.priority) visibleTasks = visibleTasks.filter(t => t.priority === filter.priority);
  if (filter.status) visibleTasks = visibleTasks.filter(t => t.status === filter.status);

  const trendData = getTrendData(visibleTasks);

  // Create
  const handleCreateTask = (newTask: any) => {
    setTasks([
      ...tasks,
      {
        ...newTask,
        id: tasks.length + 1,
        timeSpent: Number(newTask.timeSpent) || 0,
      },
    ]);
  };

  // Edit
  const handleEditTask = (id: number, updatedTask: any) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task)));
    setEditTaskId(null);
  };

  // Delete
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Developer closes bug (moves to pending approval)
  const handleCloseBug = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'pending-approval' } : task
    ));
  };

  // Manager approves or reopens
  const handleManagerAction = (id: number, action: 'approve' | 'reopen') => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: action === 'approve' ? 'closed' : 'open' }
        : task
    ));
  };

  // Time tracking
  const handleLogTime = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, timeSpent: (Number(task.timeSpent) || 0) + Number(logTimeValue) }
        : task
    ));
    setLogTimeId(null);
    setLogTimeValue(0);
  };

  // Get task to edit
  const taskToEdit = tasks.find(t => t.id === editTaskId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{role === 'manager' ? 'Manager' : 'Developer'} Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-1 rounded">Logout</button>
      </div>

      {/* Show TaskForm for create or edit */}
      {role === 'developer' && (
        <TaskForm
          onCreate={editTaskId === null ? handleCreateTask : (task) => handleEditTask(editTaskId, task)}
          editTask={editTaskId !== null ? taskToEdit : undefined}
          onCancelEdit={() => setEditTaskId(null)}
        />
      )}

      {/* Filter/Sort Controls */}
      <div className="mb-4 flex gap-4">
        <select
          value={filter.priority}
          onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}
          className="border p-1"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          className="border p-1"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="pending-approval">Pending Approval</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Task Trend</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" name="Tasks per day" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Tasks</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Priority</th>
              <th className="border px-2 py-1">Assigned To</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Time Spent (hrs)</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleTasks.map(task => (
              <tr key={task.id}>
                <td className="border px-2 py-1">{task.id}</td>
                <td className="border px-2 py-1">{task.title}</td>
                <td className="border px-2 py-1">{task.status}</td>
                <td className="border px-2 py-1">{task.priority}</td>
                <td className="border px-2 py-1">{task.assignedTo}</td>
                <td className="border px-2 py-1">{task.date}</td>
                <td className="border px-2 py-1">{task.timeSpent || 0}</td>
                <td className="border px-2 py-1">
                  {/* Developer actions */}
                  {role === 'developer' && task.assignedTo === user?.username && (
                    <>
                      <button onClick={() => setEditTaskId(task.id)} className="text-blue-600 mr-2">Edit</button>
                      <button onClick={() => handleDeleteTask(task.id)} className="text-red-600 mr-2">Delete</button>
                      {task.status === 'open' && (
                        <button onClick={() => handleCloseBug(task.id)} className="text-yellow-600 mr-2">Close</button>
                      )}
                      {/* Log Time */}
                      <button onClick={() => setLogTimeId(task.id)} className="text-purple-600 mr-2">Log Time</button>
                      {logTimeId === task.id && (
                        <span>
                          <input
                            type="number"
                            min={0}
                            value={logTimeValue}
                            onChange={e => setLogTimeValue(Number(e.target.value))}
                            className="border w-16 mx-1"
                          />
                          <button onClick={() => handleLogTime(task.id)} className="text-green-600">Save</button>
                        </span>
                      )}
                    </>
                  )}
                  {/* Manager actions */}
                  {role === 'manager' && task.status === 'pending-approval' && (
                    <>
                      <button onClick={() => handleManagerAction(task.id, 'approve')} className="text-green-600 mr-2">Approve</button>
                      <button onClick={() => handleManagerAction(task.id, 'reopen')} className="text-orange-600">Reopen</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;