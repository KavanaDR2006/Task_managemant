'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, AlertCircle, TrendingUp, Plus } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data.tasks || []);
      calculateStats(data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tasks: Task[]) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length;

    setStats({ total, completed, inProgress, overdue });
  };

  const getRecentTasks = () => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your task overview</p>
        </div>
        <Link href="/dashboard/create" className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Task</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-500 mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-yellow-500 mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Overdue</p>
              <p className="text-3xl font-bold text-red-500 mt-1">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="card">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Overall Progress</span>
            <span className="text-white font-semibold">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-500 rounded-full h-2 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Tasks</h2>
        {getRecentTasks().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No tasks yet. Create your first task!</p>
            <Link href="/dashboard/create" className="btn-primary mt-4 inline-block">
              Create Task
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {getRecentTasks().map((task) => (
              <div key={task._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                    <span className={`text-sm ${task.status === 'done' ? 'line-through text-gray-500' : 'text-white'}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.dueDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                    </p>
                  )}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                  task.status === 'done' ? 'bg-green-500/10 text-green-500' :
                  task.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-gray-500/10 text-gray-400'
                }`}>
                  {task.status.replace('-', ' ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
