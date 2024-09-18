import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { type FieldValues } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useTablet } from '~hooks';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import useToggle from '~hooks/useToggle/index.ts';
import { TX_SEARCH_PARAM } from '~routes/routeConstants.ts';
import { isChildOf } from '~utils/checks/isChildOf.ts';
import { getElementWithSelector } from '~utils/elements.ts';
import { removeQueryParamFromUrl } from '~utils/urls.ts';
import {
  FROM_FIELD_NAME,
  TEAM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';

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
import { isElementInsideModalOrPortal } from './utils.ts';

const OPEN_ACTION_PANEL_EVENT: AnalyticsEvent = {
  event: AnalyticsEventType.CUSTOM_EVENT,
  category: AnalyticsEventCategory.ACTION_PANEL,
  action: AnalyticsEventAction.TRIGGER,
  label: AnalyticsEventLabel.OPEN_ACTION_PANEL,
};

const ActionSidebarContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [actionSidebarInitialValues, setActionSidebarInitialValues] =
    useState<FieldValues>();
  const cancelModalToggle = useToggle();
  const isTablet = useTablet();
  const [
    isActionSidebarOpen,
    {
      toggle: toggleActionSidebar,
      toggleOn: toggleActionSidebarOn,
      toggleOff: toggleActionSidebarOff,
      useRegisterOnBeforeCloseCallback:
        actionSidebarUseRegisterOnBeforeCloseCallback,
      registerContainerRef: actionSidebarRegisterContainerRef,
    },
  ] = useToggle();
  const { trackEvent } = useAnalyticsContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const selectedDomainNativeId = selectedDomain?.nativeId ?? '';
  const navigate = useNavigate();

  const removeTxParamOnClose = useCallback(() => {
    navigate(removeQueryParamFromUrl(window.location.href, TX_SEARCH_PARAM), {
      replace: true,
    });
  }, [navigate]);

  actionSidebarUseRegisterOnBeforeCloseCallback((element) => {
    const isClickedInside = isElementInsideModalOrPortal(element);
    const navigationWrapper = getElementWithSelector('.modal-blur-navigation');

    if (
      !isClickedInside ||
      (isChildOf(navigationWrapper, element) && !isTablet)
    ) {
      return false;
    }

    removeTxParamOnClose();
    return undefined;
  });

  const getSidebarInitialValues = useCallback(
    (initialValues = {}) => ({
      [FROM_FIELD_NAME]: selectedDomainNativeId,
      [TEAM_FIELD_NAME]: selectedDomainNativeId,
      ...initialValues,
    }),
    [selectedDomainNativeId],
  );

  const toggleOn = useCallback(
    (initialValues) => {
      setActionSidebarInitialValues(getSidebarInitialValues(initialValues));
      // Track the event when the action panel is opened
      trackEvent(OPEN_ACTION_PANEL_EVENT);
      return toggleActionSidebarOn();
    },
    [getSidebarInitialValues, toggleActionSidebarOn, trackEvent],
  );

  const toggleOff = useCallback((): void => {
    removeTxParamOnClose();
    toggleActionSidebarOff();
  }, [toggleActionSidebarOff, removeTxParamOnClose]);

  const toggle = useCallback(
    (initialValues): void => {
      if (!isActionSidebarOpen) {
        setActionSidebarInitialValues(getSidebarInitialValues(initialValues));
      }
      toggleActionSidebar();
    },
    [isActionSidebarOpen, getSidebarInitialValues, toggleActionSidebar],
  );

  const value = useMemo<ActionSidebarContextValue>(
    () => ({
      actionSidebarToggle: [
        isActionSidebarOpen,
        {
          toggleOn,
          toggleOff,
          toggle,
          useRegisterOnBeforeCloseCallback:
            actionSidebarUseRegisterOnBeforeCloseCallback,
          registerContainerRef: actionSidebarRegisterContainerRef,
        },
      ],
      cancelModalToggle,
      actionSidebarInitialValues,
    }),
    [
      actionSidebarInitialValues,
      actionSidebarRegisterContainerRef,
      actionSidebarUseRegisterOnBeforeCloseCallback,
      cancelModalToggle,
      isActionSidebarOpen,
      toggle,
      toggleOff,
      toggleOn,
    ],
  );

  return (
    <ActionSidebarContext.Provider {...{ value }}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export default ActionSidebarContextProvider;
