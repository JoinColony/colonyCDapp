import clsx from 'clsx';
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';

import JoinedColonyItem from './JoinedColonyItem/index.ts';
import { EmptyJoinedColoniesSection } from './TitleSections/EmptyJoinedColoniesSection.tsx';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.JoinedColoniesList';

export const JoinedColoniesList = ({
  enableMobileAndDesktopLayoutBreakpoints,
}: {
  enableMobileAndDesktopLayoutBreakpoints?: boolean;
}) => {
  const { joinedColonies } = useAppContext();
  const hasJoinedColonies = !!joinedColonies.length;
  const colonyContext = useColonyContext({ nullableContext: true });

  const { setShowTabletColonyPicker } = usePageLayoutContext();

  const navigate = useNavigate();

  const handleColonyClick = (colonyName: string) => {
    setShowTabletColonyPicker(false);
    navigate(`/${colonyName}`);
  };

  return hasJoinedColonies ? (
    <>
      {joinedColonies.map(
        ({ colonyAddress, metadata, name, nativeToken }, index) => {
          const isActiveColony = colonyContext?.colony.name === name;

          return (
            <Fragment key={colonyAddress}>
              <JoinedColonyItem
                colonyAddress={colonyAddress}
                metadata={metadata}
                name={name}
                onClick={handleColonyClick}
                tokenSymbol={nativeToken.symbol}
                isActiveColony={isActiveColony}
                enableMobileAndDesktopLayoutBreakpoints={
                  enableMobileAndDesktopLayoutBreakpoints
                }
              />
              {index < joinedColonies.length - 1 && (
                <hr
                  className={clsx('mx-6 border-gray-200 md:mx-2', {
                    'sm:mx-2': enableMobileAndDesktopLayoutBreakpoints,
                  })}
                />
              )}
            </Fragment>
          );
        },
      )}
    </>
  ) : (
    <EmptyJoinedColoniesSection />
  );
};

JoinedColoniesList.displayName = displayName;

export default JoinedColoniesList;
