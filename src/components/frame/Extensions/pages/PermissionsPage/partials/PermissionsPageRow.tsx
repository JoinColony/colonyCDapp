import { Signature, Binoculars } from '@phosphor-icons/react';
import React, { useState, type FC, useEffect } from 'react';

import { useMobile } from '~hooks';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import MemberCardList from '~v5/common/MemberCardList/MemberCardList.tsx';
import TextButton from '~v5/shared/Button/TextButton.tsx';
import CountBox from '~v5/shared/CountBox/index.ts';

import { type PermissionPageRowProps } from './types.ts';

const displayName =
  'frame.Extensions.pages.PermissionsPage.partials.PermissionsPageRow';

const PermissionsPageRow: FC<PermissionPageRowProps> = ({
  members,
  title,
  description,
  isLoading,
  isMultiSig,
}) => {
  const isMobile = useMobile();
  const [currentMembers, setCurrentMembers] = useState(
    members.slice(0, isMobile ? 4 : 8),
  );
  const membersCount = members.filter((member) => !member.isExtension).length;
  const extensionsCount = members.filter((member) => member.isExtension).length;
  const loadMore = () => {
    setCurrentMembers(members.slice(0, currentMembers.length + 4));
  };

  useEffect(() => {
    if (members) {
      setCurrentMembers(members.slice(0, isMobile ? 4 : 8));
    }
  }, [members, isMobile]);

  return (
    <div className="py-6 last:pb-0 border-b border-gray-200 last:border-none">
      <div className="flex items-center mb-1">
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
      <p className="text-md text-gray-600 mb-6">{description}</p>
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] md:grid-cols-4 gap-6">
          {[...Array(4).keys()].map((key) => (
            <div
              className="w-full h-full flex flex-col p-5 rounded-lg border border-gray-200 bg-gray-25"
              key={key}
            >
              <div className="flex items-center gap-2.5">
                <div className="skeleton w-12 h-12 rounded-full overflow-hidden bg-gray-300" />
                <div className="skeleton w-2/3 h-4 bg-gray-300 overflow-hidden rounded" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && <MemberCardList items={currentMembers} isSimple />}
      {(membersCount > 0 || extensionsCount > 0) &&
        currentMembers.length < membersCount + extensionsCount && (
          <div className="flex justify-center mt-6">
            <TextButton onClick={loadMore}>
              {formatText({ id: 'loadMore' })}
            </TextButton>
          </div>
        )}
      {membersCount === 0 && extensionsCount === 0 && !isLoading && (
        <EmptyContent
          title={formatText({ id: 'permissionsPage.empty.title' })}
          description={formatText({ id: 'permissionsPage.empty.description' })}
          className="pt-10 pb-9 px-6 mt-6"
          icon={Binoculars}
          withBorder
        />
      )}
    </div>
  );
};

PermissionsPageRow.displayName = displayName;

export default PermissionsPageRow;
