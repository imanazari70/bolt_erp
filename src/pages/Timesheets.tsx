import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { timesheetApi, staffApi, projectApi, taskApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import { TimeSheet } from '../types/api';
import { toast } from 'react-hot-toast';

const TimesheetsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<TimeSheet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: timesheets = [], isLoading } = useQuery({
    queryKey: ['timesheets'],
    queryFn: timesheetApi.getAll,
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: staffApi.getAll,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: timesheetApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      toast.success('Timesheet deleted successfully');
    },
  });

  const filteredTimesheets = timesheets.filter(timesheet =>
    timesheet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStaffName = (staffId: number) => {
    const member = staff.find(s => s.id === staffId);
    return member ? `${member.name} ${member.family}` : 'Unknown';
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.project_name : 'Unknown';
  };

  const getTaskDescription = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.body.substring(0, 50) + '...' : 'Unknown';
  };

  const columns = [
    { 
      key: 'date' as keyof TimeSheet, 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { key: 'start_time' as keyof TimeSheet, label: 'Start Time' },
    { key: 'end_time' as keyof TimeSheet, label: 'End Time' },
    { key: 'description' as keyof TimeSheet, label: 'Description' },
    { 
      key: 'project' as keyof TimeSheet, 
      label: 'Project',
      render: (value: number) => getProjectName(value)
    },
    { 
      key: 'manager' as keyof TimeSheet, 
      label: 'Manager',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'task' as keyof TimeSheet, 
      label: 'Task',
      render: (value: number) => getTaskDescription(value)
    },
    { 
      key: 'mission' as keyof TimeSheet, 
      label: 'Mission',
      render: (value: boolean) => (
        <span className={`px-2 py-1 text-xs rounded-full ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
  ];

  const handleEdit = (timesheet: TimeSheet) => {
    setEditingTimesheet(timesheet);
    setIsModalOpen(true);
  };

  const handleDelete = (timesheet: TimeSheet) => {
    if (window.confirm('Are you sure you want to delete this timesheet?')) {
      deleteMutation.mutate(timesheet.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTimesheet(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Timesheets</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timesheet</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search timesheets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <DataTable
          data={filteredTimesheets}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTimesheet ? 'Edit Timesheet' : 'Add New Timesheet'}
        maxWidth="2xl"
      >
        <div className="text-center py-8">
          <p className="text-slate-600">Timesheet form will be implemented here</p>
        </div>
      </Modal>
    </div>
  );
};

export default TimesheetsPage;