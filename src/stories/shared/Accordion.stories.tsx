import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Accordion from '~shared/Extensions/Accordion/Accordion';
import { accordionMocksContent } from '~shared/Extensions/Accordion/const';
import { useAccordion } from '~shared/Extensions/Accordion/hooks';

const meta: Meta<typeof Accordion> = {
  title: 'Shared/Accordion',
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const AccordionWithHooks = () => {
  const { openIndex, onOpenIndexChange } = useAccordion();

  return <Accordion openIndex={openIndex} onOpenIndexChange={onOpenIndexChange} items={accordionMocksContent} />;
};

export const Base: Story = {
  render: () => <AccordionWithHooks />,
};
