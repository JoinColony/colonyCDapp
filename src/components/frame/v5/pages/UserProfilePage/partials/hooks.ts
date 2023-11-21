import { useIntl } from 'react-intl';
import { useFormatFormats } from '~v5/common/AvatarUploader/hooks';
import { FileUploadOptions } from '~v5/common/AvatarUploader/types';

export const useGetUploaderText = (fileOptions: FileUploadOptions) => {
  const { formatMessage } = useIntl();

  const { fileDimension, fileFormat, fileSize } = fileOptions;

  const formattedFormats = useFormatFormats(fileFormat);

  return formatMessage(
    { id: 'avatar.uploader.info' },
    {
      format: formattedFormats,
      dimension: fileDimension,
      size: fileSize,
    },
  );
};
