import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NotificationBanner from '~common/Extensions/NotificationBanner/NotificationBanner';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';

const meta: Meta<typeof NotificationBanner> = {
  title: 'Common/Notification Banner',
  component: NotificationBanner,
};

export default meta;
type Story = StoryObj<typeof NotificationBanner>;

const NotificationBannerWithHooks = (args) => {
  const { handleClipboardCopy } = useCopyToClipboard('text');

  return <NotificationBanner {...args} handleClipboardCopy={handleClipboardCopy} />;
};

export const Success: Story = {
  render: () => (
    <NotificationBannerWithHooks
      status="success"
      title="The required permissions have been updated. You can now enable the extension."
      actionText="Enable extension"
      actionType="call-to-action"
    />
  ),
};

export const Warning: Story = {
  render: () => (
    <NotificationBannerWithHooks
      status="warning"
      title="There is no reputation in this team yet"
      actionText="https://external-url.pl"
      actionType="redirect"
    >
      Reputation is generated by making payments to members with this colony’s native token.
    </NotificationBannerWithHooks>
  ),
};

export const Error: Story = {
  render: () => (
    <NotificationBannerWithHooks
      status="error"
      title="The Colony is missing permissions required for this extensions"
      actionText="http://example-url.pl"
      isFullSize={false}
      actionType="copy-url"
    />
  ),
};
