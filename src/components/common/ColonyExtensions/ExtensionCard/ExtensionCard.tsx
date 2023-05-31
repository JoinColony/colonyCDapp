import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import Card from '~shared/Card';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';
import { Heading4 } from '~shared/Heading';
import Icon from '~shared/Icon';
import Link from '~shared/Extensions/Link';
import { AnyExtensionData } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';

import styles from './ExtensionCard.css';

const displayName = 'common.ColonyExtensions.ExtensionCard';

interface Props {
  extensionData: AnyExtensionData;
}

const ExtensionCard = ({ extensionData }: Props) => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  return (
    <div className={styles.main}>
      <Link to={`/colony/${colonyName}/extensions/${extensionData.extensionId}`}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <Icon name="colony-logo" title={extensionData.name} appearance={{ size: 'small' }} />
            </div>
            <div>
              <Heading4 appearance={{ size: 'normal', margin: 'none', theme: 'dark' }} text={extensionData.name} />
              <span className={styles.version}>
                v
                {isInstalledExtensionData(extensionData)
                  ? extensionData.currentVersion
                  : extensionData.availableVersion}
              </span>
            </div>
          </div>
          <div className={styles.cardDescription}>
            <FormattedMessage {...extensionData.descriptionShort} />
          </div>
          {isInstalledExtensionData(extensionData) && (
            <div className={styles.status}>
              <ExtensionStatusBadge extensionData={extensionData} />
            </div>
          )}
        </Card>
      </Link>
    </div>
  );
};

ExtensionCard.displayName = displayName;

export default ExtensionCard;
