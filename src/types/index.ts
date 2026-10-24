export type CitizenRole =
  | 'Student'
  | 'Farmer'
  | 'Worker'
  | 'Senior Citizen'
  | 'Person with Disability';

export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

export interface UserProfile {
  fullName: string;
  role: CitizenRole;
  state: string;
  district: string;
  socialCategory: SocialCategory;
  annualIncome: string;
  rationCard: string;
  gender: string;
  roleProofNumber: string;
  phone?: string;
  email?: string;
  isAuthenticated: boolean;
}

export interface Language {
  code: string;
  bcp47: string;
  name: string;
  nativeName: string;
  isRTL?: boolean;
}

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  placeholder?: string;
  options?: string[];
  required: boolean;
  vaultDocType?: string; // Auto-fill source from Document Vault
  defaultValue?: string;
}

export interface Scheme {
  id: string;
  title: string;
  role: CitizenRole;
  states: string[] | 'ALL';
  districts?: string[] | 'ALL';
  department: string;
  benefitAmount: string;
  deadline: string;
  description: string;
  eligibility: string[];
  requiredDocs: string[];
  officialPortalUrl: string;
  categoryTag: string;
  isStateSpecific: boolean;
  formFields: FormFieldDefinition[];
}

export type DocumentStatus = 'Uploaded' | 'Verified' | 'Expiring soon' | 'Not uploaded' | 'Expired';

export interface DocumentItem {
  id: string;
  name: string;
  code: string;
  requiredForRoles: CitizenRole[];
  status: DocumentStatus;
  fileName?: string;
  uploadDate?: string;
  expiryDate?: string;
  verifiedBy?: string;
  fileSize?: string;
  enableExpiryReminder?: boolean;
  vaultData?: Record<string, string>; // extracted fields for AssistFill
}

export interface ConsentItem {
  id: string;
  department: string;
  purpose: string;
  accessedFields: string[];
  retentionPeriod: string;
  status: 'Allowed' | 'Denied' | 'Revoked';
  lastAccessed: string;
}

export interface NextStepTask {
  id: string;
  title: string;
  schemeTitle?: string;
  urgency: 'Overdue' | 'Due soon' | 'Upcoming' | 'Optional';
  dueDate: string;
  completed: boolean;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
  isVoice?: boolean;
  suggestedSchemeId?: string;
}

export interface SubmissionReceipt {
  applicationId: string;
  schemeId: string;
  schemeTitle: string;
  submittedAt: string;
  applicantName: string;
  role: CitizenRole;
  state: string;
  district: string;
  attachedDocs: string[];
  formData: Record<string, string>;
  status: 'Submitted - Pending Officer Verification' | 'Approved' | 'In Review';
}
