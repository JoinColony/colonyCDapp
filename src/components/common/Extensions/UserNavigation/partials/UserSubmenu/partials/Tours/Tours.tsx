import {
  // Signpost,
  // FilePlus,
  // Bank,
  // HandCoins,
  Layout,
  // IdentificationBadge,
  Binoculars,
} from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';

// import { CreateActionTourSteps } from '~common/Tours/createAction/steps.ts';
// import { GetStartedTourSteps } from '~common/Tours/getStarted/steps.ts';
import { UsingTheAppTourSteps } from '~common/Tours/usingApp/steps.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useTourContext } from '~context/TourContext/TourContext.ts';
import { useMobile } from '~hooks';
import { COLONY_HOME_ROUTE } from '~routes';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';

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
  usingTheApp: {
    id: `${displayName}.usingTheApp`,
    defaultMessage: 'Using the app',
  },
  noToursAvailable: {
    id: `${displayName}.noToursAvailable`,
    defaultMessage: 'No supported tours',
  },
  noToursDescription: {
    id: `${displayName}.noToursDescription`,
    defaultMessage: 'There are no tours available on this page.',
  },
});

interface ToursProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Tours: React.FC<ToursProps> = ({ setVisible }) => {
  const isMobile = useMobile();
  const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE;

  const { startTour } = useTourContext();
  const colonyContext = useColonyContext({ nullableContext: true });
  const navigate = useNavigate();
  const location = useLocation();

  const colonyName = colonyContext?.colony?.name ?? '';

  const isOnDashboardPage =
    colonyName &&
    location.pathname === `/${generatePath(COLONY_HOME_ROUTE, { colonyName })}`;

  // const handleStartGettingStartedTour = () => {
  //   setVisible(false);
  //   startTour(GetStartedTourSteps);
  // };

  // const handleStartCreateActionTour = () => {
  //   setVisible(false);
  //   startTour(CreateActionTourSteps);
  // };

  const handleStartUsingTheAppTour = () => {
    setVisible(false);
    if (!isOnDashboardPage) {
      navigate(`/${generatePath(COLONY_HOME_ROUTE, { colonyName })}`);
    }
    startTour(UsingTheAppTourSteps);
  };

  const tours = [
    // Disable incomplete tours
    // {
    //   label: MSG.gettingStarted,
    //   icon: Signpost,
    //   steps: GetStartedTourSteps,
    //   handler: handleStartGettingStartedTour,
    //   requiresColonyContext: false,
    // },
    // {
    //   label: MSG.createActions,
    //   icon: FilePlus,
    //   steps: CreateActionTourSteps,
    //   handler: handleStartCreateActionTour,
    //   requiresColonyContext: true,
    // },
    {
      label: MSG.usingTheApp,
      icon: Layout,
      steps: UsingTheAppTourSteps,
      handler: handleStartUsingTheAppTour,
      requiresColonyContext: true,
    },
  ];

  // Filter tours based on colony context requirement
  const availableTours = tours.filter((tour) =>
    tour.requiresColonyContext ? Boolean(colonyContext) : true,
  );

  if (isMobile) {
    return (
      <EmptyContent
        icon={Binoculars}
        title={formatText(MSG.noToursAvailable)}
        description={formatText(MSG.noToursDescription)}
      />
    );
  }

  return (
    <MenuList>
      {availableTours.length > 0 ? (
        availableTours.map((tour) => {
          const IconComponent = tour.icon;
          return (
            <MenuListItem key={tour.label.id}>
              <button
                type="button"
                onClick={tour.handler}
                className={actionItemClass}
              >
                <IconComponent size={iconSize} />
                <p className={actionItemLabelClass}>{formatText(tour.label)}</p>
              </button>
            </MenuListItem>
          );
        })
      ) : (
        <EmptyContent
          icon={Binoculars}
          title={formatText(MSG.noToursAvailable)}
          description={formatText(MSG.noToursDescription)}
        />
      )}
    </MenuList>
  );
};

Tours.displayName = displayName;
export default Tours;
