declare module '*.css' {
  interface ClassNames {
    [className: string]: string;
  }
  const classNames: ClassNames;
  export = classNames;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

interface Window {
  dataLayer: any[];
}

// Alternatively, if you want a more specific type for dataLayer entries
interface DataLayerObject {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

interface Window {
  dataLayer: DataLayerObject[];
  Beamer: any;
}
