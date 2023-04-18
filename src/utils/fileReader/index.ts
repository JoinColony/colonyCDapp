import { DEFAULT_MAX_FILE_LIMIT, DEFAULT_MAX_FILE_SIZE, DEFAULT_MIME_TYPES } from '~shared/FileUpload/limits';
import { FileReaderFile, FileReaderOptions } from './types';

const fileReaderFactory = (options?: Partial<FileReaderOptions>) => {
  function defaultFileReadingFunction(reader: FileReader, file: File | Blob) {
    reader.readAsDataURL(file);
  }

  const config: FileReaderOptions = {
    maxFileSize: DEFAULT_MAX_FILE_SIZE,
    maxFilesLimit: DEFAULT_MAX_FILE_LIMIT,
    allowedTypes: DEFAULT_MIME_TYPES,
    fileReadingFn: defaultFileReadingFunction,
    ...options,
  };

  function hasValidType(file: File) {
    return !Object.keys(config.allowedTypes).includes(file.type);
  }

  function hasInvalidFileSize(file: File) {
    return file && config.maxFileSize && file.size > config.maxFileSize;
  }

  function readFile(file: File | Blob): Promise<FileReaderFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        if (!evt || !evt.target || !evt.target.result) {
          reject(new Error('An unexpected error occurred while trying to read the file sent.'));
        }

        const { type, size } = file;
        let name: File['name'] | undefined;
        let lastModified: File['lastModified'] | undefined;

        if (file instanceof File) {
          name = file.name;
          lastModified = file.lastModified;
        }

        resolve({
          name,
          type,
          size,
          lastModified,
          uploadDate: Date.now(),
          data: evt.target.result,
          file,
        } as FileReaderFile);
      };

      config.fileReadingFn(reader, file);
    });
  }

  return async function fileReader(files: (File | Blob)[]) {
    if (!files) {
      throw new Error('An unexpected input was given, should receive files to upload.');
    }

    if (config.maxFilesLimit && files.length > config.maxFilesLimit) {
      throw new Error(`You can only have ${config.maxFilesLimit} or fewer attached file(s)`);
    }

    const sizeValidationErrors = files.filter(hasInvalidFileSize);
    if (sizeValidationErrors && sizeValidationErrors.length) {
      const fileSize = config.maxFileSize / (1024 * 1024);
      throw new Error(`Please provide files that is smaller or equal to ${fileSize}MB`);
    }

    const allowedTypesValidationErrors = files.filter(hasValidType);
    if (allowedTypesValidationErrors && allowedTypesValidationErrors.length) {
      const allowedTypes = Object.keys(config.allowedTypes).join(', ');
      throw new Error(`Only types: ${allowedTypes} are allowed to be uploaded.`);
    }

    const fileReaderFiles = files.map(readFile);
    return Promise.all(fileReaderFiles);
  };
};

export default fileReaderFactory;
