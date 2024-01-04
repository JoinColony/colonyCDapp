import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import NotificationBanner from './NotificationBanner';
import { NotificationBannerProps } from './types';

const meta: Meta<typeof NotificationBanner> = {
  title: 'Common/Notification Banner ',
  component: NotificationBanner,
  argTypes: {
    status: {
      name: 'status',
      options: ['success', 'error', 'warning', 'info'],
      control: {
        type: 'select',
      },
    },
    children: {
      name: 'children',
      control: 'text',
    },
    icon: {
      name: 'Icon',
      control: 'text',
    },
    description: {
      name: 'Description',
      control: 'text',
    },
    callToAction: {
      name: 'Call to Action',
      control: 'text',
    },
  },
  args: {
    status: 'success',
    children: 'This is a test title',
    icon: 'check-circle',
    description: 'Lorem ipsum dolor sit amet',
    callToAction: 'Click me!',
  },
};

const Template: StoryFn<NotificationBannerProps> = (args) => (
  <NotificationBanner {...args} />
);

export const Success = Template.bind({});
Success.args = {
  status: 'success',
  children: 'This is a test title',
  icon: 'check-circle',
  description: 'Lorem ipsum dolor sit amet',
};

export const Error = Template.bind({});
Error.args = {
  status: 'error',
  children: 'This is a test title',
  icon: 'warning-circle',
  description: 'Lorem ipsum dolor sit amet',
};

export const Warning = Template.bind({});
Warning.args = {
  status: 'warning',
  children: 'This is a test title',
  icon: 'warning-circle',
  description: 'Lorem ipsum dolor sit amet',
};

export const Info = Template.bind({});
Info.args = {
  status: 'info',
  children: 'This is a test title',
  icon: 'info',
  description: 'Lorem ipsum dolor sit amet',
};

export default meta;
