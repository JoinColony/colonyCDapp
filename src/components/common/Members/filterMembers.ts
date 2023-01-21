import {
  FormValues,
  BannedStatus,
  VerificationType,
} from '~common/ColonyMembers/MembersFilter';
import { User } from '~types';

export const filterMembers = <M extends User>(
  data: M[],
  searchValue?: string,
  filters?: FormValues,
): M[] => {
  /* No filters */
  if (
    !searchValue &&
    filters?.bannedStatus === BannedStatus.All &&
    filters?.verificationType === VerificationType.All
  ) {
    return data;
  }

  /* Only text filter */
  if (
    searchValue &&
    filters?.bannedStatus === BannedStatus.All &&
    filters?.verificationType === VerificationType.All
  ) {
    return data.filter(
      ({ profile, walletAddress }) =>
        profile?.displayName
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        profile?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        walletAddress?.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  /* All other combinations */
  return data.filter(({ banned, isWhitelisted, profile, walletAddress }) => {
    const textFilter =
      searchValue === undefined || searchValue === ''
        ? true
        : profile?.displayName
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          profile?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
          walletAddress?.toLowerCase().includes(searchValue.toLowerCase());

    if (filters?.verificationType === VerificationType.All) {
      if (filters?.bannedStatus === BannedStatus.Banned) {
        return banned && textFilter;
      }

      if (filters?.bannedStatus === BannedStatus.NotBanned) {
        return !banned && textFilter;
      }
    }

    if (filters?.bannedStatus === BannedStatus.All) {
      if (filters.verificationType === VerificationType.Verified) {
        return isWhitelisted && textFilter;
      }

      if (filters.verificationType === VerificationType.Unverified) {
        return !isWhitelisted && textFilter;
      }
    }

    if (
      filters?.verificationType === VerificationType.Verified &&
      filters?.bannedStatus === BannedStatus.Banned
    ) {
      return isWhitelisted && banned && textFilter;
    }

    if (
      filters?.verificationType === VerificationType.Unverified &&
      filters?.bannedStatus === BannedStatus.Banned
    ) {
      return !isWhitelisted && banned && textFilter;
    }

    if (
      filters?.verificationType === VerificationType.Verified &&
      filters?.bannedStatus === BannedStatus.NotBanned
    ) {
      return isWhitelisted && !banned && textFilter;
    }

    return !isWhitelisted && !banned && textFilter;
  });
};
