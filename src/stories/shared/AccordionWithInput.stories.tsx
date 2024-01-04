import React from 'react';

import Accordion from '~shared/Extensions/Accordion';
import { accordionMocksContent } from '~shared/Extensions/Accordion/consts';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';
import { AccordionContent } from '~shared/Extensions/Accordion/types';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Accordion> = {
  title: 'Shared/Accordion With Input',
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const AccordionWithHooks = () => {
  const { openIndex, onOpenIndexChange } = useAccordion();

  return (
    <Accordion
      openIndex={openIndex}
      onOpenIndexChange={onOpenIndexChange}
      items={accordionMocksContent as AccordionContent[]}
    />
  );
};

export const Base: Story = {
  render: () => <AccordionWithHooks />,
};
