import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import Button from '~shared/Button';
import { DialogSection } from '~shared/Dialog';
import Heading from '~shared/Heading';

import SafeListItem from './SafeListItem';

import styles from './RemoveSafeDialogForm.css';

const displayName = 'common.RemoveSafeDialog.RemoveSafeDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Remove Safe',
  },
  desc: {
    id: `${displayName}.desc`,
    defaultMessage: 'Select the Safe(s) you wish to remove',
  },
  emptySafeMsg: {
    id: `${displayName}.emptySafeMsg`,
    defaultMessage: 'No Safes found to remove.',
  },
});

interface RemoveSafeProps {
  back: () => void;
  safeList: Array<any>;
}

const RemoveSafeDialogForm = ({ back, safeList }: RemoveSafeProps) => {
  const {
    formState: { isSubmitting, isValid, isDirty },
    watch,
  } = useFormContext();

  const { safeList: safes } = watch();
  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          text={MSG.title}
          className={styles.title}
        />
      </DialogSection>
      {!safeList.length ? (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.emptySafeList}>
            <FormattedMessage {...MSG.emptySafeMsg} />
          </div>
        </DialogSection>
      ) : (
        <div>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.description}>
              <FormattedMessage {...MSG.desc} />
            </div>
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.content}>
              {safeList.map((item) => (
                <SafeListItem
                  key={`${item.chainId}-${item.contractAddress}`}
                  safe={item}
                  isChecked={
                    !!safes?.find(
                      (safe) => {
                        const {contractAddress, chainId} = JSON.parse(safe);
                        return item.contractAddress === contractAddress &&
                        item.chainId === chainId
                      }
                        ,
                    )
                  }
                />
              ))}
            </div>
          </DialogSection>
        </div>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'pink', size: 'large' }}
          text={{ id: 'button.confirm' }}
          loading={isSubmitting}
          disabled={!isValid || isSubmitting || !isDirty}
        />
      </DialogSection>
    </>
  );
};

export default RemoveSafeDialogForm;
