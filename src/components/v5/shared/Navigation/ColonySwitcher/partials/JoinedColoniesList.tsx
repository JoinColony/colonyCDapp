import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';

import JoinedColonyItem from './JoinedColonyItem/index.ts';
import { NoColoniesJoinedSection } from './TitleSections/NoColoniesJoinedSection.tsx';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.JoinedColoniesList';

export const JoinedColoniesList = () => {
  const { joinedColonies } = useAppContext();
  const hasJoinedColonies = !!joinedColonies.length;

  const { setShowTabletColonyPicker } = usePageLayoutContext();

  const navigate = useNavigate();

  const onColonyClick = (colonyName: string) => {
    setShowTabletColonyPicker(false);
    navigate(`/${colonyName}`);
  };

  return hasJoinedColonies ? (
    <>
      {joinedColonies.map(
        ({ colonyAddress, metadata, name, nativeToken }, index) => (
          <Fragment key={colonyAddress}>
            <JoinedColonyItem
              colonyAddress={colonyAddress}
              metadata={metadata}
              name={name}
              onClick={onColonyClick}
              tokenSymbol={nativeToken.symbol}
            />
            {index < joinedColonies.length - 1 && <hr className="mx-2" />}
          </Fragment>
        ),
      )}
    </>
  ) : (
    <NoColoniesJoinedSection />
  );
};

JoinedColoniesList.displayName = displayName;

export default JoinedColoniesList;
