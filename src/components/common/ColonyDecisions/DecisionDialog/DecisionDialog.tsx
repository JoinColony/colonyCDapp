import React from 'react';
import { Id } from '@colony/colony-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'react-redux';
import { string, object, number, InferType } from 'yup';

import Dialog, { DialogProps, DialogSection } from '~shared/Dialog';
import { Form } from '~shared/Fields';
import {
  useAppContext,
  useColonyHasReputation,
  useRichTextEditor,
} from '~hooks';

import { ColonyDecision } from '~types';
import { DECISIONS_PREVIEW_ROUTE_SUFFIX as DECISIONS_PREVIEW } from '~routes';
import { createDecisionAction } from '~redux/actionCreators';

import {
  DecisionTitle,
  DecisionBody,
  DecisionControls,
  DialogHeading,
} from '../DecisionDialog';

import styles from './DecisionDialog.css';
import { NotEnoughReputation } from '~common/Dialogs/Messages';

const displayName = 'common.ColonyDecisions.DecisionDialog';

const MSG = defineMessages({
  titleRequired: {
    id: `${displayName}.titleRequired`,
    defaultMessage: 'Please enter a title',
  },
  descriptionRequired: {
    id: `${displayName}.descriptionRequired`,
    defaultMessage: 'Please enter a description',
  },
});

const validationSchema = object()
  .shape({
    title: string()
      .trim()
      .required(() => MSG.titleRequired),
    motionDomainId: number().defined(),
    description: string()
      .notOneOf(['<p></p>'], () => MSG.descriptionRequired)
      .defined(),
    walletAddress: string().address().required(),
  })
  .defined();

export type DecisionDialogValues = InferType<typeof validationSchema>;

export interface DecisionDialogProps extends DialogProps {
  decision?: ColonyDecision;
  nativeDomainId?: number;
  colonyAddress: string;
}

const DecisionDialog = ({
  cancel,
  close,
  colonyAddress,
  decision,
  nativeDomainId,
}: DecisionDialogProps) => {
  const { user } = useAppContext();
  const { pathname } = useLocation();
  const { editor } = useRichTextEditor();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const motionDomainId =
    decision?.motionDomainId ?? (nativeDomainId || Id.RootDomain);
  const walletAddress = user?.walletAddress || '';
  const content = decision?.description;

  const handleSubmitDialog = (values: DecisionDialogValues) => {
    dispatch(createDecisionAction(values));
    if (!pathname.includes(DECISIONS_PREVIEW)) {
      navigate(`${pathname}${DECISIONS_PREVIEW}`);
    }
    close();
  };

  const hasReputation = useColonyHasReputation(colonyAddress, motionDomainId);

  if (!editor) {
    return null;
  }

  return (
    <Dialog cancel={cancel}>
      <Form<DecisionDialogValues>
        defaultValues={{
          motionDomainId,
          title: decision?.title,
          description: decision?.description || '<p></p>',
          walletAddress,
        }}
        onSubmit={handleSubmitDialog}
        validationSchema={validationSchema}
      >
        <div className={styles.main}>
          <DialogHeading />
          <DecisionTitle disabled={!hasReputation} />
          <DecisionBody
            content={content}
            editor={editor}
            disabled={!hasReputation}
          />
          {!hasReputation && (
            <DialogSection>
              <NotEnoughReputation
                domainId={motionDomainId}
                includeForceCopy={false}
              />
            </DialogSection>
          )}
          <DecisionControls cancel={cancel} disabled={!hasReputation} />
        </div>
      </Form>
    </Dialog>
  );
};

DecisionDialog.displayName = displayName;

export default DecisionDialog;
