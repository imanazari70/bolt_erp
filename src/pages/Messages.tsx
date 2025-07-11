import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { messageApi, staffApi, projectApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
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
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleString()
    },
    { 
      key: 'body' as keyof Message, 
      label: 'Message',
      render: (value: string) => value.substring(0, 100) + (value.length > 100 ? '...' : '')
    },
    { 
      key: 'sender' as keyof Message, 
      label: 'Sender',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'receiver' as keyof Message, 
      label: 'Receiver',
      render: (value: number) => getStaffName(value)
    },
    { 
      key: 'project' as keyof Message, 
      label: 'Project',
      render: (value: number) => getProjectName(value)
    },
  ];

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setIsModalOpen(true);
  };

  const handleDelete = (message: Message) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(message.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMessage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Message</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMessage ? 'Edit Message' : 'Add New Message'}
        maxWidth="2xl"
      >
        <div className="text-center py-8">
          <p className="text-slate-600">Message form will be implemented here</p>
        </div>
      </Modal>
    </div>
  );
};

export default MessagesPage;