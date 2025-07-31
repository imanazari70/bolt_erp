import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X, User, Briefcase, Phone, GraduationCap, MapPin, FileText } from 'lucide-react';
import { staffApi } from '../../services/api';
import { Staff } from '../../types/api';

const schema = yup.object({
  staff_id: yup.number().required('کد پرسنلی الزامی است').positive('کد پرسنلی باید مثبت باشد'),
  name: yup.string().required('نام الزامی است').min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  family: yup.string().required('نام خانوادگی الزامی است').min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد'),
  national_id: yup.number().required('کد ملی الزامی است').positive('کد ملی باید مثبت باشد'),
  father_name: yup.string().required('نام پدر الزامی است'),
  birth_date: yup.string().required('تاریخ تولد الزامی است'),
  id_number: yup.number().required('شماره شناسنامه الزامی است').positive(),
  id_serial: yup.string().required('سریال شناسنامه الزامی است'),
  id_code: yup.number().required('کد شناسنامه الزامی است').positive(),
  insurance_code: yup.number().required('کد بیمه الزامی است').positive(),
  job_label: yup.string().required('عنوان شغلی الزامی است'),
  start_date: yup.string().required('تاریخ شروع به کار الزامی است'),
  mobile_phone: yup.string().required('شماره همراه الزامی است'),
  emergency_phone: yup.string().required('تلفن اضطراری الزامی است'),
  home_phone: yup.string().required('تلفن منزل الزامی است'),
  education_level: yup.string().required('سطح تحصیلات الزامی است'),
  study_field: yup.string().required('رشته تحصیلی الزامی است'),
  home_address: yup.string().required('آدرس منزل الزامی است'),
  zip_code: yup.number().required('کد پستی الزامی است').positive(),
  recruitment_group: yup.string().required('گروه پرسنلی الزامی است'),
});

interface StaffFormProps {
  staff?: Staff;
  onClose: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ staff, onClose }) => {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: staff || {
      role: 'کارشناس',
      marital_status: 'مجرد',
    }
  });

  const createMutation = useMutation({
    mutationFn: staffApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('کارمند با موفقیت اضافه شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در افزودن کارمند');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Staff> }) => 
      staffApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('کارمند با موفقیت ویرایش شد');
      onClose();
    },
    onError: () => {
      toast.error('خطا در ویرایش کارمند');
    }
  });

  const onSubmit = (data: any) => {
    if (staff) {
      updateMutation.mutate({ id: staff.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <User className="w-7 h-7" />
            {staff ? 'ویرایش کارمند' : 'افزودن کارمند جدید'}
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
            {/* اطلاعات شخصی */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                اطلاعات شخصی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کد پرسنلی *
                  </label>
                  <input
                    {...register('staff_id', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.staff_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.staff_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نام *
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نام خانوادگی *
                  </label>
                  <input
                    {...register('family')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.family && (
                    <p className="text-red-500 text-sm mt-1">{errors.family.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کد ملی *
                  </label>
                  <input
                    {...register('national_id', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.national_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.national_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نام پدر *
                  </label>
                  <input
                    {...register('father_name')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.father_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.father_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ تولد *
                  </label>
                  <input
                    {...register('birth_date')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.birth_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.birth_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وضعیت تاهل
                  </label>
                  <select
                    {...register('marital_status')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="مجرد">مجرد</option>
                    <option value="متاهل">متاهل</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نقش
                  </label>
                  <select
                    {...register('role')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="مدیرعامل">مدیرعامل</option>
                    <option value="کارشناس">کارشناس</option>
                    <option value="مدیر ارشد">مدیر ارشد</option>
                    <option value="مشاور">مشاور</option>
                    <option value="مدیر واحد">مدیر واحد</option>
                    <option value="مدیر میانی">مدیر میانی</option>
                  </select>
                </div>
              </div>
            </div>

            {/* اطلاعات شغلی */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                اطلاعات شغلی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان شغلی *
                  </label>
                  <input
                    {...register('job_label')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.job_label && (
                    <p className="text-red-500 text-sm mt-1">{errors.job_label.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ شروع به کار *
                  </label>
                  <input
                    {...register('start_date')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاریخ ترک کار
                  </label>
                  <input
                    {...register('leave_date')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    گروه پرسنلی *
                  </label>
                  <input
                    {...register('recruitment_group')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.recruitment_group && (
                    <p className="text-red-500 text-sm mt-1">{errors.recruitment_group.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کد بیمه *
                  </label>
                  <input
                    {...register('insurance_code', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.insurance_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.insurance_code.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* اطلاعات تماس */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-600" />
                اطلاعات تماس
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شماره همراه *
                  </label>
                  <input
                    {...register('mobile_phone')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.mobile_phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile_phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تلفن منزل *
                  </label>
                  <input
                    {...register('home_phone')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.home_phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.home_phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تلفن اضطراری *
                  </label>
                  <input
                    {...register('emergency_phone')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.emergency_phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.emergency_phone.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    آدرس منزل *
                  </label>
                  <textarea
                    {...register('home_address')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.home_address && (
                    <p className="text-red-500 text-sm mt-1">{errors.home_address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کد پستی *
                  </label>
                  <input
                    {...register('zip_code', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.zip_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.zip_code.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* اطلاعات تحصیلی */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                اطلاعات تحصیلی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    سطح تحصیلات *
                  </label>
                  <input
                    {...register('education_level')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.education_level && (
                    <p className="text-red-500 text-sm mt-1">{errors.education_level.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رشته تحصیلی *
                  </label>
                  <input
                    {...register('study_field')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.study_field && (
                    <p className="text-red-500 text-sm mt-1">{errors.study_field.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* اطلاعات شناسایی */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                اطلاعات شناسایی
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شماره شناسنامه *
                  </label>
                  <input
                    {...register('id_number', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.id_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.id_number.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    سریال شناسنامه *
                  </label>
                  <input
                    {...register('id_serial')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.id_serial && (
                    <p className="text-red-500 text-sm mt-1">{errors.id_serial.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کد شناسنامه *
                  </label>
                  <input
                    {...register('id_code', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  {errors.id_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.id_code.message}</p>
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
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isSubmitting ? 'در حال ذخیره...' : staff ? 'ویرایش' : 'افزودن'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;