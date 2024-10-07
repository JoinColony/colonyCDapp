import React, { type FC } from 'react';
import { Link } from 'react-router-dom';

import { COLONY_ACTIVITY_ROUTE, TX_SEARCH_PARAM } from '~routes';
import { formatText } from '~utils/intl.ts';
import { removeQueryParamFromUrl } from '~utils/urls.ts';
import FourOFourMessage from '~v5/common/FourOFourMessage/FourOFourMessage.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';

import { type ActionSidebarNotFoundContentProps } from './types.ts';

const ActionSidebarNotFoundContent: FC<ActionSidebarNotFoundContentProps> = ({
  toggleActionSidebarOff,
  startPollingForAction,
  isInvalidTransactionHash,
}) => {
  return (
    <div className="pt-14">
      <FourOFourMessage
        description={formatText({
          id: isInvalidTransactionHash
            ? 'actionSidebar.fourOfour.descriptionInvalidHash'
            : 'actionSidebar.fourOfour.description',
        })}
        links={
          <>
            {!isInvalidTransactionHash && (
              <Link
                to={COLONY_ACTIVITY_ROUTE}
                className="mb-2 text-sm text-blue-400 underline"
                onClick={toggleActionSidebarOff}
              >
                {formatText({
                  id: 'actionSidebar.fourOfour.activityPageLink',
                })}
              </Link>
            )}
            <Link
              to={removeQueryParamFromUrl(
                window.location.href,
                TX_SEARCH_PARAM,
              )}
              className="mb-2 text-sm text-blue-400 underline"
            >
              {formatText({
                id: 'actionSidebar.fourOfour.createNewAction',
              })}
            </Link>
          </>
        }
        primaryLinkButton={
          isInvalidTransactionHash ? (
            <ButtonLink
              mode="primarySolid"
              to={COLONY_ACTIVITY_ROUTE}
              className="flex-1"
              onClick={toggleActionSidebarOff}
            >
              {formatText({
                id: 'actionSidebar.fourOfour.activityPageLink',
              })}
            </ButtonLink>
          ) : (
            <Button
              mode="primarySolid"
              className="flex-1"
              onClick={startPollingForAction}
            >
              {formatText({
                id: 'button.retry',
              })}
            </Button>
          )
        }
      />
    </div>
  );
};

export default ActionSidebarNotFoundContent;
