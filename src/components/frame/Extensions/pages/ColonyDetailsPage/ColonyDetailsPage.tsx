import React, { FC } from 'react';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';

import styles from './ColonyDetailsPage.module.css';
import { useColonyContext, useMobile } from '~hooks';
import Avatar from '~v5/shared/Avatar';
import Button, { TextButton } from '~v5/shared/Button';
import ObjectiveBox from '~v5/common/ObjectiveBox';
import ExternalLink from '~shared/Extensions/ExternalLink';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/hooks';
import { formatText } from '~utils/intl';

const displayName = 'frame.Extensions.pages.ColonyDetailsPage';

const ColonyDetailsPage: FC = () => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();

  useSetPageHeadingTitle(formatText({ id: 'colonyDetailsPage.title' }));

  const { name, metadata } = colony || {};
  const { avatar, thumbnail, description, externalLinks } = metadata || {};

  return (
    <div>
      <div className={clsx('pt-[4.375rem] px-6 pb-6 mt-10', styles.box)}>
        <div className="absolute left-6 -top-11 rounded-full border-4 border-gray-100 flex">
          <Avatar size="md" avatar={avatar || thumbnail || ''} />
        </div>
        <h2 className="heading-2 mb-1">{name}</h2>
        <p className="text-md text-gray-600 mb-5">{description}</p>
        <div className="mb-6 flex gap-x-2">
          {externalLinks?.length ? (
            externalLinks.map(({ name: linkName, link }) => (
              <ExternalLink href={link} key={`${linkName}:${link}`}>
                {linkName}
              </ExternalLink>
            ))
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
            <FormattedMessage id="colonyDetailsPage.objectiveTitle" />
          </h3>
          <p className="text-md text-gray-600 mb-6">
            <FormattedMessage
              id="colonyDetailsPage.objectiveDescription"
              values={{ br: <br /> }}
            />
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
            <FormattedMessage id="colonyDetailsPage.objectiveBoxTitle" />
          </h5>
          <ObjectiveBox progress={0} />
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
    </div>
  );
};

ColonyDetailsPage.displayName = displayName;

export default ColonyDetailsPage;
