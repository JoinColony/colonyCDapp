import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { MAX_COLONY_DESCRIPTION } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { useMobile } from '~hooks/index.ts';
import { tw } from '~utils/css/index.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import NativeTokenPill from '~v5/common/NativeTokenPill/index.ts';
import ObjectiveBox from '~v5/common/ObjectiveBox/index.ts';
import Button from '~v5/shared/Button/index.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';
import CopyableAddress from '~v5/shared/CopyableAddress/index.ts';
import SocialLinks from '~v5/shared/SocialLinks/index.ts';

const displayName = 'frame.Extensions.pages.ColonyDetailsPage';

const MSG = defineMessages({
  descriptionPlaceholder: {
    id: `${displayName}.desciptionPlaceholder`,
    defaultMessage:
      'Enter a short description about your Colony’s main purpose.',
  },
  objectiveTitle: {
    id: `${displayName}.objectiveTitle`,
    defaultMessage: 'Current Colony Objective',
  },
  objectiveDescription: {
    id: `${displayName}.objectiveDescription`,
    defaultMessage:
      'Colony objectives area the main goal or mission of the Colony all member’s are contributing towards. The objective appears on the main Dashboard of the Colony and progress of the goal is visible. {br} {br} Each update requires a motion progress or the correct Colony wide permissions.',
  },
  objectiveBoxTitle: {
    id: `${displayName}.objectiveBoxTitle`,
    defaultMessage: 'Current Colony objective:',
  },
});

const ColonyDetailsPage: FC = () => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const {
    colony: { metadata, colonyAddress, nativeToken, status },
  } = useColonyContext();

  useSetPageHeadingTitle(
    formatMessage({ id: 'navigation.admin.colonyDetails' }),
  );

  const {
    avatar,
    thumbnail,
    displayName: colonyDisplayName,
    description,
    externalLinks,
    objective,
  } = metadata || {};
  const isNativeTokenLocked = !status?.nativeToken?.unlocked;

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const boxClass = tw`relative rounded-lg border border-gray-200 bg-gray-25`;

  return (
    <div className="pb-6">
      <div className={clsx('flex flex-col items-start p-6', boxClass)}>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <ColonyAvatar
            size={60}
            colonyAddress={colonyAddress}
            colonyImageSrc={thumbnail || avatar || undefined}
            colonyName={colonyDisplayName}
          />
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-row items-end gap-3">
              <h2 className="heading-2">{colonyDisplayName}</h2>
              {nativeToken && (
                <NativeTokenPill
                  variant="secondary"
                  token={nativeToken}
                  isLocked={isNativeTokenLocked}
                />
              )}
            </div>
            {colonyAddress && <CopyableAddress address={colonyAddress} />}
          </div>
        </div>
        <p
          className={clsx('mb-6 mt-4 text-md text-gray-600', {
            'text-gray-700': !!description,
          })}
        >
          {description && description.length > 0
            ? multiLineTextEllipsis(description, MAX_COLONY_DESCRIPTION)
            : formatMessage(MSG.descriptionPlaceholder)}
        </p>
        {externalLinks && externalLinks.length ? (
          <SocialLinks
            className="mb-6"
            externalLinks={externalLinks}
            showLabels
          />
        ) : null}
        <Button
          mode="primarySolid"
          size="small"
          text={{ id: 'button.editColonyDetails' }}
          isFullSize={isMobile}
          onClick={() => {
            toggleActionSidebarOn({
              [ACTION_TYPE_FIELD_NAME]: Action.EditColonyDetails,
            });
          }}
        />
      </div>
      <div
        className={clsx(
          'mt-6 flex flex-col items-start gap-6 p-6 sm:mt-9 sm:flex-row sm:gap-12',
          boxClass,
        )}
      >
        <div className="flex-1">
          <h3 className="mb-4 heading-4">
            {formatMessage(MSG.objectiveTitle)}
          </h3>
          <p className="text-md text-gray-600 sm:mb-6">
            {formatMessage(MSG.objectiveDescription, { br: <br /> })}
          </p>
          {!isMobile && (
            <Button
              mode="primarySolid"
              size="small"
              text={{ id: 'button.manageObjective' }}
              textValues={{ existing: !!objective?.title }}
              onClick={() => {
                toggleActionSidebarOn({
                  [ACTION_TYPE_FIELD_NAME]: Action.ManageColonyObjectives,
                });
              }}
            />
          )}
        </div>
        <div className="w-full sm:max-w-[20.375rem]">
          <h5 className="mb-2 text-3">
            {formatMessage(MSG.objectiveBoxTitle)}
          </h5>
          <ObjectiveBox objective={objective} />
        </div>
        {isMobile && (
          // @TODO: Test functionality to create objective on mobile
          <Button
            mode="primarySolid"
            size="small"
            text={{ id: 'button.manageObjective' }}
            textValues={{ existing: !!objective?.title }}
            isFullSize
            onClick={() => {
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: Action.ManageColonyObjectives,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

ColonyDetailsPage.displayName = displayName;

export default ColonyDetailsPage;
