// import { useColonyReputationQuery } from '~data/index';
import { Address } from '~types';

/*
 * @TODO This needs to be addressed and either refactored or removed
 */

const useColonyReputation = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colonyAddress: Address,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  domainId?: number,
) => {
  return true;
  // const { data, error } = useColonyReputationQuery({
  //   variables: {
  //     address: colonyAddress,
  //     domainId,
  //   },
  // });
  // return data?.colonyReputation !== '0' && !error;
};

export default useColonyReputation;
