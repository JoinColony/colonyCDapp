import React from 'react';
import { defineMessages } from 'react-intl';
import { Editor } from '@tiptap/react';

import { DialogSection } from '~shared/Dialog';
import RichTextArea from '~shared/RichTextArea';

const displayName = 'common.ColonyDecisions.DecisionDialog.DecisionBody';

const MSG = defineMessages({
  inputLabel: {
    id: `${displayName}.inputLabel`,
    defaultMessage: 'Describe the decision you need to make',
  },
});

interface DecisionBodyProps {
  content?: string;
  editor: Editor;
}

// const hasReputation = useColonyReputation(
//   colonyAddress,
//   values.motionDomainId,
// );
const DecisionBody = ({ content, editor }: DecisionBodyProps) => (
  <DialogSection>
    <RichTextArea
      name="description"
      label={MSG.inputLabel}
      appearance={{ colorSchema: 'grey' }}
      content={content}
      editor={editor}
      // disabled={!hasReputation}
    />
  </DialogSection>
);

DecisionBody.displayName = displayName;

export default DecisionBody;
