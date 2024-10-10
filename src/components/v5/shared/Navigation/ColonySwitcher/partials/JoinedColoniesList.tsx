import clsx from 'clsx';
import React, { Fragment, useEffect } from 'react';
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
  const { joinedColonies, refetchJoinedColonies } = useAppContext();
  const hasJoinedColonies = !!joinedColonies.length;
  const colonyContext = useColonyContext({ nullableContext: true });

  const { setShowTabletColonyPicker } = usePageLayoutContext();

  const navigate = useNavigate();

  const handleColonyClick = (colonyName: string) => {
    setShowTabletColonyPicker(false);
    navigate(`/${colonyName}`);
  };

  useEffect(() => {
    refetchJoinedColonies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    colonyContext?.colony.metadata?.avatar,
    colonyContext?.colony.metadata?.thumbnail,
  ]);

  return hasJoinedColonies ? (
    <div className="flex flex-col gap-1.5 overflow-y-auto px-2 pt-2">
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
                  className={clsx('mx-4 border-gray-200 md:mx-2', {
                    'sm:mx-2': enableMobileAndDesktopLayoutBreakpoints,
                  })}
                />
              )}
            </Fragment>
          );
        },
      )}
    </div>
  ) : (
    <div className="p-6 md:px-4 md:pb-0 md:pt-4">
      <EmptyJoinedColoniesSection />
    </div>
  );
};

JoinedColoniesList.displayName = displayName;

export default JoinedColoniesList;
