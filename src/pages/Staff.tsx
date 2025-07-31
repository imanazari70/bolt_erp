import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Users } from 'lucide-react';
import { staffApi } from '../services/api';
import DataTable from '../components/Common/DataTable';
import StaffForm from '../components/Forms/StaffForm';
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            مدیریت کارکنان
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مدیریت اطلاعات کارکنان و پرسنل سازمان
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن کارمند</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="جستجوی کارکنان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
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

      {isModalOpen && (
        <StaffForm
          staff={editingStaff}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default StaffPage;