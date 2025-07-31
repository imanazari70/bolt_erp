import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X, MessageCircle, User, FolderOpen } from 'lucide-react';
import { messageApi, staffApi, projectApi } from '../../services/api';
import { Message } from '../../types/api';

const schema = yup.object({
  body: yup.string().required('متن پیام الزامی است').min(5, 'متن پیام باید حداقل ۵ کاراکتر باشد'),
  sender: yup.number().required('فرستنده الزامی است').positive(),
  receiver: yup.number().required('گیرنده الزامی است').positive(),
  project: yup.number().required('پروژه الزامی است').positive(),
});

interface MessageFormProps {
  message?: Message;
  onClose: () => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ message, onClose }) => {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: message || {}
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: staffApi.getAll,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: messageApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('پیام با موفقیت ارسال شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در ارسال پیام');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Message> }) => 
      messageApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('پیام با موفقیت ویرایش شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در ویرایش پیام');
    }
  });

  const onSubmit = (data: any) => {
    if (message) {
      updateMutation.mutate({ id: message.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <MessageCircle className="w-7 h-7" />
            {message ? 'ویرایش پیام' : 'ارسال پیام جدید'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* فرستنده و گیرنده */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                فرستنده و گیرنده
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    فرستنده *
                  </label>
                  <select
                    {...register('sender', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">انتخاب کنید...</option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} {member.family} - {member.job_label}
                      </option>
                    ))}
                  </select>
                  {errors.sender && (
                    <p className="text-red-500 text-sm mt-1">{errors.sender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    گیرنده *
                  </label>
                  <select
                    {...register('receiver', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">انتخاب کنید...</option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} {member.family} - {member.job_label}
                      </option>
                    ))}
                  </select>
                  {errors.receiver && (
                    <p className="text-red-500 text-sm mt-1">{errors.receiver.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* پروژه مرتبط */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-green-600" />
                پروژه مرتبط
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  پروژه *
                </label>
                <select
                  {...register('project', { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                >
                  <option value="">انتخاب کنید...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.project_name} - {project.employer}
                    </option>
                  ))}
                </select>
                {errors.project && (
                  <p className="text-red-500 text-sm mt-1">{errors.project.message}</p>
                )}
              </div>
            </div>

            {/* متن پیام */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                متن پیام
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  متن پیام *
                </label>
                <textarea
                  {...register('body')}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                  placeholder="متن پیام خود را وارد کنید..."
                />
                {errors.body && (
                  <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isSubmitting ? 'در حال ارسال...' : message ? 'ویرایش' : 'ارسال'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;