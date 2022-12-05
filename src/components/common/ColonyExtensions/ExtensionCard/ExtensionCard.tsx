import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import Card from '~shared/Card';
import ExtensionStatusBadge from '~shared/ExtensionStatusBadge';
import Heading from '~shared/Heading';
import Icon from '~shared/Icon';
import Link from '~shared/Link';
import { AnyExtensionData } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';

import styles from './ExtensionCard.css';

const displayName = 'common.ColonyExtensions.ExtensionCard';

interface Props {
  extension: AnyExtensionData;
}

const ExtensionCard = ({ extension }: Props) => {
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  return (
    <div className={styles.main}>
      <Link to={`/colony/${colonyName}/extensions/${extension.extensionId}`}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <Icon
                name="colony-logo"
                title={extension.name}
                appearance={{ size: 'small' }}
              />
            </div>
            <div>
              <Heading
                tagName="h4"
                appearance={{ size: 'normal', margin: 'none', theme: 'dark' }}
                text={extension.name}
              />
              <span className={styles.version}>
                v
                {isInstalledExtensionData(extension)
                  ? extension.version
                  : extension.availableVersion}
              </span>
            </div>
          </div>
          <div className={styles.cardDescription}>
            <FormattedMessage {...extension.descriptionShort} />
          </div>
          {isInstalledExtensionData(extension) && (
            <div className={styles.status}>
              <ExtensionStatusBadge extension={extension} />
            </div>
          )}
        </Card>
      </Link>
    </div>
  );
};

ExtensionCard.displayName = displayName;

export default ExtensionCard;
