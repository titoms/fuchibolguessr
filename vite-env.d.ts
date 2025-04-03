/// <reference types="vite/client" />

import 'vite';

declare module 'vite' {
  interface ServerOptions {
    allowedHosts?: true | string[] | 'all' | undefined;
  }
}