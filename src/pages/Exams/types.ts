export type ExamStatus = "Active" | "Draft" | "Closed";
export type ExamType = "MCQ Only" | "Coding Only" | "Image Analysis";

export interface ExamItem {
  id: number;
  title: string;
  type: string;
  questions: number;
  duration: string;
  enrolled: number;
  date: string;
  status: ExamStatus;
  description?: string;
  totalMarks?: number;
  passingScore?: number;
}

export interface CourseItem {
  id: number;
  name: string;
  availableExams: number;
  totalExams: number;
  activeExams: number;
  totalStudents: number;
  exams: ExamItem[];
}

export interface FormErrors {
  [key: string]: string;
}

export interface McqQuestion {
  id: number;
  type: "MCQ";
  questionText: string;
  options: string[];
  optionIds?: (number | null)[];
  correctAnswer: number | null;
  marks: number;
}

export interface TestCase {
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
  weightage?: number;
  time_limit?: number;
}

export interface CodingQuestion {
  id: number;
  backendId?: number;
  type: "Coding";
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  marks: number;
  difficulty: string;
  timeLimit: number;
  description: string;
  isSaved?: boolean;
  testCases?: TestCase[];
}

export interface ImageAnalysisQuestion {
  id: number;
  type: "Image Analysis";
  questionText: string;
  imageUrl: string;
  analysisInstructions: string;
  marks: number;
}

export type QuestionItem = McqQuestion | CodingQuestion | ImageAnalysisQuestion;

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
}

export interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
}

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}

export interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
}
