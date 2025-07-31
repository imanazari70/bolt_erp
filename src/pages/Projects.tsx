import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, FolderOpen } from 'lucide-react';
import { projectApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import ProjectForm from '../components/Forms/ProjectForm';
import { Project } from '../types/api';
import { toast } from 'react-hot-toast';

const ProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: projectApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
  });

  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.contractor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'project_code' as keyof Project, label: 'Code' },
    { key: 'project_name' as keyof Project, label: 'Project Name' },
    { key: 'employer' as keyof Project, label: 'Employer' },
    { key: 'contractor' as keyof Project, label: 'Contractor' },
    { key: 'service_type' as keyof Project, label: 'Service Type' },
    { 
      key: 'contract_start_date' as keyof Project, 
      label: 'Start Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'contract_completion_date' as keyof Project, 
      label: 'End Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(project.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FolderOpen className="w-8 h-8 text-green-600" />
            مدیریت پروژه‌ها
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مدیریت پروژه‌ها و قراردادهای سازمان
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن پروژه</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="جستجوی پروژه‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>

        <DataTable
          data={filteredProjects}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      </div>

      {isModalOpen && (
        <ProjectForm
          project={editingProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProjectsPage;