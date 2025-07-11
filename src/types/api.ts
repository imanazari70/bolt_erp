// Auto-generated types from OpenAPI specification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface Staff {
  id: number;
  staff_id: number;
  role: 'مدیرعامل' | 'کارشناس' | 'مدیر ارشد' | 'مشاور' | 'مدیر واحد' | 'مدیر میانی';
  name: string;
  family: string;
  national_id: number;
  father_name: string;
  birth_date: string;
  id_number: number;
  id_serial: string;
  id_code: number;
  insurance_code: number;
  job_label: string;
  start_date: string;
  leave_date?: string;
  marital_status: 'متاهل' | 'مجرد';
  education_level: string;
  study_field: string;
  home_address: string;
  zip_code: number;
  mobile_phone: string;
  emergency_phone: string;
  home_phone: string;
  recruitment_group: string;
  interview_form?: string;
  contract_form?: string;
  promissory_note?: string;
}

export interface Project {
  id: number;
  project_code: number;
  project_name: string;
  contract_number: number;
  contract_start_date: string;
  contract_notification_date: string;
  contract_completion_date: string;
  employer: string;
  contractor: string;
  service_type: 'بازسازی' | 'مقاوم سازی' | 'طراحی از ابتدا' | 'بازسازی و مقاوم‌سازی' | 'نظارت بر طراحی از ابتدا' | 'نظارت بر مقاوم‌سازی' | 'نظارت بر بازسازی و مقاوم‌سازی' | 'ارزیابی سریع' | 'تحلیل ریسک' | 'خدمات جانبی';
  employer_type: 'دولتی' | 'خصولتی' | 'شخصی';
  sajat: string;
  contract_row: string;
  account_settlement: string;
  as_date: string;
}

export interface Task {
  id: number;
  start_date: string;
  end_date?: string;
  state: 'لغو' | 'در حال انجام' | 'اتمام';
  ded_line: string;
  body: string;
  evaluation: string;
  assignor: number;
  assigned_to: number;
  project: number;
}

export interface TimeSheet {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  description: string;
  mission: boolean;
  mission_duration?: string;
  verified_duration_mission?: string;
  project: number;
  manager: number;
  task: number;
}

export interface Mail {
  id: number;
  employer: string;
  subject: string;
  body: string;
  type: 'صادره' | 'دریافتی';
  attachment?: string;
  cc?: any;
  state: 'بایگانی' | 'حذف' | 'در حال بررسی' | 'انجام شده';
  sender: number;
  receiver: number;
  project: number;
}

export interface Message {
  id: number;
  date: string;
  body: string;
  sender: number;
  receiver: number;
  project: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}