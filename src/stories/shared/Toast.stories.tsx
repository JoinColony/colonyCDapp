import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import Toast from '~shared/Extensions/Toast/Toast';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~components/shared/Extensions/Toast/Toast.module.css';

const meta: Meta<typeof Toast> = {
  title: 'Shared/Toast',
  component: Toast,
};

export default meta;
type Story = StoryObj<typeof Toast>;

const ToastWithHooks = (args) => {
  const notify = () => toast(<Toast {...args} />);

  return (
    <Router>
      <button type="button" onClick={notify}>
        Notify!
      </button>
      <ToastContainer
        className={clsx(styles.toastify, {
          // eslint-disable-next-line react/destructuring-assignment
          '[&>div]:border-l-success-400 [&>div]:border-l-4': args?.type === 'success',
          // eslint-disable-next-line react/destructuring-assignment
          '[&>div]:border-l-warning-400 [&>div]:border-l-4': args?.type === 'alert',
          // eslint-disable-next-line react/destructuring-assignment
          '[&>div]:border-l-negative-400 [&>div]:border-l-4': args?.type === 'warning',
        })}
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
  render: () => (
    <ToastWithHooks type="alert" title="Alert" description="Information about the alert" linkName="Button" />
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastWithHooks type="warning" title="Warning" description="Information about the warning" linkName="Button" />
  ),
};
