import { default as MsTypes } from "@memberstack/dom/lib/index";
import PineconeRouter from "pinecone-router";
import { errorMessageFr } from "../validation/errorMessages.js";
import { AxiosStatic } from "axios";

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
    axios: AxiosStatic;

    PineconeRouter: PineconeRouter;
    toastActionMsg: ToDo;
    validationMsgCustom: typeof errorMessageFr;
    router: ToDo;
  }

  type ToDo = any;
}
