import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Mail } from 'lucide-react';
import { mailApi, staffApi, projectApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import MailForm from '../components/Forms/MailForm';
import { Mail as MailType } from '../types/api';
import { toast } from 'react-hot-toast';

const MailsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMail, setEditingMail] = useState<MailType | null>(null);
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
    { key: 'subject' as keyof MailType, label: 'موضوع' },
    { key: 'employer' as keyof MailType, label: 'کارفرما' },
    { 
      key: 'type' as keyof MailType, 
      label: 'نوع',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(value)}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'state' as keyof MailType, 
      label: 'وضعیت',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getStateColor(value)}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'sender' as keyof MailType, 
      label: 'فرستنده',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'receiver' as keyof MailType, 
      label: 'گیرنده',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'project' as keyof MailType, 
      label: 'پروژه',
      render: (value: number) => getProjectName(value)
    },
  ];

  const handleEdit = (mail: MailType) => {
    setEditingMail(mail);
    setIsModalOpen(true);
  };

  const handleDelete = (mail: MailType) => {
    if (window.confirm('آیا از حذف این نامه اطمینان دارید؟')) {
      deleteMutation.mutate(mail.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMail(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Mail className="w-8 h-8 text-red-600" />
            مدیریت نامه‌ها
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مدیریت نامه‌های صادره و واردهه
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن نامه</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="جستجوی نامه‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
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

      {isModalOpen && (
        <MailForm
          mail={editingMail}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MailsPage;