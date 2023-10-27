import type { Meta, StoryObj } from '@storybook/react';
import ColonyAvatar from '~v5/shared/ColonyAvatar';

const colonyAvatarMeta: Meta<typeof ColonyAvatar> = {
  title: 'Shared/Colony Avatar',
  component: ColonyAvatar,
  args: {
    chainImageProps: {
      src: 'https://placekitten.com/20/20',
    },
  },
};

export default colonyAvatarMeta;

export const Base: StoryObj<typeof ColonyAvatar> = {};

export const WithImage: StoryObj<typeof ColonyAvatar> = {
  args: {
    colonyImageProps: {
      src: 'https://placekitten.com/200/200',
    },
  },
};
