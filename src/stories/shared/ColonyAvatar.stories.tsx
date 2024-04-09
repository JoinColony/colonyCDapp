import { Bird } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';

import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';

const colonyAvatarMeta: Meta<typeof ColonyAvatar> = {
  title: 'Shared/Colony Avatar',
  component: ColonyAvatar,
};

export default colonyAvatarMeta;

export const Base: StoryObj<typeof ColonyAvatar> = {};

export const WithImage: StoryObj<typeof ColonyAvatar> = {
  args: {
    colonyImageSrc: 'https://placekitten.com/200/200',
  },
};

export const WithChainImage: StoryObj<typeof ColonyAvatar> = {
  args: {
    colonyImageSrc: 'https://placekitten.com/200/200',
    chainIcon: Bird,
  },
};
