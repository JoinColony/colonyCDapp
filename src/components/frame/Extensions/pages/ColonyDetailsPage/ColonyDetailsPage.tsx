import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
import styles from './ColonyDetailsPage.module.css';
import { useColonyContext, useMobile } from '~hooks';
import Avatar from '~v5/shared/Avatar';
import Button, { TextButton } from '~v5/shared/Button';
import ObjectiveBox from '~v5/common/ObjectiveBox';

const displayName = 'frame.Extensions.pages.ColonyDetailsPage';

const ColonyDetailsPage: FC = () => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony, loading } = useColonyContext();
  const { name, metadata } = colony || {};
  const { avatar, thumbnail } = metadata || {};

  const socialLinks = [];

  return (
    <Spinner
      loading={loading}
      loadingText={{ id: 'loading.colonyDetailsPage' }}
    >
      <TwoColumns aside={<Navigation pageName="extensions" />}>
        <div className={clsx('pt-[4.375rem] px-6 pb-6 mt-10', styles.box)}>
          <div className="absolute left-6 -top-11 rounded-full border-4 border-gray-100 flex">
            <Avatar size="md" avatar={avatar || thumbnail || ''} />
          </div>
          <h2 className="heading-2 mb-1">{name}</h2>
          {/* @TODO: Add description when it will be in API */}
          <p className="text-md text-gray-600 mb-5">
            {formatMessage({ id: 'colonyDetailsPage.tempDescription' })}
          </p>
          <div className="mb-6">
            {/* @TODO: Add functionality to add and display social links */}
            {socialLinks.length ? (
              <div />
            ) : (
              <TextButton
                iconName="plus"
                iconSize="tiny"
                text={{ id: 'button.socialLinks' }}
                mode="medium"
              />
            )}
          </div>
          {/* @TODO: Add functionality to edit colony details */}
          <Button
            mode="primarySolid"
            text={{ id: 'button.editColonyDetails' }}
            isFullSize={isMobile}
          />
        </div>
        <div
          className={clsx(
            'p-6 mt-12 flex flex-col justify-between items-center gap-6 sm:flex-row sm:gap-12',
            styles.box,
          )}
        >
          <div className="w-full sm:max-w-[32.875rem]">
            <h3 className="heading-4 mb-4">
              {formatMessage({ id: 'colonyDetailsPage.objectiveTitle' })}
            </h3>
            <p className="text-md text-gray-600 mb-6">
              {formatMessage(
                { id: 'colonyDetailsPage.objectiveDescription' },
                { br: <br /> },
              )}
            </p>
            {!isMobile && (
              <Button
                mode="primarySolid"
                text={{ id: 'button.createObjective' }}
              />
            )}
          </div>
          <div className="w-full sm:max-w-[20.375rem]">
            <h5 className="text-3 mb-2">
              {formatMessage({ id: 'colonyDetailsPage.objectiveBoxTitle' })}
            </h5>
            <ObjectiveBox />
          </div>
          {isMobile && (
            // @TODO: Add functionality to create objective
            <Button
              mode="primarySolid"
              text={{ id: 'button.createObjective' }}
              isFullSize={isMobile}
            />
          )}
        </div>
      </TwoColumns>
    </Spinner>
  );
};

ColonyDetailsPage.displayName = displayName;

export default ColonyDetailsPage;
