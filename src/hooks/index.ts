import { Selector } from 'reselect';
import { useEffect, useMemo, useRef } from 'react';

import { ActionTransformFnType } from '~utils/actions';
import promiseListener, { AsyncFunction } from '~redux/createPromiseListener';
import { getMainClasses } from '~utils/css';

import { RootStateRecord } from '~redux/state';

type DependantSelector = (
  selector: Selector<RootStateRecord, any>,
  reduxState: RootStateRecord,
  extraArgs?: any[],
) => boolean;

export type Given = (
  potentialSelector: Selector<RootStateRecord, any>,
  dependantSelector?: DependantSelector,
) => any | boolean;

export {
  default as useNaiveBranchingDialogWizard,
  WizardDialogType,
} from './useNaiveBranchingDialogWizard';

export { default as useColonyHasReputation } from './useColonyHasReputation';
export { default as useDialogActionPermissions } from './useDialogActionPermissions';
export { default as useActionDialogStatus } from './useActionDialogStatus';
export {
  default as useEnabledExtensions,
  EnabledExtensionData,
} from './useEnabledExtensions';
export { default as useSelectedUser } from './useSelectedUser';
export { default as useTitle } from './useTitle';
export { default as useTokenInfo, TokenInfoProvider } from './useTokenInfo';
export { default as useUserAvatarImageFromIPFS } from './useUserAvatarImageFromIPFS';
export { default as useCanEditProfile } from './useCanEditProfile';
export { default as useWindowSize } from './useWindowSize';
// @TODO: Put this into ~context
export { default as useAppContext } from './useAppContext';
export { default as useUserReputation } from './useUserReputation';
export { default as useMobile } from './useMobile';
export { default as useTablet } from './useTablet';
export { default as useSortedContributors } from './useSortedContributors';
export {
  default as useUserReputationForTopDomains,
  UserDomainReputation,
} from './useUserReputationForTopDomains';
// @TODO: Put this into ~context
export { default as useColonyContext } from './useColonyContext';
export { default as useRichTextEditor } from './useRichTextEditor';
export { default as useExtensionData } from './useExtensionData';
export { default as useExtensionsData } from './useExtensionsData';
export { default as usePaginatedActions } from './usePaginatedActions';
export { default as useTokenActivationContext } from './useTokenActivationContext';
export * from './useCanInteractWithColony';
export { default as useColonyFundsClaims } from './useColonyFundsClaims';
export { default as useCurrentSelectedToken } from './useCurrentSelectedToken';
export { default as useGetNetworkToken } from './useGetNetworkToken';
export { default as useTokenTotalBalance } from './useTokenTotalBalance';
export { default as useColonyContractVersion } from './useColonyContractVersion';
export { default as useNetworkInverseFee } from './useNetworkInverseFee';
export { default as useUserByAddress } from './useUserByAddress';
export { default as useUserByName } from './useUserByName';
export { default as useUserByNameOrAddress } from './useUserByNameOrAddress';
export { default as useDetectClickOutside } from './useDetectClickOutside';
export { default as useCurrentPage } from './useCurrentPage';
export { default as useFetchActiveInstallsExtension } from './useFetchActiveInstallsExtension';
export { default as useActiveInstalls } from './useActiveInstalls';
export { default as useGetColonyMembers } from './useGetColonyMembers';
export { default as useAllMembers } from './members/useAllMembers';
export { default as useColonyContributors } from './members/useColonyContributors';
export { default as useContributorBreakdown } from './members/useContributorBreakdown';
export { default as useGlobalEventHandler } from './useGlobalEventHandler';
export { default as useFlatFormErrors } from './useFlatFormErrors';
export { default as useEnoughTokensForStaking } from './useEnoughTokensForStaking';
export { default as useCurrentBlockTime } from './useCurrentBlockTime';
export { default as useClipboardCopy } from './useClipboardCopy';
export {
  default as useSafeTransactionStatus,
  TRANSACTION_STATUS,
  MSG as SafeMSGs,
} from './useSafeTransactionStatus';

/* Used in cases where we need to memoize the transformed output of any data.
 * Transform function has to be pure, obviously
 */
export const useTransformer = <
  T extends (...args: any[]) => any,
  A extends Parameters<T>,
>(
  transform: T,
  args: A = [] as unknown as A,
): ReturnType<T> =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo<ReturnType<T>>(
    () => transform(...args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transform, ...args],
  );

export const usePrevious = <T>(value: T): T | void => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useAsyncFunction = <P, R>({
  submit,
  success,
  error,
  transform,
}: {
  submit: string;
  success: string;
  error: string;
  transform?: ActionTransformFnType;
}): AsyncFunction<P, R>['asyncFunction'] => {
  const asyncFunc = useMemo(() => {
    let setPayload;
    if (transform) {
      setPayload = (action, payload) => {
        const newAction = transform({ ...action, payload });
        return { ...newAction, meta: { ...action.meta, ...newAction.meta } };
      };
    }
    return promiseListener.createAsyncFunction<P, R>({
      start: submit,
      resolve: success,
      reject: error,
      setPayload,
    });
  }, [submit, success, error, transform]);
  // Unsubscribe from the previous async function when it changes
  const prevAsyncFunc = usePrevious(asyncFunc);
  if (prevAsyncFunc && prevAsyncFunc !== asyncFunc) {
    prevAsyncFunc.unsubscribe();
  }
  // Automatically unsubscribe on unmount
  useEffect(() => () => asyncFunc.unsubscribe(), [asyncFunc]);
  return asyncFunc.asyncFunction as any;
};

/*
 * To avoid state updates when this component is unmounted, use a ref
 * that is set to false when cleaning up.
 */
export const useMounted = () => {
  const ref = useRef(true);
  useEffect(
    () => () => {
      ref.current = false;
    },
    [],
  );
  return ref;
};

export const useMainClasses = (
  appearance: any,
  styles: any,
  className?: string,
) =>
  useMemo(
    () => className || getMainClasses(appearance, styles),
    [appearance, className, styles],
  );
