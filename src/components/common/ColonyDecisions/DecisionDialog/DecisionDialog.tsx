import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'react-redux';
import { string, object, number, InferType } from 'yup';

import Dialog, { DialogProps } from '~shared/Dialog';
import { HookForm as Form } from '~shared/Fields';
import { useAppContext, useRichTextEditor } from '~hooks';
import { getDomainId } from '~utils/domains';
import { Decision } from '~types';
import { DECISIONS_PREVIEW_ROUTE_SUFFIX as DECISIONS_PREVIEW } from '~routes';
import { createDecisionAction } from '~redux/actionCreators';

import {
  DecisionTitle,
  DecisionBody,
  DecisionControls,
  DialogHeading,
} from '../DecisionDialog';

import styles from './DecisionDialog.css';

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
  decision?: Decision;
  ethDomainId?: number;
}

const DecisionDialog = ({
  cancel,
  close,
  decision,
  ethDomainId,
}: DecisionDialogProps) => {
  const { user } = useAppContext();
  const { pathname } = useLocation();
  const { editor } = useRichTextEditor();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const domainId = getDomainId(ethDomainId);
  const walletAddress = user?.walletAddress || '';
  const content = decision?.description;

  const handleSubmitDialog = (values: DecisionDialogValues) => {
    dispatch(createDecisionAction(values));
    if (!pathname.includes(DECISIONS_PREVIEW)) {
      navigate(`${pathname}${DECISIONS_PREVIEW}`);
    }
    close();
  };

  if (!editor) {
    return null;
  }

  return (
    <Dialog cancel={cancel}>
      <Form<DecisionDialogValues>
        defaultValues={{
          motionDomainId: decision?.motionDomainId ?? domainId,
          title: decision?.title,
          description: decision?.description || '<p></p>',
          walletAddress,
        }}
        onSubmit={handleSubmitDialog}
        validationSchema={validationSchema}
      >
        <div className={styles.main}>
          <DialogHeading />
          <DecisionTitle />
          <DecisionBody content={content} editor={editor} />
          <DecisionControls cancel={cancel} />
          {/* {!hasReputation && (
        <NotEnoughReputation
          domainId={values.motionDomainId}
          includeForceCopy={false}
        />
      )} */}
        </div>
      </Form>
    </Dialog>
  );
};

DecisionDialog.displayName = displayName;

export default DecisionDialog;
