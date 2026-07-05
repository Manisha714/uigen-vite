declare module "@babel/standalone" {
  export function transform(
    code: string,
    options: {
      filename?: string;
      presets?: any[];
      plugins?: any[];
    }
  ): { code: string };
}
