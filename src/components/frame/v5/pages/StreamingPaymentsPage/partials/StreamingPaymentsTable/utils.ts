import { type ColonyContributor } from '~types/graphql.ts';

import { type StreamingTableFieldModel } from './types.ts';

export const searchStreamingPayments = (
  streamingPayments: StreamingTableFieldModel[],
  members: ColonyContributor[],
  searchValue?: string,
): StreamingTableFieldModel[] => {
  if (!searchValue) {
    return streamingPayments;
  }

  const searchedMembers = members.filter(
    (member) =>
      member.user?.profile?.displayName
        ?.toLowerCase()
        .startsWith(searchValue.toLowerCase()) ||
      member.contributorAddress.startsWith(searchValue),
  );

  return streamingPayments.filter((streamingPayment) => {
    const member = searchedMembers.find(
      (searchedMember) =>
        searchedMember.contributorAddress === streamingPayment.user,
    );

    return (
      member?.contributorAddress
        .toLowerCase()
        .includes(streamingPayment.user.toLowerCase()) ||
      streamingPayment.actions.some((stream) =>
        stream.title.toLowerCase().includes(searchValue.toLowerCase()),
      )
    );
  });
};
