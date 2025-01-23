/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "astro:content" {
  export function defineCollection(args: { loader: any; schema: any }): any;
}
