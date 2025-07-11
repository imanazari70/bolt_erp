import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { projectApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        maxWidth="2xl"
      >
        <div className="text-center py-8">
          <p className="text-slate-600">Project form will be implemented here</p>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsPage;