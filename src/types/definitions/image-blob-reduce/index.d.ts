declare module 'image-blob-reduce' {
  // Source: https://github.com/nodeca/image-blob-reduce

  import pica, { PicaResizeOptions } from '@types/pica';

  /* eslint-disable @typescript-eslint/ban-types */
  export default class ImageBlobReduce {
    pica: pica;

    initialized: boolean;

    /** Downscale image to fit into max*max size. If blob contains jpeg, then orientation is applied and metadata from original image reused (with minimal change). */
    toBlob: (in_blob: Blob, options: Options) => Promise<Blob>;

    /** The same as .toBlob(), but with canvas output. */
    toCanvas: (in_blob: Blob, options: Options) => Promise<HTMLCanvasElement>;

    /** Inject custom handler before specified method */
    before: (methodName: string, fn: Function) => void;

    /** Inject custom handler after specified method */
    after: (methodName: string, fn: Function) => void;

    /** Sugar to simplify assign of external plugins. Just calls plugin_init(this, ...params). */
    use: (pluginInit: Function, ...params: any) => this;
  }
  /* eslint-enable @typescript-eslint/ban-types */

  export interface Options extends PicaResizeOptions {
    /** Max allowed image size */
    max: number;
  }
}
