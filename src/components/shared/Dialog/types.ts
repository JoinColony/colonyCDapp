import { ComponentType } from 'react';

import { EnabledExtensionData } from '~hooks/useEnabledExtensions';

import { Colony } from '~types';

type Cancel = () => void;

type Close = (val?: any) => void;

export interface DialogProps {
  cancel: Cancel;
  close: Close;
  prevStep?: string;
}

export interface DialogType<P> {
  Dialog: ComponentType<P>;
  cancel: Cancel;
  close: Close;
  key: string;
  props: P | undefined;
  afterClosed: () => Promise<any>;
}

export interface ActionDialogProps {
  colony: Colony;
  enabledExtensionData: EnabledExtensionData;
  back?: () => void;
}
