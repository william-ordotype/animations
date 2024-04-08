import { default as MsTypes } from "@memberstack/dom/lib/index";
import PineconeRouter from "pinecone-router";
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

    PineconeRouter: PineconeRouter;
    toastActionMsg: any;
  }

  type ToDo = any;
}
