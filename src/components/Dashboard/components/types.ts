export interface DashboardItem {
  RecordCount: number;
  Description: string;
  Panel: string;
  PanelId: number;
  iconpath: string;
  service_status: string;
  source?: 'api' | 'static';
}

export interface TaskItem {
  RowNumber: number;
  RecordCount: number;
  sr_no?: number;
  emp_num?: number;
  tid: number;
  pg_id: number;
  name_eng: string;
  from_doe: string;
  to_doe: string;
  task: string;
  days: number;
  tdate: string;
  responsible_person: string;
  completed: string;
  not_comp_reason: string | null;
  confirm_by_name: string | null;
  due_task_date?: string;
  revertcount?: string;
  attachmentdneed?: boolean;
  video_url?: string | null;
  cdate?: string;
  reasondtl?: string;
  taskremakrs?: string | null;
  taskfiles?: string | null;
}

export interface StaticTaskRow {
  id: string;
  title: string;
  subTitle: string;
  department: string;
  status: string;
}
