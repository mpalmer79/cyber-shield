'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  BookOpen,
  CheckCircle,
  Lock,
  Clock,
  X
} from 'lucide-react';
import { Header, ModuleCard, ModuleGridSkeleton, NoSearchResults, useToast, useSoundEffect } from '@/components';
import { useModulesStore } from '@/store';
import { cn } from '@/lib/utils';
import type { TrainingModule, DifficultyLevel, ModuleStatus } from '@/types';

type FilterDifficulty = DifficultyLevel | 'all';
type FilterStatus = ModuleStatus | 'all';

export default function TrainingPage() {
  const router = useRouter();
  const { modules } = useModulesStore();
  const toast = useToast();
  const playSound = useSoundEffect();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Filter modules
  const filteredModules = modules.filter((module) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        module.title.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query) ||
        module.skills.some((skill) => skill.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'all' && module.difficulty !== difficultyFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && module.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Group modules by status for better organization
  const availableModules = filteredModules.filter(
    (m) => m.status === 'available' || m.status === 'in-progress'
  );
  const completedModules = filteredModules.filter((m) => m.status === 'completed');
  const lockedModules = filteredModules.filter((m) => m.status === 'locked');

  const handleModuleClick = (module: TrainingModule) => {
    if (module.status !== 'locked') {
      playSound('click');
      router.push(`/training/${module.id}`);
    } else {
      playSound('error');
      toast.warning('This module is locked. Complete prerequisite modules first.');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setStatusFilter('all');
    playSound('click');
  };

  const difficulties: { value: FilterDifficulty; label: string }[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const statuses: { value: FilterStatus; label: string; icon: React.ElementType }[] = [
    { value: 'all', label: 'All', icon: BookOpen },
    { value: 'available', label: 'Available', icon: Clock },
    { value: 'in-progress', label: 'In Progress', icon: BookOpen },
    { value: 'completed', label: 'Completed', icon: CheckCircle },
    { value: 'locked', label: 'Locked', icon: Lock },
  ];

  return (
    <div className="min-h-screen">
      <Header currentPage="training" />

      <main className="py-8 px-4">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cyber-100 mb-2">Training Modules</h1>
            <p className="text-cyber-400">
              Choose a module to begin your cybersecurity training journey.
            </p>
          </div>

          {/* Filters */}
          <div className="cyber-card p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-500" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="cyber-input pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-cyber-700 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-cyber-500" />
                  </button>
                )}
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-cyber-500" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => {
                    setDifficultyFilter(e.target.value as FilterDifficulty);
                    playSound('click');
                  }}
                  className="cyber-input py-2"
                >
                  {difficulties.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 mt-4">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => {
                    setStatusFilter(status.value);
                    playSound('click');
                  }}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    statusFilter === status.value
                      ? 'bg-cyber-700/50 text-cyber-200 border border-cyber-600'
                      : 'bg-cyber-800/30 text-cyber-400 border border-transparent hover:border-cyber-700'
                  )}
                >
                  <status.icon className="h-4 w-4" />
                  <span>{status.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-cyber-500 mb-6">
            Showing {filteredModules.length} of {modules.length} modules
          </div>

          {/* Loading State */}
          {isLoading ? (
            <ModuleGridSkeleton count={6} />
          ) : filteredModules.length === 0 ? (
            /* Empty State */
            <div className="cyber-card p-6">
              <NoSearchResults 
                query={searchQuery || undefined} 
                onClear={clearSearch}
              />
            </div>
          ) : (
            /* Modules Grid */
            <div className="space-y-8">
              {/* Available Modules */}
              {availableModules.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-cyber-400" />
                    <span>Available ({availableModules.length})</span>
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableModules.map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        onClick={handleModuleClick}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Completed Modules */}
              {completedModules.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Completed ({completedModules.length})</span>
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedModules.map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        onClick={handleModuleClick}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Locked Modules */}
              {lockedModules.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-cyber-200 mb-4 flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <span>Locked ({lockedModules.length})</span>
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lockedModules.map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        onClick={handleModuleClick}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
