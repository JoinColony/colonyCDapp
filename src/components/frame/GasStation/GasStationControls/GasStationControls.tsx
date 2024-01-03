import React, { useCallback, useContext } from 'react';
import { object, string, InferType } from 'yup';

import { ActionTypes } from '~redux';
import { TransactionType } from '~redux/immutable';
import { IconButton } from '~shared/Button';
import { ActionForm } from '~shared/Fields';
import { withId } from '~utils/actions';
import { getMainClasses } from '~utils/css';

import { GasStationContext } from '../GasStationProvider';

import styles from './GasStationControls.css';

interface Props {
  transaction: TransactionType;
}

const validationSchema = object().shape({ id: string() }).defined();

type FormValues = InferType<typeof validationSchema>;

const displayName = 'frame.GasStation.GasStationControls';

const GasStationControls = ({ transaction: { id, error } }: Props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const transform = useCallback(withId(id), [id]);
  const { updateTransactionAlert } = useContext(GasStationContext);

  const handleResetMetaTransactionAlert = useCallback(
    () => updateTransactionAlert(id, { wasSeen: false }),
    [id, updateTransactionAlert],
  );

  const initialFormValues: FormValues = { id };

  return (
    <div className={getMainClasses({}, styles)}>
      <ActionForm<FormValues>
        actionType={ActionTypes.TRANSACTION_RETRY}
        validationSchema={validationSchema}
        defaultValues={initialFormValues}
        transform={transform}
      >
        {error && (
          <div className={styles.controls}>
            <IconButton
              type="submit"
              text={{ id: 'button.retry' }}
              onClick={handleResetMetaTransactionAlert}
            />
          </div>
        )}
      </ActionForm>
    </div>
  );
};

GasStationControls.displayName = displayName;

export default GasStationControls;
