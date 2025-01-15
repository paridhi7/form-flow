import { BlockType, SpecialBlockType } from "@/app/store/form-builder";

// API types that match Prisma schema
export interface ApiFormBlock {
  id: string;
  formId: string;
  type: BlockType;
  isSpecial: SpecialBlockType | null;
  question: string;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  required: boolean;
  placeholder: string | null;
  options: string[];
  maxLength: number | null;
  minValue: number | null;
  maxValue: number | null;
  maxFileSize: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiForm {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  settings: string;
  blocks: ApiFormBlock[];
}

// Store types (simplified version of API types)
export interface FormBlock {
  id: string;
  type: BlockType;
  isSpecial?: SpecialBlockType;
  question: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  maxFileSize?: number;
}

export interface FormData {
  title: string;
  blocks: FormBlock[];
} 