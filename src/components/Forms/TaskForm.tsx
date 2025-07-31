import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X, CheckSquare, User, FolderOpen, Calendar, Star } from 'lucide-react';
import { taskApi, staffApi, projectApi } from '../../services/api';
import { Task } from '../../types/api';

const schema = yup.object({
  body: yup.string().required('متن وظیفه الزامی است').min(10, 'متن وظیفه باید حداقل ۱۰ کاراکتر باشد'),
  ded_line: yup.string().required('ددلاین الزامی است'),
  evaluation: yup.string().required('ارزیابی الزامی است'),
  assignor: yup.number().required('تخصیص دهنده الزامی است').positive(),
  assigned_to: yup.number().required('تخصیص داده شده به الزامی است').positive(),
  project: yup.number().required('پروژه الزامی است').positive(),
});

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: task || {
      state: 'در حال انجام',
    }
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
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('وظیفه با موفقیت اضافه شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در افزودن وظیفه');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) => 
      taskApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('وظیفه با موفقیت ویرایش شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در ویرایش وظیفه');
    }
  });

  const onSubmit = (data: any) => {
    if (task) {
      updateMutation.mutate({ id: task.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <CheckSquare className="w-7 h-7" />
            {task ? 'ویرایش وظیفه' : 'افزودن وظیفه جدید'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-8">
            {/* اطلاعات کلی وظیفه */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                اطلاعات کلی وظیفه
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شرح وظیفه *
                  </label>
                  <textarea
                    {...register('body')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                    placeholder="شرح کاملی از وظیفه ارائه دهید..."
                  />
                  {errors.body && (
                    <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      وضعیت
                    </label>
                    <select
                      {...register('state')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    >
                      <option value="در حال انجام">در حال انجام</option>
                      <option value="اتمام">اتمام</option>
                      <option value="لغو">لغو</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ارزیابی *
                    </label>
                    <input
                      {...register('evaluation')}
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="نمره از ۰ تا ۱۰۰"
                    />
                    {errors.evaluation && (
                      <p className="text-red-500 text-sm mt-1">{errors.evaluation.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* تخصیص وظیفه */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                تخصیص وظیفه
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تخصیص دهنده *
                  </label>
                  <select
                    {...register('assignor', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">انتخاب کنید...</option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} {member.family} - {member.job_label}
                      </option>
                    ))}
                  </select>
                  {errors.assignor && (
                    <p className="text-red-500 text-sm mt-1">{errors.assignor.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تخصیص داده شده به *
                  </label>
                  <select
                    {...register('assigned_to', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">انتخاب کنید...</option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} {member.family} - {member.job_label}
                      </option>
                    ))}
                  </select>
                  {errors.assigned_to && (
                    <p className="text-red-500 text-sm mt-1">{errors.assigned_to.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* پروژه و زمان‌بندی */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-purple-600" />
                پروژه و زمان‌بندی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ددلاین *
                  </label>
                  <input
                    {...register('ded_line')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.ded_line && (
                    <p className="text-red-500 text-sm mt-1">{errors.ded_line.message}</p>
                  )}
                </div>

                {task && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      تاریخ پایان
                    </label>
                    <input
                      {...register('end_date')}
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>
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
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isSubmitting ? 'در حال ذخیره...' : task ? 'ویرایش' : 'افزودن'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;