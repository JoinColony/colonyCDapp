import { ColonyVersion } from '~constants';
import { type ColonyFragment } from '~gql';
import { type ActionTypes } from '~redux/actionTypes.ts';

export const checkColonyVersionCompliance = ({
  colony,
  actionType,
  minimumColonyVersion = ColonyVersion.V15,
}: {
  colony: ColonyFragment;
  actionType: ActionTypes;
  minimumColonyVersion?: ColonyVersion;
}) => {
  if (colony.version < minimumColonyVersion) {
    throw new Error(
      `Action: ${actionType} is only available in Colony version ${minimumColonyVersion} and above.`,
    );
  }
};
