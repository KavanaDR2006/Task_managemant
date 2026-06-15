'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
          router.push('/dashboard');
        }
      })
      .catch(() => {});
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent">
            Master Your Tasks with TaskFlow
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            A modern, intuitive task management solution that helps you organize, track, and accomplish more.
          </p>
          <Link href="/register" className="btn-primary text-lg px-8 py-3">
            Start Managing Tasks
          </Link>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Task Management</h3>
            <p className="text-gray-400">Create, edit, and organize tasks with an intuitive interface</p>
          </div>
          <div className="card text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-4">
              <Clock className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-400">Monitor your productivity with visual progress indicators</p>
          </div>
          <div className="card text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stay Organized</h3>
            <p className="text-gray-400">Prioritize tasks, set due dates, and never miss a deadline</p>
          </div>
        </div>
      </div>
    </div>
  );
}
