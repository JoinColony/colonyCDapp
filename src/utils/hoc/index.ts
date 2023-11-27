import { ComponentType, createElement, forwardRef, Ref } from 'react';

export interface ForwardedRefProps {
  forwardedRef: Ref<any>;
}

export const withForwardingRef = <Props extends Record<string, any>>(
  BaseComponent: ComponentType<Props>,
) =>
  forwardRef<ForwardedRefProps, Props>((props, ref) =>
    createElement(BaseComponent, { ...props, forwardedRef: ref }),
  );
