import { type FileRejection } from 'react-dropzone';
import { defineMessages } from 'react-intl';

export const getFileRejectionErrors = (rejectedFiles: FileRejection[]) => {
  return rejectedFiles.map((file) => file.errors);
};

export const displayName = 'v5.common.AvatarUploader';

const MSG = defineMessages({
  fileCompressionError: {
    id: `${displayName}.fileCompressionError`,
    defaultMessage:
      'File could not be uploaded and may be corrupted. Try again with a different file.',
  },
  fingerprintError: {
    id: `${displayName}.fingerprintError`,
    defaultMessage:
      'Your browser blocked the upload. Check if fingerprint blocking is enabled and temporarily disable it before trying again.',
  },
  fileSizeError: {
    id: `${displayName}.fileSizeError`,
    defaultMessage: 'File size is too large, it should not exceed 1MB',
  },
  fileTypeError: {
    id: `${displayName}.fileTypeError`,
    defaultMessage: 'Incorrect file format, must be .PNG, .JPG, or .SVG',
  },
  customError: {
    id: `${displayName}.customError`,
    defaultMessage: 'Upload failed, please try again',
  },
  wrongStructure: {
    id: `${displayName}.wrongStructure`,
    defaultMessage: 'File structure is incorrect, please try again',
  },
  wrongRecipient: {
    id: `${displayName}.wrongRecipient`,
    defaultMessage: 'Recipient address is incorrect, please try again',
  },
  fileMinDimensionsError: {
    id: `${displayName}.fileMinDimensionsError`,
    defaultMessage: 'Image dimensions should be at least 120x120px',
  },
});

/**
 * Dropzone errors from the source code: https://github.com/react-dropzone/react-dropzone/blob/master/src/utils/index.js
 * With the addition of "Custom" so that we can pass a custom error to the AvatarUploader component,
 * And "Default" to use the default message defined in this file (fileCompressionError).
 */
export enum DropzoneErrors {
  INVALID = 'file-invalid-type',
  TOO_LARGE = 'file-too-large',
  // TOO_SMALL = 'file-too-small', // wire in as needed
  // TOO_MANY = 'too-many-files',
  STRUCTURE = 'wrong-structure',
  CUSTOM = 'custom-error',
  DEFAULT = 'default',
  FINGERPRINT_ENABLED = 'fingerprint-enabled',
  DIMENSIONS_TOO_SMALL = 'dimensions-too-small',
}

/**
 * For a common set of error messages you can expect from the Avatar Uploader.
 * To pass a custom error message, don't extend this function. Instead, pass it directly to the
 * the AvatarUploader component.
 */
export const getErrorMessage = (errorCode: DropzoneErrors) => {
  switch (errorCode) {
    case DropzoneErrors.INVALID: {
      return MSG.fileTypeError;
    }
    case DropzoneErrors.TOO_LARGE: {
      return MSG.fileSizeError;
    }
    case DropzoneErrors.CUSTOM: {
      return MSG.customError;
    }
    case DropzoneErrors.STRUCTURE: {
      return MSG.wrongStructure;
    }
    case DropzoneErrors.FINGERPRINT_ENABLED: {
      return MSG.fingerprintError;
    }
    case DropzoneErrors.DIMENSIONS_TOO_SMALL: {
      return MSG.fileMinDimensionsError;
    }

    /* Extend here with too-small and too-many as needed */

    default: {
      return MSG.fileCompressionError;
    }
  }
};

export const DEFAULT_MIME_TYPES = {
  'image/svg+xml': [],
  'image/png': [],
  'image/jpeg': [],
  'image/webp': [],
};

export const DEFAULT_MAX_FILE_SIZE = 1048576; // 1MB

export const DEFAULT_MAX_FILE_LIMIT = 10;

export const DEFAULT_MIN_FILE_DIMENSIONS = {
  width: 120,
  height: 120,
};

export const validateMinimumFileDimensions = (
  file: File,
  minWidth = DEFAULT_MIN_FILE_DIMENSIONS.width,
  minHeight = DEFAULT_MIN_FILE_DIMENSIONS.height,
): Promise<boolean> => {
  const unexpectedErrorMessage =
    'An error occurred while verifying minimum dimensions';

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error(unexpectedErrorMessage));
    };

    reader.onload = (e) => {
      const result = e.target?.result;

      if (!result) {
        reject(new Error(unexpectedErrorMessage));

        return;
      }

      img.src = result as string;
    };

    img.onload = () => {
      if (img.width < minWidth || img.height < minHeight) {
        reject(new Error(DropzoneErrors.DIMENSIONS_TOO_SMALL));
      } else {
        resolve(true);
      }
    };

    img.onerror = () => {
      reject(new Error(unexpectedErrorMessage));
    };

    reader.readAsDataURL(file);
  });
};
