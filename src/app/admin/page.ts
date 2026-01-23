'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  Users,
  BarChart3,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AdminView = 'login' | 'dashboard';

// Mock admin stats
const mockStats = {
  totalUsers: 1247,
  activeUsers: 342,
  averageScore: 78,
  completionRate: 65,
  modulesAttempted: 4521,
  incidentsReported: 23,
};

const mockRecentActivity = [
  { user: 'john.doe@company.com', action: 'Completed Phishing Detection Lab', time: '5 min ago', type: 'success' },
  { user: 'sarah.smith@company.com', action: 'Started Incident Response Module', time: '12 min ago', type: 'info' },
  { user: 'mike.jones@company.com', action: 'Failed Social Engineering Test', time: '18 min ago', type: 'warning' },
  { user: 'lisa.chen@company.com', action: 'Earned "Phish Hunter" Badge', time: '25 min ago', type: 'success' },
  { user: 'david.wilson@company.com', action: 'Completed Password Security', time: '32 min ago', type: 'success' },
];

const mockModuleStats = [
  { name: 'Phishing Detection', attempts: 1523, avgScore: 82, completion: 78 },
  { name: 'Social Engineering', attempts: 987, avgScore: 71, completion: 62 },
  { name: 'Incident Response', attempts: 654, avgScore: 68, completion: 55 },
  { name: 'Password Security', attempts: 1357, avgScore: 85, completion: 81 },
];

export default function AdminPage() {
  const [view, setView] = useState<AdminView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login (in production, this would be a real API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo credentials check
    if (email === 'admin@cybershield.com' && password === 'admin123') {
      setView('dashboard');
    } else {
      setError('Invalid credentials. Try admin@cybershield.com / admin123');
    }
    
    setIsLoading(false);
  };

  // Login View
  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-cyber-400 hover:text-cyber-300 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <div className="cyber-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyber-800 rounded-full mb-4">
                <Shield className="h-8 w-8 text-cyber-400" />
              </div>
              <h1 className="text-2xl font-bold text-cyber-100">Admin Login</h1>
              <p className="text-cyber-500 text-sm mt-1">CyberShield Administration</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-cyber-400 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  required
                  className="cyber-input"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-cyber-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="cyber-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-500 hover:text-cyber-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full cyber-button flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Hint */}
            <div className="mt-6 p-3 bg-cyber-800/50 rounded-lg">
              <p className="text-xs text-cyber-500 text-center">
                Demo credentials: admin@cybershield.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-cyber-700/50 bg-cyber-950/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-cyber-400" />
              <span className="text-lg font-bold text-cyber-100">CyberShield Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-cyber-400">admin@cybershield.com</span>
              <button
                onClick={() => setView('login')}
                className="text-sm text-cyber-500 hover:text-cyber-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cyber-100 mb-2">Dashboard</h1>
            <p className="text-cyber-400">Monitor training progress and user engagement.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Total Users"
              value={mockStats.totalUsers.toLocaleString()}
              color="text-blue-400"
            />
            <StatCard
              icon={Activity}
              label="Active Today"
              value={mockStats.activeUsers.toLocaleString()}
              color="text-green-400"
            />
            <StatCard
              icon={BarChart3}
              label="Avg. Score"
              value={`${mockStats.averageScore}%`}
              color="text-cyber-400"
            />
            <StatCard
              icon={CheckCircle}
              label="Completion Rate"
              value={`${mockStats.completionRate}%`}
              color="text-purple-400"
            />
            <StatCard
              icon={BookOpen}
              label="Total Attempts"
              value={mockStats.modulesAttempted.toLocaleString()}
              color="text-yellow-400"
            />
            <StatCard
              icon={AlertTriangle}
              label="Incidents"
              value={mockStats.incidentsReported.toLocaleString()}
              color="text-red-400"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Module Performance */}
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-cyber-400" />
                <span>Module Performance</span>
              </h2>

              <div className="space-y-4">
                {mockModuleStats.map((module) => (
                  <div key={module.name} className="bg-cyber-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-cyber-200">{module.name}</span>
                      <span className="text-sm text-cyber-400">{module.attempts} attempts</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-cyber-500">Avg Score: </span>
                        <span className={cn(
                          'font-medium',
                          module.avgScore >= 80 ? 'text-green-400' :
                          module.avgScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                        )}>
                          {module.avgScore}%
                        </span>
                      </div>
                      <div>
                        <span className="text-cyber-500">Completion: </span>
                        <span className="font-medium text-cyber-300">{module.completion}%</span>
                      </div>
                    </div>
                    <div className="mt-2 progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${module.completion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-cyber-400" />
                <span>Recent Activity</span>
              </h2>

              <div className="space-y-3">
                {mockRecentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-cyber-800/30 rounded-lg"
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                      activity.type === 'success' && 'bg-green-400',
                      activity.type === 'warning' && 'bg-yellow-400',
                      activity.type === 'info' && 'bg-blue-400'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-cyber-200 truncate">{activity.user}</p>
                      <p className="text-xs text-cyber-400">{activity.action}</p>
                    </div>
                    <span className="text-xs text-cyber-500 flex-shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-sm text-cyber-400 hover:text-cyber-300 transition-colors">
                View All Activity →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="cyber-card p-4 text-center hover:border-cyber-500/50 transition-colors">
              <Users className="h-6 w-6 text-cyber-400 mx-auto mb-2" />
              <span className="text-sm text-cyber-300">Manage Users</span>
            </button>
            <button className="cyber-card p-4 text-center hover:border-cyber-500/50 transition-colors">
              <BookOpen className="h-6 w-6 text-cyber-400 mx-auto mb-2" />
              <span className="text-sm text-cyber-300">Edit Modules</span>
            </button>
            <button className="cyber-card p-4 text-center hover:border-cyber-500/50 transition-colors">
              <BarChart3 className="h-6 w-6 text-cyber-400 mx-auto mb-2" />
              <span className="text-sm text-cyber-300">Export Reports</span>
            </button>
            <button className="cyber-card p-4 text-center hover:border-cyber-500/50 transition-colors">
              <Shield className="h-6 w-6 text-cyber-400 mx-auto mb-2" />
              <span className="text-sm text-cyber-300">Security Settings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="cyber-card p-4">
      <Icon className={cn('h-5 w-5 mb-2', color)} />
      <div className="text-xl font-bold text-cyber-200">{value}</div>
      <div className="text-xs text-cyber-500">{label}</div>
    </div>
  );
}
