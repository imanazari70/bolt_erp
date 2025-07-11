import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { mailApi, staffApi, projectApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import { Mail } from '../types/api';
import { toast } from 'react-hot-toast';

const MailsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMail, setEditingMail] = useState<Mail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: mails = [], isLoading } = useQuery({
    queryKey: ['mails'],
    queryFn: mailApi.getAll,
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
    mutationFn: mailApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mails'] });
      toast.success('Mail deleted successfully');
    },
  });

  const filteredMails = mails.filter(mail =>
    mail.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mail.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mail.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStaffName = (staffId: number) => {
    const member = staff.find(s => s.id === staffId);
    return member ? `${member.name} ${member.family}` : 'Unknown';
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.project_name : 'Unknown';
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'انجام شده': return 'bg-green-100 text-green-800';
      case 'در حال بررسی': return 'bg-yellow-100 text-yellow-800';
      case 'بایگانی': return 'bg-blue-100 text-blue-800';
      case 'حذف': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'صادره': return 'bg-green-100 text-green-800';
      case 'دریافتی': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { key: 'subject' as keyof Mail, label: 'Subject' },
    { key: 'employer' as keyof Mail, label: 'Employer' },
    { 
      key: 'type' as keyof Mail, 
      label: 'Type',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(value)}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'state' as keyof Mail, 
      label: 'State',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getStateColor(value)}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'sender' as keyof Mail, 
      label: 'Sender',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'receiver' as keyof Mail, 
      label: 'Receiver',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'project' as keyof Mail, 
      label: 'Project',
      render: (value: number) => getProjectName(value)
    },
  ];

  const handleEdit = (mail: Mail) => {
    setEditingMail(mail);
    setIsModalOpen(true);
  };

  const handleDelete = (mail: Mail) => {
    if (window.confirm('Are you sure you want to delete this mail?')) {
      deleteMutation.mutate(mail.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMail(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Mails</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Mail</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search mails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <DataTable
          data={filteredMails}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMail ? 'Edit Mail' : 'Add New Mail'}
        maxWidth="2xl"
      >
        <div className="text-center py-8">
          <p className="text-slate-600">Mail form will be implemented here</p>
        </div>
      </Modal>
    </div>
  );
};

export default MailsPage;