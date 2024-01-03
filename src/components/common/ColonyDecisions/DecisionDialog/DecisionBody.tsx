import { Editor } from '@tiptap/react';
import React from 'react';
import { defineMessages } from 'react-intl';

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
  disabled: boolean;
}

const DecisionBody = ({ content, editor, disabled }: DecisionBodyProps) => (
  <DialogSection>
    <RichTextArea
      name="description"
      label={MSG.inputLabel}
      appearance={{ colorSchema: 'grey' }}
      content={content}
      editor={editor}
      disabled={disabled}
    />
  </DialogSection>
);

DecisionBody.displayName = displayName;

export default DecisionBody;
