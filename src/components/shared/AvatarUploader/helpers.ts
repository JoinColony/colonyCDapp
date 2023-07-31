import { defineMessages } from 'react-intl';

const displayName = 'AvatarUploader';

const MSG = defineMessages({
  fileCompressionError: {
    id: `${displayName}.fileCompressionError`,
    defaultMessage:
      'File could not be uploaded and may be corrupted. Try again with a different file.',
  },
  fileSizeError: {
    id: `${displayName}.fileSizeError`,
    defaultMessage: 'File is too large. Try again with a smaller image',
  },
  fileTypeError: {
    id: `${displayName}.fileTypeError`,
    defaultMessage:
      'Unsupported file type. Accepted file types are: svg, jpg, png and webp',
  },
  customError: {
    id: `${displayName}.customError`,
    defaultMessage: '{message}',
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
  CUSTOM = 'custom-error',
  DEFAULT = 'default',
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

    /* Extend here with too-small and too-many as needed */

    default: {
      return MSG.fileCompressionError;
    }
  }
};
