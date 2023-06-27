import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { UserInfoProps } from '../types';
import Avatar from '~v5/shared/Avatar';
import Icon from '~shared/Icon';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge';
import TitledContent from '~common/Extensions/TitledContent';
import CopyWalletAddressButton from '~v5/shared/CopyWalletAddressButton';

const displayName = 'v5.UserAvatarPopover.partials.UserInfo';

const UserInfo: FC<UserInfoProps> = ({
  userName,
  walletAddress,
  isVerified,
  aboutDescription,
  colonyReputation,
  permissions,
  avatar,
}) => {
  const { formatMessage } = useIntl();

  const aboutDescriptionText =
    typeof aboutDescription === 'string'
      ? aboutDescription
      : aboutDescription && formatMessage(aboutDescription);

  const { handleClipboardCopy, isCopied } = useCopyToClipboard(
    walletAddress || '',
  );

  return (
    <div>
      <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center">
        <Avatar size="m" title={userName} avatar={avatar} />
        <div>
          <div className="flex items-center mb-0.5">
            <p className="heading-4">{userName}</p>
            {isVerified && (
              <span className="ml-2 flex shrink-0 text-blue-400">
                <Icon name="verified" appearance={{ size: 'tiny' }} />
              </span>
            )}
          </div>
          <CopyWalletAddressButton
            isCopied={!isCopied}
            handleClipboardCopy={handleClipboardCopy}
            walletAddress={walletAddress || ''}
          />
        </div>
      </div>
      <TitledContent className="mt-2" title={{ id: 'userInfo.about.section' }}>
        <p className="text-md text-gray-600">{aboutDescriptionText}</p>
      </TitledContent>
      {colonyReputation && colonyReputation.length ? (
        <TitledContent
          title={{ id: 'userInfo.colonyReputation.section' }}
          className="pt-6 mt-6 border-t border-gray-200"
        >
          <ul className="flex flex-col gap-2">
            {colonyReputation?.map(({ key, title, percentage, points }) => {
              const titleText =
                typeof title === 'string'
                  ? title
                  : title && formatMessage(title);

              return (
                <li
                  key={key}
                  className="grid grid-cols-[1fr,auto] gap-x-4 font-medium"
                >
                  <span className="text-md">{titleText}</span>
                  <span className="inline-flex items-center text-sm text-blue-400">
                    <Icon name="star" appearance={{ size: 'extraTiny' }} />
                    <span className="inline-block ml-1 mr-2">
                      {percentage}%
                    </span>
                    {points && <span>{points} pts</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </TitledContent>
      ) : undefined}

      {permissions && permissions.length && (
        <TitledContent
          title={{ id: 'userInfo.permissions.section' }}
          className="pt-6 mt-6 border-t border-gray-200"
        >
          <ul className="inline-flex flex-wrap gap-x-1 gap-y-2">
            {permissions.map(({ key, text, description, name }) => (
              <li key={key}>
                <UserPermissionsBadge
                  text={text}
                  description={description}
                  name={name}
                />
              </li>
            ))}
          </ul>
        </TitledContent>
      )}
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
