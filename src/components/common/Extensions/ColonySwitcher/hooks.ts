import { useMemo } from 'react';
import { NETWORK_DATA } from '~constants';
import { useColonyContext } from '~hooks';

export const useSelectedColony = (watchlist) => {
  const { colony: activeColony } = useColonyContext();
  const colonyToDisplay = activeColony || watchlist[0]?.colony;
  const colonyToDisplayAddress = colonyToDisplay?.colonyAddress;

  const updatedWatchList = useMemo(
    () =>
      watchlist.map((item) => {
        const newNetwork = Object.keys(NETWORK_DATA).find(
          (network) =>
            NETWORK_DATA[network].chainId ===
            item?.colony.chainMetadata.chainId,
        );

        if (!newNetwork) {
          return item;
        }

        return {
          ...item,
          colony: {
            chainMetadata: {
              chainId: item?.colony.chainMetadata.chainId,
              network: newNetwork,
            },
            colonyAddress: item?.colony.colonyAddress,
            name: item?.colony.name,
            metadata: {
              avatar: item?.colony.metadata.avatar,
              displayName: item?.colony.metadata.displayName,
              thumbnail: item?.colony.metadata.thumbnail,
            },
          },
        };
      }),
    [watchlist],
  );

  const coloniesGroupByCategory = updatedWatchList.reduce((group, item) => {
    const network = (item && item.colony.chainMetadata?.network) || '';
    // eslint-disable-next-line no-param-reassign
    group[network] = group[network] ?? [];
    group[network].push(item);
    return group;
  }, {});

  return {
    colonyToDisplay,
    colonyToDisplayAddress,
    coloniesGroupByCategory,
  };
};
