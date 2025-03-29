/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
  

declare const API_HOST:string;
declare const API_PORT:string;
declare const FRONT_PORT:string;
declare const AUTH_TOKEN:string;
declare const FRONT_HOST:string;