import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Shield, 
  Settings, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  Crown,
  Key
} from 'lucide-react';
import { adminApi } from '../services/api';
import { User, Group, Permission } from '../types/api';
import { toast } from 'react-hot-toast';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'groups' | 'permissions'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Users queries
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getUsers,
  });

  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['admin', 'groups'],
    queryFn: adminApi.getGroups,
  });

  const { data: permissions = [], isLoading: permissionsLoading } = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: adminApi.getPermissions,
  });

  // Mutations
  const deleteUserMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('کاربر با موفقیت حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف کاربر');
    }
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      adminApi.updateUser(id, { is_active: !isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('وضعیت کاربر تغییر کرد');
    },
    onError: () => {
      toast.error('خطا در تغییر وضعیت کاربر');
    }
  });

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.codename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserStatusColor = (user: User) => {
    if (!user.is_active) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (user.is_superuser) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    if (user.is_staff) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  const getUserStatusText = (user: User) => {
    if (!user.is_active) return 'غیرفعال';
    if (user.is_superuser) return 'مدیر کل';
    if (user.is_staff) return 'کارمند';
    return 'فعال';
  };

  const tabs = [
    { id: 'users', label: 'کاربران', icon: Users, count: users.length },
    { id: 'groups', label: 'گروه‌ها', icon: Shield, count: groups.length },
    { id: 'permissions', label: 'مجوزها', icon: Key, count: permissions.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            پنل مدیریت
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مدیریت کاربران، گروه‌ها و مجوزهای سیستم
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">کل کاربران</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">کاربران فعال</p>
              <p className="text-3xl font-bold">{users.filter(u => u.is_active).length}</p>
            </div>
            <UserCheck className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">مدیران</p>
              <p className="text-3xl font-bold">{users.filter(u => u.is_superuser).length}</p>
            </div>
            <Crown className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" dir="ltr">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-4">
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.first_name?.[0] || user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {user.first_name} {user.last_name} ({user.username})
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${getUserStatusColor(user)}`}>
                              {getUserStatusText(user)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              آخرین ورود: {user.last_login ? new Date(user.last_login).toLocaleDateString('fa-IR') : 'هرگز'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleUserStatusMutation.mutate({ id: user.id, isActive: user.is_active })}
                          className={`p-2 rounded-lg transition-colors ${
                            user.is_active
                              ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900'
                              : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                          }`}
                          title={user.is_active ? 'غیرفعال کردن' : 'فعال کردن'}
                        >
                          {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="مشاهده"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                          title="ویرایش"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
                              deleteUserMutation.mutate(user.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="space-y-4">
              {groupsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {group.permissions?.length || 0} مجوز
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-4">
              {permissionsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Key className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{permission.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            کد: {permission.codename} | مدل: {permission.content_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;