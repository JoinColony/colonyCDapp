import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { usePageLayoutContext } from '~v5/frame/PageLayout/context/PageLayoutContext.ts';

import JoinedColonyItem from '../JoinedColonyItem/index.ts';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.JoinedColoniesList';

export const JoinedColoniesList = () => {
  const { joinedColonies } = useAppContext();

  const { setShowMobileColonyPicker } = usePageLayoutContext();

  const navigate = useNavigate();

  const onColonyClick = (colonyName: string) => {
    setShowMobileColonyPicker(false);
    navigate(`/${colonyName}`);
  };

  return (
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
  );
};

JoinedColoniesList.displayName = displayName;

export default JoinedColoniesList;
