// import { useColonyReputationQuery } from '~data/index';
// import { Address } from '~types/index';

/*
 * @TODO This needs to be addressed and either refactored or removed
 */

// export const useColonyReputation = (
//   colonyAddress: Address,
//   domainId?: number,
// ) => {
//   const { data, error } = useColonyReputationQuery({
//     variables: {
//       address: colonyAddress,
//       domainId,
//     },
//   });

//   return data?.colonyReputation !== '0' && !error;
// };

const useColonyReputation = () => true;

export default useColonyReputation;
