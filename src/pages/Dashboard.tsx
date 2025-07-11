import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  Mail, 
  MessageCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { staffApi, projectApi, taskApi, timesheetApi, mailApi, messageApi } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: staffApi.getAll,
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });

  const { data: timesheets = [], isLoading: timesheetsLoading } = useQuery({
    queryKey: ['timesheets'],
    queryFn: timesheetApi.getAll,
  });

  const { data: mails = [], isLoading: mailsLoading } = useQuery({
    queryKey: ['mails'],
    queryFn: mailApi.getAll,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messageApi.getAll,
  });

  const stats = [
    {
      name: 'Total Staff',
      value: staff.length,
      icon: Users,
      color: 'bg-blue-500',
      loading: staffLoading,
    },
    {
      name: 'Active Projects',
      value: projects.length,
      icon: FolderOpen,
      color: 'bg-green-500',
      loading: projectsLoading,
    },
    {
      name: 'Pending Tasks',
      value: tasks.filter(task => task.state === 'در حال انجام').length,
      icon: CheckSquare,
      color: 'bg-yellow-500',
      loading: tasksLoading,
    },
    {
      name: 'Timesheets',
      value: timesheets.length,
      icon: Clock,
      color: 'bg-purple-500',
      loading: timesheetsLoading,
    },
    {
      name: 'Mails',
      value: mails.length,
      icon: Mail,
      color: 'bg-red-500',
      loading: mailsLoading,
    },
    {
      name: 'Messages',
      value: messages.length,
      icon: MessageCircle,
      color: 'bg-indigo-500',
      loading: messagesLoading,
    },
  ];

  const completedTasks = tasks.filter(task => task.state === 'اتمام').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Activity className="w-4 h-4" />
          <span>System Status: Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-slate-900">
                      {stat.loading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stat.value
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">Task Progress</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-600">Completion Rate</span>
              <span className="text-sm font-medium text-slate-900">{taskCompletionRate}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between text-sm text-slate-600">
              <span>Completed: {completedTasks}</span>
              <span>Total: {totalTasks}</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">Recent Projects</h3>
          </div>
          <div className="p-6">
            {projectsLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-900 truncate">
                        {project.project_name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {project.employer}
                    </span>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-sm text-slate-500">No projects found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors">
              <Users className="w-4 h-4 mr-2" />
              Add Staff
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors">
              <FolderOpen className="w-4 h-4 mr-2" />
              New Project
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-yellow-300 rounded-lg text-yellow-700 hover:bg-yellow-50 transition-colors">
              <CheckSquare className="w-4 h-4 mr-2" />
              Create Task
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-50 transition-colors">
              <Clock className="w-4 h-4 mr-2" />
              Log Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;