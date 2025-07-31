import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X, FolderOpen, Building, Calendar, DollarSign, FileText } from 'lucide-react';
import { projectApi } from '../../services/api';
import { Project } from '../../types/api';

const schema = yup.object({
  project_code: yup.number().required('کد پروژه الزامی است').positive('کد پروژه باید مثبت باشد'),
  project_name: yup.string().required('نام پروژه الزامی است').min(2, 'نام پروژه باید حداقل ۲ کاراکتر باشد'),
  contract_number: yup.number().required('شماره قرارداد الزامی است').positive('شماره قرارداد باید مثبت باشد'),
  contract_start_date: yup.string().required('تاریخ شروع قرارداد الزامی است'),
  contract_notification_date: yup.string().required('تاریخ ابلاغ قرارداد الزامی است'),
  contract_completion_date: yup.string().required('تاریخ پایان قرارداد الزامی است'),
  employer: yup.string().required('کارفرما الزامی است'),
  contractor: yup.string().required('پیمانکار الزامی است'),
  sajat: yup.string().required('ساجات الزامی است'),
  contract_row: yup.string().required('ردیف قرارداد الزامی است'),
  account_settlement: yup.string().required('تسویه حساب الزامی است'),
  as_date: yup.string().required('تاریخ تسویه حساب الزامی است'),
});

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose }) => {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: project || {
      service_type: 'بازسازی',
      employer_type: 'دولتی',
    }
  });

  const createMutation = useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('پروژه با موفقیت اضافه شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در افزودن پروژه');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) => 
      projectApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('پروژه با موفقیت ویرایش شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در ویرایش پروژه');
    }
  });

  const onSubmit = (data: any) => {
    if (project) {
      updateMutation.mutate({ id: project.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FolderOpen className="w-7 h-7" />
            {project ? 'ویرایش پروژه' : 'افزودن پروژه جدید'}
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
            {/* اطلاعات کلی پروژه */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                اطلاعات کلی پروژه
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کد پروژه *
                  </label>
                  <input
                    {...register('project_code', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.project_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.project_code.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نام پروژه *
                  </label>
                  <input
                    {...register('project_name')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.project_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.project_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نوع خدمت
                  </label>
                  <select
                    {...register('service_type')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="بازسازی">بازسازی</option>
                    <option value="مقاوم سازی">مقاوم سازی</option>
                    <option value="طراحی از ابتدا">طراحی از ابتدا</option>
                    <option value="بازسازی و مقاوم‌سازی">بازسازی و مقاوم‌سازی</option>
                    <option value="نظارت بر طراحی از ابتدا">نظارت بر طراحی از ابتدا</option>
                    <option value="نظارت بر مقاوم‌سازی">نظارت بر مقاوم‌سازی</option>
                    <option value="نظارت بر بازسازی و مقاوم‌سازی">نظارت بر بازسازی و مقاوم‌سازی</option>
                    <option value="ارزیابی سریع">ارزیابی سریع</option>
                    <option value="تحلیل ریسک">تحلیل ریسک</option>
                    <option value="خدمات جانبی">خدمات جانبی</option>
                  </select>
                </div>
              </div>
            </div>

            {/* اطلاعات طرف‌های قرارداد */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-green-600" />
                اطلاعات طرف‌های قرارداد
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کارفرما *
                  </label>
                  <input
                    {...register('employer')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.employer && (
                    <p className="text-red-500 text-sm mt-1">{errors.employer.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    پیمانکار *
                  </label>
                  <input
                    {...register('contractor')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.contractor && (
                    <p className="text-red-500 text-sm mt-1">{errors.contractor.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نوع کارفرما
                  </label>
                  <select
                    {...register('employer_type')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="دولتی">دولتی</option>
                    <option value="خصولتی">خصولتی</option>
                    <option value="شخصی">شخصی</option>
                  </select>
                </div>
              </div>
            </div>

            {/* اطلاعات قرارداد */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                اطلاعات قرارداد
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شماره قرارداد *
                  </label>
                  <input
                    {...register('contract_number', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.contract_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.contract_number.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ردیف قرارداد *
                  </label>
                  <input
                    {...register('contract_row')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.contract_row && (
                    <p className="text-red-500 text-sm mt-1">{errors.contract_row.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ساجات *
                  </label>
                  <input
                    {...register('sajat')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.sajat && (
                    <p className="text-red-500 text-sm mt-1">{errors.sajat.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* تاریخ‌های مهم */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                تاریخ‌های مهم
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ شروع قرارداد *
                  </label>
                  <input
                    {...register('contract_start_date')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.contract_start_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.contract_start_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ ابلاغ قرارداد *
                  </label>
                  <input
                    {...register('contract_notification_date')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.contract_notification_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.contract_notification_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ پایان قرارداد *
                  </label>
                  <input
                    {...register('contract_completion_date')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.contract_completion_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.contract_completion_date.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* اطلاعات مالی */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" />
                اطلاعات مالی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تسویه حساب *
                  </label>
                  <input
                    {...register('account_settlement')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.account_settlement && (
                    <p className="text-red-500 text-sm mt-1">{errors.account_settlement.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ تسویه حساب *
                  </label>
                  <input
                    {...register('as_date')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.as_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.as_date.message}</p>
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
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isSubmitting ? 'در حال ذخیره...' : project ? 'ویرایش' : 'افزودن'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;