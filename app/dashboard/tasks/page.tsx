'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Task deleted successfully');
        fetchTasks();
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleStatusToggle = async (task: Task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        toast.success(`Task marked as ${newStatus}`);
        fetchTasks();
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.status === filter);
    }
    
    if (search) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'low': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">All Tasks</h1>
          <p className="text-gray-400 mt-1">Manage and organize your tasks</p>
        </div>
        <Link href="/dashboard/create" className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Task</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'todo', 'in-progress', 'done'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">No tasks found</p>
          <Link href="/dashboard/create" className="btn-primary mt-4 inline-block">
            Create your first task
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div key={task._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button onClick={() => handleStatusToggle(task)} className="mt-1">
                    {getStatusIcon(task.status)}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-semibold ${task.status === 'done' ? 'line-through text-gray-500' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <p className="text-xs text-gray-500">
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/tasks/${task._id}/edit`}
                    className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
