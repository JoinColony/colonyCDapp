import React, { ComponentProps, useMemo } from 'react';

import { SUPPORTED_SAFE_NETWORKS } from '~constants';
import { Safe } from '~types';

import SingleUserPicker from './SingleUserPicker';

/* SingleSafePicker is a wrapper around SingleUserPicker component */
interface Props extends ComponentProps<typeof SingleUserPicker> {
  data: Safe[];
}

const displayName = 'SingleUserPicker.SingleSafePicker';

const SingleSafePicker = ({ data, ...props }: Props) => {
  const formattedData = useMemo(
    () =>
      data.map((item) => {
        const safeNetwork = SUPPORTED_SAFE_NETWORKS.find(
          (network) => network.chainId === Number(item.chainId),
        );
        return {
          id: item.moduleContractAddress,
          profile: {
            displayName: `${item.name} (${safeNetwork?.name})`,
            walletAddress: item.address,
          },
        };
      }),
    [data],
  );

  return (
    <SingleUserPicker {...props} data={formattedData} placeholder="safe-logo" />
  );
};

SingleSafePicker.displayName = displayName;

export default SingleSafePicker;
