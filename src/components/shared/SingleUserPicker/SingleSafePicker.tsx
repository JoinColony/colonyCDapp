import React, { ComponentProps, useMemo } from 'react';

import { SUPPORTED_SAFE_NETWORKS } from '~constants';
import { Safe } from '~types';
import Avatar from '~shared/Avatar';
import { SelectedSafe } from '~types/safes';

import SingleUserPicker, {
  AvatarRenderFn,
  OnSelectedFn,
} from './SingleUserPicker';

/* SingleSafePicker is a wrapper around SingleUserPicker component */
interface Props
  extends Omit<
    ComponentProps<typeof SingleUserPicker>,
    'renderAvatar' | 'onSelected'
  > {
  data: Safe[];
  onSelected?: (safe: SelectedSafe) => void;
}

const displayName = 'SingleUserPicker.SingleSafePicker';

const renderSafe = (item: SelectedSafe) => (
  <Avatar
    seed={item.id.toLowerCase()}
    size="xs"
    notSet={false}
    title={item.profile.displayName}
    placeholderIcon="at-sign-circle"
  />
);

const SingleSafePicker = ({ data, onSelected, ...props }: Props) => {
  const formattedData = useMemo(
    () =>
      data.map((item) => {
        const safeNetwork = SUPPORTED_SAFE_NETWORKS.find(
          (network) => network.chainId === Number(item.chainId),
        );
        return {
          id: item.moduleContractAddress,
          walletAddress: item.address,
          profile: {
            displayName: `${item.name} (${safeNetwork?.name})`,
          },
        };
      }),
    [data],
  );

  return (
    <SingleUserPicker
      {...props}
      data={formattedData}
      placeholderIconName="safe-logo"
      renderAvatar={renderSafe as AvatarRenderFn}
      onSelected={onSelected as unknown as OnSelectedFn}
    />
  );
};

SingleSafePicker.displayName = displayName;

export default SingleSafePicker;
