import CalamityBanner from '~v5/shared/CalamityBanner/index.ts';
import { type CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types.ts';

import type { Meta, StoryObj } from '@storybook/react';

const calamityBannerItems: CalamityBannerItemProps[] = [
  {
    key: '1',
    linkProps: {
      to: 'https://github.com/JoinColony/colonyNetwork/releases',
      text: 'Learn more',
    },
    buttonProps: {
      text: 'Upgrade',
      disabled: false,
      onClick: () => {},
    },
    mode: 'info',
    title: 'A new version of the Colony Network is available!',
  },
  {
    key: '2',
    linkProps: {
      to: 'https://github.com/JoinColony/colonyNetwork/releases',
      text: 'Learn more',
    },
    buttonProps: {
      text: 'Exit recover mode',
      disabled: false,
      onClick: () => {},
    },
    mode: 'error',
    title:
      'The Colony is in Recovery mode. You are unable to perform any actions until Recovery Mode is exited.',
  },
];

const calamityBannerMeta: Meta<typeof CalamityBanner> = {
  title: 'Common/Calamity Banner',
  component: CalamityBanner,
  args: {
    items: calamityBannerItems,
  },
};

export default calamityBannerMeta;

export const Base: StoryObj<typeof CalamityBanner> = {};
