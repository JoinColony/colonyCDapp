import Breadcrumbs from '~v5/shared/Breadcrumbs/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const breadcrumbsMeta: Meta<typeof Breadcrumbs> = {
  title: 'Shared/Breadcrumbs',
  component: Breadcrumbs,
  args: {},
};

export default breadcrumbsMeta;

export const Base: StoryObj<typeof Breadcrumbs> = {};
