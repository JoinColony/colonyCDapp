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
    return createOptimisedImage(file, max);
  }

  return null;
};

export const getOptimisedThumbnail = async (file: File | undefined) =>
  (await getOptimisedImage(file, DEFAULT_THUMBNAIL_MAX_DIMENSION))?.data ??
  null;

export const getOptimisedAvatarUnder300KB = async (file: File | undefined) => {
  let img = await getOptimisedImage(file, DEFAULT_USER_AVATAR_MAX_DIMENSION);
  let maxDimension = DEFAULT_USER_AVATAR_MAX_DIMENSION;
  // dynamo db limit is 400kb, therefore ensure img is under 300kb just to be sure we don't exceed it
  while (maxDimension > 0 && img && img.size > 300_000) {
    maxDimension -= 100;
    // eslint-disable-next-line no-await-in-loop
    img = await getOptimisedImage(file, maxDimension);
  }

  if (!img || img.size > 300_000) {
    console.error('Image could not be compressed under 300kb');
    return null;
  }

  return img.data;
};
