export type TabType = "personal" | "security" | "notifications" | "activity";

export interface NotificationSettings {
  emailNotifications: boolean;
  newStudentRegistrations: boolean;
  examSubmissions: boolean;
  paymentUpdates: boolean;
  systemUpdates: boolean;
  weeklyReports: boolean;
}

export interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export interface InputFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SessionCardProps {
  icon: React.ReactNode;
  iconBg: string;
  device: string;
  location: string;
  time: string;
  badgeText: string;
  badgeClass: string;
}

export interface NotificationRowProps {
  title: string;
  subtitle: string;
  checked: boolean;
  onToggle: () => void;
}

export interface ActivityRowProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
  ip: string;
}
