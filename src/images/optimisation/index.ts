import ImageBlobReduce, { Options } from 'image-blob-reduce';

import getFileReader from '~utils/fileReader';

const reducer = new ImageBlobReduce();

const DEFAULT_THUMBNAIL_MAX_DIMENSION = 128; // Largest dimension won't exceed 128px.

const fileReader = getFileReader();

const getOptimisedBlob = (file: File, options: Options) =>
  reducer.toBlob(file, options);

const createOptimisedThumbnail = async (
  file: File,
  max: number = DEFAULT_THUMBNAIL_MAX_DIMENSION,
) => {
  const blob = await getOptimisedBlob(file, {
    max,
  });
  const [content] = await fileReader([blob]);
  return content;
};

export const getThumbnail = async (file: File | undefined) => {
  if (file) {
    return (await createOptimisedThumbnail(file)).data;
  }

  return null;
};
