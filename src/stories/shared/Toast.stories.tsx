import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Toast from '~shared/Extensions/Toast/Toast';
import styles from '~shared/Extensions/Toast/Toast.module.css';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';

const meta: Meta<typeof Toast> = {
  title: 'Shared/Toast',
  component: Toast,
};

export default meta;
type Story = StoryObj<typeof Toast>;

const ToastWithHooks = (args) => {
  const { type } = args;
  const notify = () => toast[type](<Toast {...args} />);

  return (
    <Router>
      <button type="button" aria-label="Open toast" onClick={notify}>
        Notify!
      </button>
      <ToastContainer
        className={styles.toastNotification}
        autoClose={3000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        closeButton={CloseButton}
      />
    </Router>
  );
};

export const Success: Story = {
  args: {
    type: 'success',
  },
  render: () => (
    <ToastWithHooks
      type="success"
      title="Confirm"
      description="Information about the action performed"
      linkName="Button"
    />
  ),
};

export const Alert: Story = {
  args: {
    type: 'warn',
  },
  render: () => (
    <ToastWithHooks type="warn" title="Alert" description="Information about the alert" linkName="Button" />
  ),
};

export const Warning: Story = {
  args: {
    type: 'error',
  },
  render: () => (
    <ToastWithHooks type="error" title="Warning" description="Information about the warning" linkName="Button" />
  ),
};
