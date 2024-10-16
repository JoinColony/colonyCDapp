import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { type FieldValues } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';

import { useTablet } from '~hooks';
import useAsyncToggle from '~hooks/useAsyncToggle.ts';
import useToggle from '~hooks/useToggle/index.ts';
// import { TX_SEARCH_PARAM } from '~routes/routeConstants.ts';
import { isChildOf } from '~utils/checks/isChildOf.ts';
import { getElementWithSelector } from '~utils/elements.ts';
// import { removeQueryParamFromUrl } from '~utils/urls.ts';

import {
  useAnalyticsContext,
  AnalyticsEventType,
  AnalyticsEventCategory,
  AnalyticsEventAction,
  AnalyticsEventLabel,
  type AnalyticsEvent,
} from '../AnalyticsContext/AnalyticsContext.ts';

import {
  ActionSidebarContext,
  type ActionSidebarContextValue,
} from './ActionSidebarContext.ts';
// import { isElementInsideModalOrPortal } from './utils.ts';

const OPEN_ACTION_PANEL_EVENT: AnalyticsEvent = {
  event: AnalyticsEventType.CUSTOM_EVENT,
  category: AnalyticsEventCategory.ACTION_PANEL,
  action: AnalyticsEventAction.TRIGGER,
  label: AnalyticsEventLabel.OPEN_ACTION_PANEL,
};

const ActionSidebarContextProvider: FC<PropsWithChildren> = ({ children }) => {
  // const [formDirty, setFormDirty] = useState(false);
  const [initialValues, setInitialValues] = useState<FieldValues>();
  // const cancelModalToggle = useToggle();
  // const isTablet = useTablet();

  const { trackEvent } = useAnalyticsContext();
  const {
    isOn,
    turnOn: asyncTurnOn,
    turnOff: asyncTurnOff,
    registerOnBeforeCloseCallback,
    unregisterOnBeforeCloseCallback,
    toggle: asyncToggle,
  } = useAsyncToggle();

  useEffect(() => {
    if (!isOn) {
      setInitialValues(undefined);
    }
  }, [isOn]);

  const show = useCallback(
    (values?: FieldValues) => {
      // setFormDirty(false);
      if (values) {
        setInitialValues(values);
      }
      // Track the event when the action panel is opened
      trackEvent(OPEN_ACTION_PANEL_EVENT);
      return asyncTurnOn();
    },
    [asyncTurnOn, trackEvent],
  );

  const hide = asyncTurnOff;

  const toggle = useCallback(
    (values: FieldValues) => {
      if (!isOn) {
        setInitialValues(values);
      }
      return asyncToggle();
    },
    [asyncToggle, isOn],
  );

  const value = useMemo(
    () => ({
      hide,
      initialValues,
      isShown: isOn,
      registerOnBeforeCloseCallback,
      unregisterOnBeforeCloseCallback,
      show,
      toggle,
    }),
    [
      hide,
      initialValues,
      isOn,
      registerOnBeforeCloseCallback,
      unregisterOnBeforeCloseCallback,
      show,
      toggle,
    ],
  );

  return (
    <ActionSidebarContext.Provider value={value}>
      {children}
    </ActionSidebarContext.Provider>
  );

  // const value = useMemo<ActionSidebarContextValue>(
  //   () => ({
  //     initialValues,
  //     // setFormDirty,
  //   }),
  //   [
  //     initialValues,
  //     actionSidebarRegisterContainerRef,
  //     actionSidebarUseRegisterOnBeforeCloseCallback,
  //     isActionSidebarOpen,
  //     toggle,
  //     hide: asyncTurnOff,
  //     show,
  //   ],
  // );

  // const navigate = useNavigate();

  // const removeTxParamOnClose = useCallback(() => {
  //   navigate(removeQueryParamFromUrl(window.location.href, TX_SEARCH_PARAM), {
  //     replace: true,
  //   });
  // }, [navigate]);

  // FIXME: What did this do??
  // actionSidebarUseRegisterOnBeforeCloseCallback((element) => {
  //   // const isClickedInside = isElementInsideModalOrPortal(element);
  //   const navigationWrapper = getElementWithSelector('.modal-blur-navigation');
  //
  //   if (
  //     // !isClickedInside ||
  //     isChildOf(navigationWrapper, element) &&
  //     !isTablet
  //   ) {
  //     return false;
  //   }
  //
  //   // removeTxParamOnClose();
  //   return undefined;
  // });
};

export default ActionSidebarContextProvider;
