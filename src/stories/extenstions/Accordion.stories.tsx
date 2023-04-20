import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import Accordion from '~shared/Extensions/Accordion/Accordion';
import { accordionMocksContent } from '~shared/Extensions/Accordion/Accordion.mocks';

const meta: Meta<typeof Accordion> = {
  title: 'Extensions/Accordion',
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const AccordionWithHooks = () => {
  const [openIndex, setOpenIndex] = useState<number>();

  return <Accordion openIndex={openIndex} onOpenIndexChange={setOpenIndex} items={accordionMocksContent} />;
};

export const Primary: Story = {
  render: () => <AccordionWithHooks />,
};
