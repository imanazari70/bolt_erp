import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { staffApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import { Staff } from '../types/api';
import { toast } from 'react-hot-toast';

const StaffPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: staffApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: staffApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member deleted successfully');
    },
  });

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.job_label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'staff_id' as keyof Staff, label: 'Staff ID' },
    { key: 'name' as keyof Staff, label: 'Name' },
    { key: 'family' as keyof Staff, label: 'Family' },
    { key: 'job_label' as keyof Staff, label: 'Job Title' },
    { key: 'role' as keyof Staff, label: 'Role' },
    { key: 'mobile_phone' as keyof Staff, label: 'Mobile' },
    { 
      key: 'start_date' as keyof Staff, 
      label: 'Start Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = (staff: Staff) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      deleteMutation.mutate(staff.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <DataTable
          data={filteredStaff}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        maxWidth="2xl"
      >
        <div className="text-center py-8">
          <p className="text-slate-600">Staff form will be implemented here</p>
        </div>
      </Modal>
    </div>
  );
};

export default StaffPage;