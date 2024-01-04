import React, { ComponentProps, ComponentType, useCallback } from 'react';
import { MessageDescriptor } from 'react-intl';

import { ActionTypes } from '~redux';
import { useDialog } from '~shared/Dialog';
import { ActionTransformFnType } from '~utils/actions';

import ActionButton, { ActionButtonProps } from './ActionButton';
import { Appearance } from './Button';

interface Props<D extends ComponentType<any>> extends ActionButtonProps<any> {
  actionType: ActionTypes;
  appearance?: Appearance;
  className?: string;
  dialog: D;
  dialogProps?: Omit<ComponentProps<D>, 'close' | 'cancel'>;
  disabled?: boolean;
  text?: MessageDescriptor | string;
  transform?: ActionTransformFnType;
  values?: any | ((dialogValues: any) => any | Promise<any>);
}

const DialogActionButton = <D extends ComponentType<any>>({
  actionType,
  values: valuesProp = {},
  dialog,
  dialogProps,
  ...props
}: Props<D>) => {
  const openDialog = useDialog(dialog);
  const values = useCallback(async () => {
    const dialogValues = await openDialog(dialogProps).afterClosed();
    if (typeof valuesProp === 'function') return valuesProp(dialogValues);
    return { ...dialogValues, ...valuesProp };
  }, [dialogProps, openDialog, valuesProp]);
  return <ActionButton actionType={actionType} values={values} {...props} />;
};

export default DialogActionButton;
