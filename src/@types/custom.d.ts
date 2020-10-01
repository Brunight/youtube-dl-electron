declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

declare module '*.ttf' {
  const value: any;
  export = value;
}

declare module 'electron-clipboard-watcher';
declare module 'metaflac-js';
