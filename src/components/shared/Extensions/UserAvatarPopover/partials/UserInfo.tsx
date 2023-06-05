import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { UserInfoProps } from '../types';
import Avatar from '~shared/Extensions/Avatar';
import Icon from '~shared/Icon';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import { useMobile } from '~hooks';
import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge/UserPermissionsBadge';
import TitledContent from '~common/Extensions/TitledContent/TitledContent';

const displayName = 'Extensions.UserAvatarPopover.partials.UserInfo';

const UserInfo: FC<UserInfoProps> = ({
  userName,
  walletAddress = '',
  isVerified,
  aboutDescription,
  colonyReputation,
  permissions,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const aboutDescriptionText =
    typeof aboutDescription === 'string' ? aboutDescription : aboutDescription && formatMessage(aboutDescription);

  const { handleClipboardCopy, isCopied } = useCopyToClipboard(walletAddress);

  return (
    <div>
      <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center mb-6">
        <Avatar size="m" title={userName} />
        <div>
          <div className="flex items-center mb-0.5">
            <p className="font-semibold text-xl">{userName}</p>
            {isVerified && (
              <span className="ml-2 flex shrink-0 [&_svg]:text-blue-400">
                <Icon name="verified" appearance={{ size: 'tiny' }} />
              </span>
            )}
          </div>
          {isCopied ? (
            <button
              onClick={handleClipboardCopy}
              onKeyDown={handleClipboardCopy}
              type="button"
              aria-label={formatMessage({ id: 'copyWalletAddress' })}
              className={clsx(
                'flex items-center transition-all duration-normal hover:text-blue-400',
                isMobile
                  ? `border border-gray-100 rounded-[0.1875rem] w-full px-1.5 py-1 justify-center text-gray-700 text-xs mt-1.5`
                  : 'text-sm text-gray-600',
              )}
            >
              <span className={clsx('flex items-center', isMobile ? 'flex-row-reverse' : 'flex')}>
                <span>{isMobile ? formatMessage({ id: 'copyWalletAddress' }) : walletAddress}</span>
                <span className={clsx('flex shrink-0', isMobile ? 'mr-1.5' : 'ml-1.5')}>
                  <Icon name="copy-simple" appearance={{ size: 'extraTiny' }} />
                </span>
              </span>
            </button>
          ) : (
            <p className="text-sm">{walletAddress}</p>
          )}
        </div>
      </div>
      <TitledContent title={{ id: 'userInfo.about.section' }}>
        <p className="text-md text-gray-600">{aboutDescriptionText}</p>
      </TitledContent>
      <TitledContent title={{ id: 'userInfo.colonyReputation.section' }} className="pt-6 mt-6 border-t border-gray-200">
        <ul className="flex flex-col gap-2">
          {colonyReputation.map(({ key, title, percentage, points }) => {
            const titleText = typeof title === 'string' ? title : title && formatMessage(title);

            return (
              <li key={key} className="grid grid-cols-[1fr,auto] gap-x-4 font-medium text-gray-900">
                <span className="text-md">{titleText}</span>
                <span className="inline-flex items-center text-sm [&_svg]:text-blue-400">
                  <Icon name="star" appearance={{ size: 'extraTiny' }} />
                  <span className="text-blue-400 inline-block ml-1 mr-2">{percentage}%</span>
                  <span>{points} pts</span>
                </span>
              </li>
            );
          })}
        </ul>
      </TitledContent>

      <TitledContent title={{ id: 'userInfo.permissions.section' }} className="pt-6 mt-6 border-t border-gray-200">
        <ul className="inline-flex flex-wrap gap-x-1 gap-y-2">
          {permissions.map(({ key, text, description, name }) => (
            <li key={key}>
              <UserPermissionsBadge text={text} description={description} name={name} />
            </li>
          ))}
        </ul>
      </TitledContent>
    </div>
  );
};

UserInfo.displayName = displayName;

export default UserInfo;
