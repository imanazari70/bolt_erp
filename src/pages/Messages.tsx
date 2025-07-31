import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, MessageCircle } from 'lucide-react';
import { messageApi, staffApi, projectApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import MessageForm from '../components/Forms/MessageForm';
import { Message } from '../types/api';
import { toast } from 'react-hot-toast';

const MessagesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messageApi.getAll,
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
    mutationFn: messageApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message deleted successfully');
    },
  });

  const filteredMessages = messages.filter(message =>
    message.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStaffName = (staffId: number) => {
    const member = staff.find(s => s.id === staffId);
    return member ? `${member.name} ${member.family}` : 'Unknown';
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.project_name : 'Unknown';
  };

  const columns = [
    { 
      key: 'date' as keyof Message, 
      label: 'تاریخ',
      render: (value: string) => new Date(value).toLocaleString()
    },
    { 
      key: 'body' as keyof Message, 
      label: 'پیام',
      render: (value: string) => value.substring(0, 100) + (value.length > 100 ? '...' : '')
    },
    { 
      key: 'sender' as keyof Message, 
      label: 'فرستنده',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'receiver' as keyof Message, 
      label: 'گیرنده',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'project' as keyof Message, 
      label: 'پروژه',
      render: (value: number) => getProjectName(value)
    },
  ];

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setIsModalOpen(true);
  };

  const handleDelete = (message: Message) => {
    if (window.confirm('آیا از حذف این پیام اطمینان دارید؟')) {
      deleteMutation.mutate(message.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMessage(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-teal-600" />
            مدیریت پیام‌ها
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            ارسال و مدیریت پیام‌های داخلی
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>ارسال پیام</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="جستجوی پیام‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>

        <DataTable
          data={filteredMessages}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      </div>

      {isModalOpen && (
        <MessageForm
          message={editingMessage}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MessagesPage;