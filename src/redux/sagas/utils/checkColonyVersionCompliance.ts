import { ColonyVersion } from '~constants';
import { type ColonyFragment } from '~gql';

export const checkColonyVersionCompliance = ({
  colony,
  minimumColonyVersion = ColonyVersion.V15,
}: {
  colony: ColonyFragment;
  minimumColonyVersion?: ColonyVersion;
}) => {
  if (colony.version < minimumColonyVersion) {
    throw new Error(
      `This is only available in Colony version ${minimumColonyVersion} and above. Your current colony version is ${colony.version}.`,
    );
  }
};
