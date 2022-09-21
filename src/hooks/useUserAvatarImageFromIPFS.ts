// import { useDataFetcher } from './index';
// import { IPFSAvatarImage } from '~types/index';

// import { ipfsDataFetcher } from '../../modules/core/fetchers';

/*
 * @TODO This needs to be addressed and either refactored or removed
 */

// const useUserAvatarImageFromIPFS = (ipfsHash: string): IPFSAvatarImage => {
//   let avatarObject: IPFSAvatarImage = { image: undefined };
//   const { data: avatar } = useDataFetcher(
//     ipfsDataFetcher,
//     [ipfsHash],
//     [ipfsHash],
//   );
//   try {
//     avatarObject = JSON.parse(avatar);
//   } catch (error) {
//     /*
//      * @NOTE Silent error
//      * Most users won't have an avatar, so this will get triggered quite a lot
//      * and that's ok, it's expected
//      */
//   }
//   return avatarObject;
// };

const useUserAvatarImageFromIPFS = (...args) => args;

export default useUserAvatarImageFromIPFS;
