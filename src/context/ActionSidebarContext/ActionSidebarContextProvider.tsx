import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { type FieldValues } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const transactionId = searchParams?.get(TX_SEARCH_PARAM);

  const removeTxParamOnClose = useCallback(() => {
    // Remove the TX_SEARCH_PARAM search param only if it is present
    if (transactionId) {
      navigate(removeQueryParamFromUrl(window.location.href, TX_SEARCH_PARAM));
    }
  }, [navigate, transactionId]);

  actionSidebarUseRegisterOnBeforeCloseCallback((element) => {
    const isClickedInside = isElementInsideModalOrPortal(element);
    const navigationWrapper = getElementWithSelector('.modal-blur-navigation');
    const dynamicWalletModal = getElementWithSelector('#dynamic-modal');
    const dynamicSendTransactionModal = getElementWithSelector(
      '#dynamic-send-transaction',
    );
    const dynamicSignMessageModal = getElementWithSelector(
      '#dynamic-sign-message',
    );

    if (
      !isClickedInside ||
      (isChildOf(navigationWrapper, element) && !isTablet) ||
      // Do not close the sidebar when clicking within the Dynamic wallet library modals
      isChildOf(dynamicWalletModal, element) ||
      isChildOf(dynamicSendTransactionModal, element) ||
      isChildOf(dynamicSignMessageModal, element)
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

  const updateActionSidebarInitialValues = useCallback(
    (initialValues) => {
      setActionSidebarInitialValues(getSidebarInitialValues(initialValues));
    },
    [getSidebarInitialValues],
  );

  const toggleOn = useCallback(
    (initialValues) => {
      updateActionSidebarInitialValues(initialValues);
      // Track the event when the action panel is opened
      trackEvent(OPEN_ACTION_PANEL_EVENT);
      return toggleActionSidebarOn();
    },
    [updateActionSidebarInitialValues, toggleActionSidebarOn, trackEvent],
  );

  const toggleOff = useCallback((): void => {
    removeTxParamOnClose();
    toggleActionSidebarOff();
  }, [toggleActionSidebarOff, removeTxParamOnClose]);

  const toggle = useCallback(
    (initialValues): void => {
      if (!isActionSidebarOpen) {
        updateActionSidebarInitialValues(initialValues);
      }
      toggleActionSidebar();
    },
    [
      isActionSidebarOpen,
      updateActionSidebarInitialValues,
      toggleActionSidebar,
    ],
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
      updateActionSidebarInitialValues,
      cancelModalToggle,
      actionSidebarInitialValues,
    }),
    [
      actionSidebarInitialValues,
      actionSidebarRegisterContainerRef,
      actionSidebarUseRegisterOnBeforeCloseCallback,
      updateActionSidebarInitialValues,
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
