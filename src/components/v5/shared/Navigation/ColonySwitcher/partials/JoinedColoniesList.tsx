import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';

import JoinedColonyItem from './JoinedColonyItem/index.ts';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.JoinedColoniesList';

export const JoinedColoniesList = () => {
  const { joinedColonies } = useAppContext();
  const colonyContext = useColonyContext({ nullableContext: true });

  const { setShowTabletColonyPicker } = usePageLayoutContext();

  const navigate = useNavigate();

  const onColonyClick = (colonyName: string) => {
    setShowTabletColonyPicker(false);
    navigate(`/${colonyName}`);
  };

  return (
    <ul className="w-full">
      {joinedColonies.map(
        ({ colonyAddress, metadata, name, nativeToken }, index) => {
          const isActiveColony = colonyContext?.colony.name === name;

          return (
            <li key={colonyAddress}>
              <JoinedColonyItem
                colonyAddress={colonyAddress}
                metadata={metadata}
                name={name}
                onClick={onColonyClick}
                tokenSymbol={nativeToken.symbol}
                isActiveColony={isActiveColony}
              />
              {index < joinedColonies.length - 1 && (
                <hr className="mx-4 my-1.5 border-gray-200 md:mx-0" />
              )}
            </li>
          );
        },
      )}
    </ul>
  );
};

JoinedColoniesList.displayName = displayName;

export default JoinedColoniesList;
