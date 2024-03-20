import { Signature, Binoculars } from '@phosphor-icons/react';
import React, { useState, type FC, useEffect } from 'react';

import { useMobile } from '~hooks/index.ts';
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
            <div
              className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-gray-25 p-5"
              key={key}
            >
              <div className="flex items-center gap-2.5">
                <div className="h-[1.875rem] w-[1.875rem] overflow-hidden rounded-full bg-gray-300 skeleton" />
                <div className="h-4 w-2/3 overflow-hidden rounded bg-gray-300 skeleton" />
              </div>
            </div>
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
              <MemberCardList items={currentMembers} isSimple />
              {(membersCount > 0 || extensionsCount > 0) &&
                currentMembers.length < membersCount + extensionsCount && (
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
