export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  petName: string;
}

export interface TransformationResult {
  originalId: string;
  generatedImageUrl: string | null;
  status: 'idle' | 'queued' | 'loading' | 'success' | 'error';
  error?: string;
}

export interface PetTransformationState {
  uploads: UploadedImage[];
  results: Record<string, TransformationResult>;
}