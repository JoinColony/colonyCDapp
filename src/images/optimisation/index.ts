import ImageBlobReduce, { Options } from 'image-blob-reduce';

import getFileReader from '~utils/fileReader';

const reducer = new ImageBlobReduce();

const DEFAULT_THUMBNAIL_MAX_DIMENSION = 128; // Largest dimension won't exceed 128px.
const DEFAULT_USER_AVATAR_MAX_DIMENSION = 500;

const fileReader = getFileReader();

const getOptimisedBlob = (file: File, options: Options) =>
  reducer.toBlob(file, options);

const createOptimisedImage = async (file: File, max: number) => {
  const blob = await getOptimisedBlob(file, {
    max,
  });
  const [content] = await fileReader([blob]);
  return content;
};

const getOptimisedImage = async (file: File | undefined, max: number) => {
  if (file) {
    return (await createOptimisedImage(file, max)).data;
  }

  return null;
};

export const getOptimisedThumbnail = (file: File | undefined) =>
  getOptimisedImage(file, DEFAULT_THUMBNAIL_MAX_DIMENSION);

export const getOptimisedAvatar = (file: File | undefined) =>
  getOptimisedImage(file, DEFAULT_USER_AVATAR_MAX_DIMENSION);
