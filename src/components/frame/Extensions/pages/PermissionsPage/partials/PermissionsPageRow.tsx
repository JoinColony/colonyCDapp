import { Signature, Binoculars } from '@phosphor-icons/react';
import React, { useState, type FC, useEffect } from 'react';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import SimpleExtensionCard from '~v5/common/Filter/ExtensionCard/SimpleExtensionCard.tsx';
import MemberCardList from '~v5/common/MemberCardList/MemberCardList.tsx';
import SimpleMemberCard from '~v5/common/SimpleMemberCard/SimpleMemberCard.tsx';
import SimpleMemberCardSkeleton from '~v5/common/SimpleMemberCard/SimpleMemberCardSkeleton.tsx';
import TextButton from '~v5/shared/Button/TextButton.tsx';
import CountBox from '~v5/shared/CountBox/index.ts';

import { type PermissionPageRowProps } from './types.ts';

const displayName =
  'frame.Extensions.pages.PermissionsPage.partials.PermissionsPageRow';

const PermissionsPageRow: FC<PermissionPageRowProps> = ({
  items,
  title,
  description,
  isLoading,
  isMultiSig,
}) => {
  const isMobile = useMobile();
  const [currentItems, setCurrentItems] = useState(
    items.slice(0, isMobile ? 4 : 8),
  );
  const membersCount = items.filter((item) => item.type === 'member').length;
  const extensionsCount = items.filter(
    (item) => item.type === 'extension',
  ).length;
  const loadMore = () => {
    setCurrentItems(items.slice(0, currentItems.length + 4));
  };

  useEffect(() => {
    if (items) {
      setCurrentItems(items.slice(0, isMobile ? 4 : 8));
    }
  }, [items, isMobile]);

  return (
    <div className="border-b border-gray-200 py-6 last:border-none last:pb-0">
      <div className="mb-1 flex items-center">
        {isMultiSig && (
          <span className="mr-1.5">
            <Signature size={16} />
          </span>
        )}
        <h5 className="heading-5">{title}</h5>
        {(membersCount > 0 || extensionsCount > 0) && (
          <CountBox count={membersCount + extensionsCount} />
        )}
      </div>
      <p className="mb-6 text-md text-gray-600">{description}</p>
      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] gap-6 md:grid-cols-4">
          {[...Array(4).keys()].map((key) => (
            <SimpleMemberCardSkeleton key={key} />
          ))}
        </div>
      ) : (
        <>
          {membersCount === 0 && extensionsCount === 0 ? (
            <EmptyContent
              title={formatText({ id: 'permissionsPage.empty.title' })}
              description={formatText({
                id: 'permissionsPage.empty.description',
              })}
              className="mt-6 px-6 pb-9 pt-10"
              icon={Binoculars}
              withBorder
            />
          ) : (
            <>
              <MemberCardList isSimple>
                {currentItems.map((item) => {
                  if (item.type === 'extension') {
                    return (
                      <SimpleExtensionCard
                        key={item.data.extension.name}
                        extensionName={item.data.extension.name}
                        meatBallMenuProps={item.data.meatBallMenuProps}
                      />
                    );
                  }

                  return (
                    <SimpleMemberCard
                      key={item.data.member.walletAddress}
                      userAddress={item.data.member.walletAddress}
                      user={item.data.member.user ?? undefined}
                      meatBallMenuProps={item.data.meatBallMenuProps}
                      showMultiSigPermissions={isMultiSig}
                    />
                  );
                })}
              </MemberCardList>
              {(membersCount > 0 || extensionsCount > 0) &&
                currentItems.length < membersCount + extensionsCount && (
                  <div className="mt-6 flex justify-center">
                    <TextButton onClick={loadMore}>
                      {formatText({ id: 'loadMore' })}
                    </TextButton>
                  </div>
                )}
            </>
          )}
        </>
      )}
    </div>
  );
};

PermissionsPageRow.displayName = displayName;

export default PermissionsPageRow;
