import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Clock } from 'lucide-react';
import { timesheetApi, staffApi, projectApi, taskApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import TimesheetForm from '../components/Forms/TimesheetForm';
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-indigo-600" />
            مدیریت تایم‌شیت‌ها
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            ثبت و مدیریت ساعات کاری کارکنان
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن تایم‌شیت</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="جستجوی تایم‌شیت‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
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

      {isModalOpen && (
        <TimesheetForm
          timesheet={editingTimesheet}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TimesheetsPage;