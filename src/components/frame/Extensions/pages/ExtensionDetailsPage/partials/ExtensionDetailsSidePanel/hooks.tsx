import { type Extension } from '@colony/colony-js';
import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
import { waitForDbAfterExtensionAction } from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import { useGetStreamingPaymentsByColonyQuery } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/index.ts';
import Toast from '~shared/Extensions/Toast/index.ts';
import { type StreamingPaymentItems } from '~shared/StreamingPayments/types.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  getStreamingPaymentAmountsLeft,
  getStreamingPaymentStatus,
} from '~utils/streamingPayments.ts';

export const useUninstall = (extensionId: Extension) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const [isLoading, setIsLoading] = useState(false);
  const { refetchExtensionData } = useExtensionData(extensionId);
  const { setActiveTab, setWaitingForActionConfirmation } =
    useExtensionDetailsPageContext();

  const uninstallAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_UNINSTALL,
    error: ActionTypes.EXTENSION_UNINSTALL_ERROR,
    success: ActionTypes.EXTENSION_UNINSTALL_SUCCESS,
  });

  const uninstallExtensionPayload = {
    colonyAddress,
    extensionId,
  };

  const handleUninstall = async () => {
    try {
      setIsLoading(true);
      await uninstallAsyncFunction(uninstallExtensionPayload);
      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.UNINSTALL,
        refetchExtensionData,
        setWaitingForActionConfirmation,
      });
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionUninstall.toast.title.success' }}
          description={{
            id: 'extensionUninstall.toast.description.success',
          }}
        />,
      );

      setActiveTab(ExtensionDetailsPageTabId.Overview);
    } catch (err) {
      console.error(err);
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionUninstall.toast.title.error' }}
          description={{
            id: 'extensionUninstall.toast.description.error',
          }}
        />,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleUninstall, isLoading };
};

export const useDeprecate = ({ extensionId }: { extensionId: Extension }) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { refetchExtensionData } = useExtensionData(extensionId);
  const { setWaitingForActionConfirmation } = useExtensionDetailsPageContext();
  const deprecateExtensionValues = {
    colonyAddress,
    extensionId,
    isToDeprecate: true,
  };

  const deprecateAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_DEPRECATE,
    error: ActionTypes.EXTENSION_DEPRECATE_ERROR,
    success: ActionTypes.EXTENSION_DEPRECATE_SUCCESS,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleDeprecate = async () => {
    try {
      setIsLoading(true);
      await deprecateAsyncFunction(deprecateExtensionValues);
      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.DEPRECATE,
        setWaitingForActionConfirmation,
        refetchExtensionData,
      });
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionDeprecate.toast.title.success' }}
          description={{ id: 'extensionDeprecate.toast.description.success' }}
        />,
      );
    } catch (err) {
      console.error(err);
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionDeprecate.toast.title.error' }}
          description={{ id: 'extensionDeprecate.toast.description.error' }}
        />,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDeprecate,
    isLoading,
  };
};

export const useGetActiveAndUnclaimedStreams = () => {
  const { colony } = useColonyContext();
  const { currentBlockTime: blockTime } = useCurrentBlockTime();

  const { data, fetchMore } = useGetStreamingPaymentsByColonyQuery({
    variables: {
      colonyId: colony.colonyAddress,
    },
    onCompleted: (receivedData) => {
      if (receivedData?.getStreamingPaymentsByColony?.nextToken) {
        fetchMore({
          variables: {
            nextToken: receivedData.getStreamingPaymentsByColony.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return {
              ...prev,
              getStreamingPaymentsByColony: {
                ...prev.getStreamingPaymentsByColony,
                items: [
                  ...(prev?.getStreamingPaymentsByColony?.items || []),
                  ...(fetchMoreResult?.getStreamingPaymentsByColony?.items ||
                    []),
                ],
                nextToken:
                  fetchMoreResult?.getStreamingPaymentsByColony?.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const streamingPayments = useMemo(
    () => data?.getStreamingPaymentsByColony?.items?.filter(notNull) || [],
    [data?.getStreamingPaymentsByColony?.items],
  );

  const getTotalActiveStreamingPayments = (items: StreamingPaymentItems) => {
    const activeStreams = items.filter((item) => {
      const { amountAvailableToClaim } = getStreamingPaymentAmountsLeft(
        item,
        Math.floor(blockTime ?? Date.now() / 1000),
      );

      return (
        getStreamingPaymentStatus({
          streamingPayment: item,
          currentTimestamp: Math.floor(blockTime ?? Date.now() / 1000),
          amountAvailableToClaim,
        }) === StreamingPaymentStatus.Active
      );
    });
    return activeStreams.length;
  };

  const activeStreams = getTotalActiveStreamingPayments(streamingPayments);

  const unclaimedStreams = streamingPayments.filter(
    (item) => item.claims === null && !item.isCancelled,
  ).length;

  return {
    hasActiveStream: activeStreams > 0,
    hasUnclaimedFunds: unclaimedStreams > 0,
  };
};
