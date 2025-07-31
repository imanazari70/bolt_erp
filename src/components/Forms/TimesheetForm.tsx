import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X, Clock, User, FolderOpen, CheckSquare } from 'lucide-react';
import { timesheetApi, staffApi, projectApi, taskApi } from '../../services/api';
import { TimeSheet } from '../../types/api';

const schema = yup.object({
  start_time: yup.string().required('زمان شروع الزامی است'),
  end_time: yup.string().required('زمان پایان الزامی است'),
  description: yup.string().required('توضیحات الزامی است').min(5, 'توضیحات باید حداقل ۵ کاراکتر باشد'),
  project: yup.number().required('پروژه الزامی است').positive(),
  manager: yup.number().required('مدیر الزامی است').positive(),
  task: yup.number().required('وظیفه الزامی است').positive(),
});

interface TimesheetFormProps {
  timesheet?: TimeSheet;
  onClose: () => void;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ timesheet, onClose }) => {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: timesheet || {
      mission: false,
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

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });

  const watchMission = watch('mission');

  const createMutation = useMutation({
    mutationFn: timesheetApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      toast.success('تایم‌شیت با موفقیت اضافه شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در افزودن تایم‌شیت');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TimeSheet> }) => 
      timesheetApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      toast.success('تایم‌شیت با موفقیت ویرایش شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در ویرایش تایم‌شیت');
    }
  });

  const onSubmit = (data: any) => {
    if (timesheet) {
      updateMutation.mutate({ id: timesheet.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Clock className="w-7 h-7" />
            {timesheet ? 'ویرایش تایم‌شیت' : 'افزودن تایم‌شیت جدید'}
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
            {/* اطلاعات زمانی */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                اطلاعات زمانی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    زمان شروع *
                  </label>
                  <input
                    {...register('start_time')}
                    type="time"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.start_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    زمان پایان *
                  </label>
                  <input
                    {...register('end_time')}
                    type="time"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.end_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.end_time.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  توضیحات *
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                  placeholder="توضیح مختصری از کار انجام شده..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* اطلاعات ماموریت */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-green-600" />
                اطلاعات ماموریت
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    {...register('mission')}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    این کار شامل ماموریت است
                  </label>
                </div>

                {watchMission && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        طول زمان ماموریت
                      </label>
                      <input
                        {...register('mission_duration')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="مثال: ۲ ساعت"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        طول زمان تایید شده ماموریت
                      </label>
                      <input
                        {...register('verified_duration_mission')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="مثال: ۱.۵ ساعت"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* تخصیص پروژه و وظیفه */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-purple-600" />
                تخصیص پروژه و وظیفه
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {project.project_name}
                      </option>
                    ))}
                  </select>
                  {errors.project && (
                    <p className="text-red-500 text-sm mt-1">{errors.project.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    مدیر *
                  </label>
                  <select
                    {...register('manager', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">انتخاب کنید...</option>
                    {staff.filter(member => member.role.includes('مدیر')).map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} {manager.family}
                      </option>
                    ))}
                  </select>
                  {errors.manager && (
                    <p className="text-red-500 text-sm mt-1">{errors.manager.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وظیفه *
                  </label>
                  <select
                    {...register('task', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">انتخاب کنید...</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.body.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                  {errors.task && (
                    <p className="text-red-500 text-sm mt-1">{errors.task.message}</p>
                  )}
                </div>
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
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isSubmitting ? 'در حال ذخیره...' : timesheet ? 'ویرایش' : 'افزودن'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimesheetForm;