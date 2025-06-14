export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed' | 'Pending Approval';
  assignee: string;
  dateCreated: string;
  timeSpent: number; // in minutes
}

let tasks: Task[] = [
  {
    id: 1,
    title: 'Fix login issue',
    description: 'Users are unable to log in under certain conditions.',
    priority: 'High',
    status: 'Open',
    assignee: 'dev',
    dateCreated: new Date().toISOString(),
    timeSpent: 0,
  },
];

export const taskService = {
  getAll: () => Promise.resolve([...tasks]),

  getByAssignee: (username: string) =>
    Promise.resolve(tasks.filter((t) => t.assignee === username)),

  create: (task: Omit<Task, 'id' | 'dateCreated' | 'timeSpent'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      dateCreated: new Date().toISOString(),
      timeSpent: 0,
    };
    tasks.push(newTask);
    return Promise.resolve(newTask);
  },

  update: (updatedTask: Task) => {
    tasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    return Promise.resolve(updatedTask);
  },

  delete: (id: number) => {
    tasks = tasks.filter((t) => t.id !== id);
    return Promise.resolve();
  },
};