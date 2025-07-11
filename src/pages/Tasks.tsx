import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { taskApi, staffApi, projectApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
        maxWidth="2xl"
      >
        <div className="text-center py-8">
          <p className="text-slate-600">Task form will be implemented here</p>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;