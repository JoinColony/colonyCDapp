import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

// import { useTablet } from '~hooks';
import useAsyncToggle from '~hooks/useAsyncToggle.ts';
// import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
// import useToggle from '~hooks/useToggle/index.ts';
// import { isChildOf } from '~utils/checks/isChildOf.ts';
// import { getElementWithSelector } from '~utils/elements.ts';
// import {
//   FROM_FIELD_NAME,
//   TEAM_FIELD_NAME,
// } from '~v5/common/ActionSidebar/consts.ts';

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
  ActionSidebarMode,
  type ActionSidebarData,
} from './ActionSidebarContext.ts';

interface ActionSidebarState {
  mode: ActionSidebarMode;
  data?: ActionSidebarData;
}

const OPEN_ACTION_PANEL_EVENT: AnalyticsEvent = {
  event: AnalyticsEventType.CUSTOM_EVENT,
  category: AnalyticsEventCategory.ACTION_PANEL,
  action: AnalyticsEventAction.TRIGGER,
  label: AnalyticsEventLabel.OPEN_ACTION_PANEL,
};

const ActionSidebarContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setSidebarState] = useState<ActionSidebarState>({
    mode: ActionSidebarMode.Disabled,
  });
  const { trackEvent } = useAnalyticsContext();
  const {
    isOn,
    turnOn: asyncTurnOn,
    turnOff: asyncTurnOff,
    registerOnBeforeCloseCallback,
    unregisterOnBeforeCloseCallback,
  } = useAsyncToggle();

  // FIXME: Make sure this still works: https://github.com/JoinColony/colonyCDapp/commit/4fa9c231b56f3fb739d6d10e45dc68045f338b72#diff-9efccd0ad0f7a80cfc8fa9fcfd10a7d79f5da9509db0904aed944842370df100
  // FIXME: Peel this from the 520 files changed PR, it introduces another solution
  // const removeTxParamOnClose = useCallback(() => {
  //   navigate(removeQueryParamFromUrl(window.location.href, TX_SEARCH_PARAM), {
  //     replace: true,
  //   });
  // }, [navigate]);
  //
  // actionSidebarUseRegisterOnBeforeCloseCallback((element) => {
  //   const isClickedInside = isElementInsideModalOrPortal(element);
  //   const navigationWrapper = getElementWithSelector('.modal-blur-navigation');
  //
  //   if (
  //     !isClickedInside ||
  //     (isChildOf(navigationWrapper, element) && !isTablet)
  //   ) {
  //     return false;
  //   }
  //
  //   removeTxParamOnClose();
  //   return undefined;
  // });

  // FIXME: We should use this in the setInitialValues function
  // As these need to be added to the initial values
  // const selectedDomain = useGetSelectedDomainFilter();
  // const selectedDomainNativeId = selectedDomain?.nativeId ?? '';
  // const getSidebarInitialValues = useCallback(
  //   (values = {}) => ({
  //     [FROM_FIELD_NAME]: selectedDomainNativeId,
  //     [TEAM_FIELD_NAME]: selectedDomainNativeId,
  //     ...values,
  //   }),
  //   [selectedDomainNativeId],
  // );

  const showActionSidebar = useCallback(
    (mode: ActionSidebarMode, data?: ActionSidebarData) => {
      setSidebarState({
        mode,
        data,
      });
      // Track the event when the action panel is opened
      trackEvent(OPEN_ACTION_PANEL_EVENT);
      return asyncTurnOn();
    },
    [asyncTurnOn, trackEvent],
  );

  const hideActionSidebar = useCallback(() => {
    setSidebarState({ mode: ActionSidebarMode.Disabled });
    return asyncTurnOff();
  }, [asyncTurnOff]);

  const value = useMemo(
    () => ({
      data: state.data || {},
      hideActionSidebar,
      isActionSidebarOpen: isOn,
      mode: state.mode,
      registerOnBeforeCloseCallback,
      unregisterOnBeforeCloseCallback,
      showActionSidebar,
    }),
    [
      hideActionSidebar,
      isOn,
      registerOnBeforeCloseCallback,
      unregisterOnBeforeCloseCallback,
      showActionSidebar,
      state,
    ],
  );

  return (
    <ActionSidebarContext.Provider value={value}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export default ActionSidebarContextProvider;
