import { useColonyContext } from '~hooks';

export const useSelectedColony = (watchlist) => {
  const { colony: activeColony } = useColonyContext();
  const colonyToDisplay = activeColony || watchlist[0]?.colony;
  const colonyToDisplayAddress = colonyToDisplay?.colonyAddress;

  return {
    colonyToDisplay,
    colonyToDisplayAddress,
  };
};
