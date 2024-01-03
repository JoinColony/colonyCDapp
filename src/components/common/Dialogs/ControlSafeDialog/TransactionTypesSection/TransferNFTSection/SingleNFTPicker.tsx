import React, { ComponentProps, useMemo } from 'react';

import Avatar from '~shared/Avatar';
import SingleUserPicker from '~shared/SingleUserPicker';
import { nftNameContainsTokenId, getSelectedNFTData } from '~utils/safes';

/* SingleNFTPicker is a wrapper around SingleUserPicker component */
interface Props extends ComponentProps<typeof SingleUserPicker> {
  data: any[];
}

const displayName = 'SingleUserPicker.SingleNFTPicker';

const SingleNFTPicker = ({ data, ...props }: Props) => {
  const renderAvatar = (item) => {
    const selectedNFTData = getSelectedNFTData(item, data);
    return (
      <Avatar
        size="xs"
        placeholderIcon="nft-icon"
        title="NFT"
        avatar={selectedNFTData?.imageUri || undefined}
        notSet={!selectedNFTData?.imageUri}
      />
    );
  };

  const formattedData = useMemo(
    () =>
      data.map((item) => {
        const tokenName = item.name || item.tokenName;
        const nftDisplayName = nftNameContainsTokenId(tokenName)
          ? tokenName
          : `${tokenName} #${item.id}`;
        return {
          id: `${item.address} ${item.id}`,
          profile: {
            displayName: nftDisplayName,
          },
          walletAddress: item.address,
        };
      }),
    [data],
  );

  return (
    <SingleUserPicker
      {...props}
      data={formattedData}
      placeholderIconName="nft-icon"
      renderAvatar={renderAvatar}
    />
  );
};

SingleNFTPicker.displayName = displayName;

export default SingleNFTPicker;
