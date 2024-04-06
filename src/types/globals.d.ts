import { default as MsTypes } from "@memberstack/dom/lib/index";
/// <reference types="alpinejs" />

declare global {
  interface Window {
    Alpine: Alpine;
    $memberstackReady: boolean;
    $memberstackDom: ReturnType<typeof MsTypes.init>;
    globals: any;
    $: jQuery;
    mainPlansIds: string[];
    memberToken: string;
    Webflow: any;
  }
}
