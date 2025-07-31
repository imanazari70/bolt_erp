import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, CheckSquare } from 'lucide-react';
import { taskApi, staffApi, projectApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import TaskForm from '../components/Forms/TaskForm';
import { Task } from '../types/api';
import { toast } from 'react-hot-toast';

const TasksPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: staffApi.getAll,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
  });

  const filteredTasks = tasks.filter(task =>
    task.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStaffName = (staffId: number) => {
    const member = staff.find(s => s.id === staffId);
    return member ? `${member.name} ${member.family}` : 'Unknown';
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.project_name : 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'اتمام': return 'bg-green-100 text-green-800';
      case 'در حال انجام': return 'bg-yellow-100 text-yellow-800';
      case 'لغو': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'body' as keyof Task, label: 'Description' },
    { 
      key: 'assignor' as keyof Task, 
      label: 'Assignor',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'assigned_to' as keyof Task, 
      label: 'Assigned To',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'project' as keyof Task, 
      label: 'Project',
      render: (value: number) => getProjectName(value)
    },
    { 
      key: 'state' as keyof Task, 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'ded_line' as keyof Task, 
      label: 'Deadline',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { key: 'evaluation' as keyof Task, label: 'Evaluation' },
  ];

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(task.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-purple-600" />
            مدیریت وظایف
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مدیریت وظایف و تکالیف پروژه‌ها
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن وظیفه</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="جستجوی وظایف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>

        <DataTable
          data={filteredTasks}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      </div>

      {isModalOpen && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TasksPage;