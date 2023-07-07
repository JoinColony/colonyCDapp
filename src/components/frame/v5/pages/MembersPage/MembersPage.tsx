import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import BurgerMenu from '~v5/shared/BurgerMenu';
import PopoverBase from '~v5/shared/PopoverBase';
import SubNavigation from './partials/SubNavigation';
import { useMembersPage } from './hooks';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import Filter from '~v5/common/Filter';

const MembersPage: FC = () => {
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useMembersPage();
  const { formatMessage } = useIntl();

  return (
    <TwoColumns aside={<Navigation pageName="members" />}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h4 className="heading-4 mr-2">
            {formatMessage({ id: 'members.allMembers' })}
          </h4>
          <BurgerMenu isVertical setTriggerRef={setTriggerRef} />
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'py-4 px-2',
              }}
              classNames="w-full sm:max-w-[17.375rem]"
            >
              <SubNavigation
                onManageMembersClick={() => setIsManageMembersOpen(true)}
              />
            </PopoverBase>
          )}
        </div>
        <Filter />
      </div>
      <ManageMemberModal
        isOpen={isManageMembersOpen}
        onClose={() => setIsManageMembersOpen(false)}
      />
    </TwoColumns>
  );
};

export default MembersPage;
