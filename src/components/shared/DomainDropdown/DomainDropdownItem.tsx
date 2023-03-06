import { Id } from '@colony/colony-js';
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
} from 'react';
import classnames from 'classnames';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~shared/Button';
import ColorTag from '~shared/ColorTag';
import Heading from '~shared/Heading';
import Icon from '~shared/Icon';
import Paragraph from '~shared/Paragraph';
// import { OneDomain } from '~data/index';
import { ENTER, DomainColor } from '~types';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

import styles from './DomainDropdownItem.css';

const MSG = defineMessages({
  rootDomain: {
    id: 'DomainDropdown.DomainDropdownItem.rootDomain',
    defaultMessage: '(Root)',
  },
});

interface Props {
  /** Domain to render the entry for */
  domain: any; // fix proper types

  /** Toggle if mark the current domain with the "selected" highlight */
  isSelected: boolean;

  /** Optional method to trigger when clicking the "Edit Domain" button   */
  onDomainEdit?: (domainId: number) => any;

  /** Toggle if to show the domains descriptions text (if available) */
  showDescription?: boolean;
}

const displayName = `DomainDropdown.DomainDropdownItem`;

const DomainDropdownItem = ({
  domain: {
    color = DomainColor.LightPink,
    description,
    nativeId,
    parentId,
    name,
  },
  isSelected,
  onDomainEdit,
  showDescription = true,
}: Props) => {
  const handleEditDomain = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (evt) => {
      evt.stopPropagation();
      if (onDomainEdit) {
        onDomainEdit(nativeId);
      }
    },
    [onDomainEdit, nativeId],
  );

  const handleEditDomainKeyDown = useCallback<
    KeyboardEventHandler<HTMLButtonElement>
  >(
    (evt) => {
      if (evt.key === ENTER) {
        evt.stopPropagation();
        if (onDomainEdit) {
          onDomainEdit(nativeId);
        }
      }
    },
    [onDomainEdit, nativeId],
  );

  /*
   * @TODO a proper color transformation
   * This was just quickly thrown together to ensure it works
   * Maybe even change the gql scalar type ?
   */
  const transformColor = useCallback((domainColor) => {
    const colorMap = {
      0: 0, // Light Pink
      LIGHTPINK: 0,
      5: 5, // Yellow
      RED: 6,
      ORANGE: 13,
    };
    return colorMap[domainColor];
  }, []);

  return (
    <div className={styles.main}>
      {/* {typeof parseInt(parentId) === 'number' && ( */}
      {!!parentId && (
        <div className={styles.childDomainIcon}>
          <Icon name="return-arrow" title="Child Domain" />
        </div>
      )}
      <div className={styles.mainContent}>
        <div
          className={classnames(styles.title, {
            [styles.activeDomain]: isSelected,
          })}
        >
          <div className={styles.color}>
            <ColorTag color={transformColor(color)} />
          </div>
          <div
            className={styles.headingWrapper}
            data-test="domainDropdownItemName"
          >
            <Heading
              appearance={{ margin: 'none', size: 'normal', theme: 'dark' }}
              text={name || `Domain #${nativeId}`}
            />
          </div>
          {nativeId === Id.RootDomain && (
            <div className={styles.rootText}>
              <FormattedMessage {...MSG.rootDomain} />
            </div>
          )}
        </div>
        {description && showDescription && (
          <Paragraph
            className={styles.description}
            title={description}
            data-test="domainDropdownItemPurpose"
          >
            {description}
          </Paragraph>
        )}
      </div>
      <div className={styles.editButtonCol}>
        {
          /*
           * Hide the edit button if:
           * - the selected domain is "All Domains"
           * - the selected domain is "Root"
           * - we haven't provider a `onDomainEdit` method
           */
          nativeId !== COLONY_TOTAL_BALANCE_DOMAIN_ID &&
            nativeId !== Id.RootDomain &&
            onDomainEdit && (
              <div className={styles.editButton}>
                <Button
                  appearance={{ theme: 'blue' }}
                  onClick={handleEditDomain}
                  onKeyDown={handleEditDomainKeyDown}
                  tabIndex={0}
                  text={{ id: 'button.edit' }}
                />
              </div>
            )
        }
      </div>
    </div>
  );
};

DomainDropdownItem.displayName = displayName;

export default DomainDropdownItem;
