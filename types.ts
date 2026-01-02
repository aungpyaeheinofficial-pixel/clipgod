
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CODE = 'CODE',
  PREVIEW = 'PREVIEW',
  DOCS = 'DOCS'
}

export interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export interface VideoMetadata {
  url: string;
  title: string;
  thumbnail: string;
  duration: string;
}
