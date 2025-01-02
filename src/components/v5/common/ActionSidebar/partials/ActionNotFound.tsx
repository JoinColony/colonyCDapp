import React, { type FC } from 'react';
import { Link } from 'react-router-dom';

import { COLONY_ACTIVITY_ROUTE, TX_SEARCH_PARAM } from '~routes';
import { formatText } from '~utils/intl.ts';
import { removeQueryParamFromUrl } from '~utils/urls.ts';
import FourOFourMessage from '~v5/common/FourOFourMessage/FourOFourMessage.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';

interface ActionNotFoundProps {
  isInvalidTransactionHash?: boolean;
  onCloseSidebar: VoidFunction;
  onRefetchAction: VoidFunction;
}

export const ActionNotFound: FC<ActionNotFoundProps> = ({
  isInvalidTransactionHash,
  onCloseSidebar,
  onRefetchAction,
}) => {
  const createNewActionLink = (
    <Link
      to={removeQueryParamFromUrl(window.location.href, TX_SEARCH_PARAM)}
      className="mb-2 text-sm text-blue-400 underline"
    >
      {formatText({
        id: 'actionSidebar.fourOfour.createNewAction',
      })}
    </Link>
  );

  if (isInvalidTransactionHash) {
    return (
      <FourOFourMessage
        className="mt-14 w-full sm:max-w-md"
        description={formatText({
          id: 'actionSidebar.fourOfour.descriptionInvalidHash',
        })}
        links={createNewActionLink}
        primaryLinkButton={
          <ButtonLink
            mode="primarySolid"
            to={COLONY_ACTIVITY_ROUTE}
            className="flex-1"
            onClick={onCloseSidebar}
          >
            {formatText({
              id: 'actionSidebar.fourOfour.activityPageLink',
            })}
          </ButtonLink>
        }
      />
    );
  }

  return (
    <FourOFourMessage
      className="mt-14 w-full sm:max-w-md"
      description={formatText({
        id: 'actionSidebar.fourOfour.description',
      })}
      links={
        <>
          <Link
            to={COLONY_ACTIVITY_ROUTE}
            className="mb-2 text-sm text-blue-400 underline"
            onClick={onCloseSidebar}
          >
            {formatText({
              id: 'actionSidebar.fourOfour.activityPageLink',
            })}
          </Link>
          {createNewActionLink}
        </>
      }
      primaryLinkButton={
        <Button
          mode="primarySolid"
          className="flex-1"
          onClick={onRefetchAction}
        >
          {formatText({
            id: 'button.retry',
          })}
        </Button>
      }
    />
  );
};
