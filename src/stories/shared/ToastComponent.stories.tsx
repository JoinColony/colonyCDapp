import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import clsx from 'clsx';
import ToastComponent from '~shared/Extensions/Toast/Toast';
import CloseButton from '~shared/Extensions/Toast/partials/CloseButton';
import styles from '~components/shared/Extensions/Toast/Toast.module.css';

const meta: Meta<typeof ToastComponent> = {
  title: 'Shared/Toast',
  component: ToastComponent,
};

export default meta;
type Story = StoryObj<typeof ToastComponent>;

const ToastComponentWithHooks = (args) => {
  const notify = () => toast(<ToastComponent {...args} />);

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
        autoClose={false}
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
    <ToastComponentWithHooks
      type="success"
      title="Confirm"
      description="Information about the action performed"
      linkName="Button"
    />
  ),
};

export const Alert: Story = {
  render: () => (
    <ToastComponentWithHooks type="alert" title="Alert" description="Information about the alert" linkName="Button" />
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastComponentWithHooks
      type="warning"
      title="Warning"
      description="Information about the warning"
      linkName="Button"
    />
  ),
};
