import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { CoreAction } from '~actions';
import { MAX_COLONY_DESCRIPTION_LENGTH } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { useMobile } from '~hooks/index.ts';
import { tw } from '~utils/css/index.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import NativeTokenPill from '~v5/common/NativeTokenPill/index.ts';
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
  } = metadata || {};
  const isNativeTokenLocked = !status?.nativeToken?.unlocked;

  const { show } = useActionSidebarContext();

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
            ? multiLineTextEllipsis(description, MAX_COLONY_DESCRIPTION_LENGTH)
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
            show({
              [ACTION_TYPE_FIELD_NAME]: CoreAction.ColonyEdit,
            });
          }}
        />
      </div>
    </div>
  );
};

ColonyDetailsPage.displayName = displayName;

export default ColonyDetailsPage;
