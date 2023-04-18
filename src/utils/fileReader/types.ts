import { Accept } from 'react-dropzone';

export interface FileReaderFile extends Pick<File, 'name' | 'type' | 'size' | 'lastModified'> {
  uploadDate: number;
  data: string;
  file: File;
}

export interface FileReaderOptions {
  maxFilesLimit: number;
  maxFileSize: number;
  allowedTypes: Accept;
  fileReadingFn: (reader: FileReader, file: File | Blob) => void;
}
