import React from 'react';

import FileUpload from '~v5/common/AvatarUploader/partials/FileUpload.tsx';

import type { Meta, StoryObj } from '@storybook/react';

const fileUploadMeta: Meta<typeof FileUpload> = {
  title: 'Common/File Upload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[36.5rem]">
        <Story />
      </div>
    ),
  ],
};

export default fileUploadMeta;

export const Base: StoryObj<typeof FileUpload> = {
  args: {
    fileOptions: {
      fileFormat: ['.csv', '.jpg', '.png'],
      fileDimension: '120x120px',
      fileSize: '1MB',
    },
  },
};

export const WithSimplifiedUploader: StoryObj<typeof FileUpload> = {
  args: {
    isSimplified: true,
    fileOptions: {
      fileFormat: ['.csv'],
      fileDimension: '120x120px',
      fileSize: '1MB',
    },
  },
};
