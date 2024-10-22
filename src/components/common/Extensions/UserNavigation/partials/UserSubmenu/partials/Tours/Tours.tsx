import {
  Signpost,
  FilePlus,
  Bank,
  HandCoins,
  Layout,
  IdentificationBadge,
} from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { CreateActionTourSteps } from '~common/Tours/createAction/steps.ts';
import { GetStartedTourSteps } from '~common/Tours/getStarted/steps.ts';
// import { AddingFundsTourSteps } from '~components/common/Tours/tours/addingFunds';
// import { MakePaymentsTourSteps } from '~components/common/Tours/tours/makePayments';
// import { UsingTheAppTourSteps } from '~components/common/Tours/tours/usingTheApp';
// import { UserDashboardTourSteps } from '~components/common/Tours/tours/userDashboard';
import { useTourContext } from '~context/TourContext/TourContext.ts';
import { useMobile } from '~hooks';
import { formatText } from '~utils/intl.ts';

import { ICON_SIZE, ICON_SIZE_MOBILE } from '../consts.ts';
import MenuList from '../MenuList/index.ts';
import MenuListItem from '../MenuListItem/index.ts';
import { actionItemClass, actionItemLabelClass } from '../submenu.styles';

const displayName =
  'common.Extensions.UserNavigation.partials.UserSubmenu.partials.Tours';

const MSG = defineMessages({
  gettingStarted: {
    id: `${displayName}.gettingStarted`,
    defaultMessage: 'Getting started',
  },
  createActions: {
    id: `${displayName}.createActions`,
    defaultMessage: 'Create actions',
  },
  addingFunds: {
    id: `${displayName}.addingFunds`,
    defaultMessage: 'Adding funds',
  },
  makePayments: {
    id: `${displayName}.makePayments`,
    defaultMessage: 'Making payments',
  },
  usingTheApp: {
    id: `${displayName}.usingTheApp`,
    defaultMessage: 'Using the app',
  },
  userDashboard: {
    id: `${displayName}.userDashboard`,
    defaultMessage: 'User dashboard',
  },
});

interface ToursProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Tours: React.FC<ToursProps> = ({ setVisible }) => {
  const isMobile = useMobile();
  const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE;

  const { startTour } = useTourContext();

  const handleStartGettingStartedTour = () => {
    setVisible(false);
    startTour(GetStartedTourSteps);
  };

  const handleStartCreateActionTour = () => {
    setVisible(false);
    startTour(CreateActionTourSteps);
  };

  const handleStartAddingFundsTour = () => {
    setVisible(false);
    // startTour(addingFundsTourSteps);
  };

  const handleStartMakePaymentsTour = () => {
    setVisible(false);
    // startTour(makePaymentsTourSteps);
  };

  const handleStartUsingTheAppTour = () => {
    setVisible(false);
    // startTour(usingTheAppTourSteps);
  };

  const handleStartUserDashboardTour = () => {
    setVisible(false);
    // startTour(userDashboardTourSteps);
  };

  return (
    <MenuList>
      <MenuListItem>
        <button
          type="button"
          onClick={handleStartGettingStartedTour}
          className={actionItemClass}
        >
          <Signpost size={iconSize} />
          <p className={actionItemLabelClass}>
            {formatText(MSG.gettingStarted)}
          </p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={handleStartCreateActionTour}
          className={actionItemClass}
        >
          <FilePlus size={iconSize} />
          <p className={actionItemLabelClass}>
            {formatText(MSG.createActions)}
          </p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={handleStartAddingFundsTour}
          className={actionItemClass}
        >
          <Bank size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.addingFunds)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={handleStartMakePaymentsTour}
          className={actionItemClass}
        >
          <HandCoins size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.makePayments)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={handleStartUsingTheAppTour}
          className={actionItemClass}
        >
          <Layout size={iconSize} />
          <p className={actionItemLabelClass}>{formatText(MSG.usingTheApp)}</p>
        </button>
      </MenuListItem>
      <MenuListItem>
        <button
          type="button"
          onClick={handleStartUserDashboardTour}
          className={actionItemClass}
        >
          <IdentificationBadge size={iconSize} />
          <p className={actionItemLabelClass}>
            {formatText(MSG.userDashboard)}
          </p>
        </button>
      </MenuListItem>
    </MenuList>
  );
};

Tours.displayName = displayName;
export default Tours;
