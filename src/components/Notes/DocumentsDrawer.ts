// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Alpine, { AlpineComponent } from "alpinejs";
import { StateStore } from "@utils/enums.js";
import { setNotesRuleStatus } from "../../actions/notesActions";
import SkeletonLoaderEvent from "../../events/SkeletonLoaderEvent";
import shareNotesService from "../../services/notesSharesService";
import {
  setCloneNote,
  setRemoveSharedInvitations,
} from "../../actions/sharedNotesActions";
import { isNoteShared } from "@components/view/pathology-tabs/pathologyTab.controller";

/**
 * @return {import("alpinejs").AlpineComponent<any>}
 */

function DocumentsDrawer(): AlpineComponent<any> {
  const notesStore =
    /** @type {import("@store/myNotes.store").INotesStore} */ Alpine.store(
      StateStore.MY_NOTES
    );

  const shareStore =
    /** @type import('../../store/share.store').IShareStore */ Alpine.store(
      StateStore.SHARE
    );

  const userStore =
    /** @type {import("@store/user.store").IUserStore} */ Alpine.store(
      StateStore.USER
    );

  return {
    drawerBackdrop() {
      return {
        ["x-show"]: () => notesStore.drawerOpened,
        ["x-on:click.self"]: async () => await handleCloseDrawer(),
        ["x-transition.opacity"]: "",
      };
    },
    drawerElem() {
      return {
        ["x-show"]: () => notesStore.drawerOpened,
        ["x-transition.scale.origin.right"]: "",
        ["x-transition:enter.scale.80"]: "",
        ["x-transition:enter.scale.90"]: "",
      };
    },
    drawerLoading() {
      return {
        ["x-show"]: () => notesStore.isNoteLoading,
      };
    },
    drawerContent() {
      return {
        ["x-show"]: () => !notesStore.isNoteLoading,
      };
    },
    drawerClose() {
      return {
        ["x-on:click.prevent.self"]: async () => await handleCloseDrawer(),
      };
    },
    actions: {
      edit() {
        return {
          ["x-on:click.prevent"]: () => {
            Alpine.store("modalStore").openModal(notesStore.noteOpened.note);
          },
          ["x-show"]: () => {
            return (
              notesStore.noteOpened.note &&
              !isNoteShared(notesStore.noteOpened.note, userStore)
            );
          },
        };
      },
      share() {
        return {
          ["x-show"]: () => {
            return (
              notesStore.noteOpened.note &&
              !isNoteShared(notesStore.noteOpened.note!, userStore)
            );
          },
          ["@click.prevent"]: async () => {
            const note = notesStore.noteOpened?.note;
            const isShareActive = note ? !!note["can_share"] : false;

            Alpine.store(StateStore.MODAL).showSharingOptions = true;
            shareStore.shareSwitch = isShareActive;
            shareStore.shareOptionsEnabled = isShareActive;
            shareStore.showSharingOptions = isShareActive;
            shareStore.activeNote = note;
            try {
              if (isShareActive && note) {
                const res = await shareNotesService.getSharedInfoFromNote({
                  noteId: note._id,
                });

                const { emails, linkId } = res.data;

                shareStore.activeNoteEmailList = emails;
                shareStore.activeNotePublicLink = linkId;
              }
            } catch (err) {
              console.error(err);
            }
          },
        };
      },
      delete() {
        return {
          ["x-show"]: () => {
            return (
              notesStore.noteOpened.note &&
              !isNoteShared(notesStore.noteOpened.note!, userStore)
            );
          },
          ["x-on:click.prevent"]: () => {
            const noteId = notesStore.noteOpened.note?._id;
            Alpine.store(StateStore.MODAL).deleteList = [noteId];
            Alpine.store(StateStore.MODAL).showBeforeDelete = true;
          },
        };
      },
    },

    /**
     *
     * @param {Event} ev
     * @returns {Promise<void>}
     */
    async drawerDeleteOne(ev) {
      ev.preventDefault();

      const noteId = notesStore.noteOpened.note?._id;
      Alpine.store(StateStore.MODAL).deleteList = [noteId];
      Alpine.store(StateStore.MODAL).showBeforeDelete = true;
    },
    drawerEdit(ev) {
      ev.preventDefault();
      Alpine.store("modalStore").openModal(notesStore.noteOpened.note);
    },
    drawerShare() {
      return {
        ["@click.prevent"]: async () => {
          const note = notesStore.noteOpened?.note;
          const isShareActive = note ? !!note["can_share"] : false;

          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelector(".search_result_wrapper.partage"),
            true
          );
          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelectorAll(
              ".activer_par_wrapper .text-size-regular, .activer_par_wrapper .text-size-small"
            ),
            true
          );
          Alpine.store(StateStore.MODAL).showSharingOptions = true;
          shareStore.shareSwitch = isShareActive;
          shareStore.shareOptionsEnabled = isShareActive;
          shareStore.showSharingOptions = isShareActive;
          shareStore.activeNote = note;
          try {
            if (isShareActive && note) {
              const res = await shareNotesService.getSharedInfoFromNote({
                noteId: note._id,
              });

              const { emails, linkId } = res.data;

              shareStore.activeNoteEmailList = emails;
              shareStore.activeNotePublicLink = linkId;
            }
          } catch (err) {
            console.error(err);
          }
          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelector(".search_result_wrapper.partage"),
            false
          );
          SkeletonLoaderEvent.dispatchCustomEvent(
            document.querySelectorAll(
              ".activer_par_wrapper .text-size-regular, .activer_par_wrapper .text-size-small"
            ),
            false
          );
        },
      };
    },

    // shared page
    drawerClone() {
      return {
        ["x-on:click.prevent"]: async () => {
          const { note } = notesStore.noteOpened;
          if (!note) throw new Error("No note id found");

          const noteId = note._id;
          await setCloneNote({ noteId });
        },
      };
    },
    drawerRemoveAccess: function () {
      return {
        ["x-on:click.prevent"]: async () => {
          const { note } = notesStore.noteOpened;
          if (!note) throw new Error("No note id found");
          const noteId = note._id;
          const res = await setRemoveSharedInvitations({ noteIds: [noteId] });

          if (!(res.data.deletedCount > 0)) {
            // dont close modal
            return;
          }

          // close modal
          // Reset drawer
          const pageNumber = notesStore.noteListMeta.pageNumber || "";
          const documentType = notesStore.noteListType;

          // Redirect to list
          const listRedirect = `/list?type=${
            documentType ? documentType : "all"
          }${pageNumber && "&page=" + pageNumber}`;
          window.PineconeRouter.currentContext.navigate(listRedirect);

          // Reset document object in store
          console.log("close drawer");
          await setNotesRuleStatus();
          notesStore.noteOpened = {
            note: null,
            member: null,
          };
        },
      };
    },

    // Getters
    getOneTitle() {
      return {
        ["x-text"]: "$store.notesStore.noteOpened?.note?.title || ''",
      };
    },
    getOneCreatedOn() {
      return {
        ["x-text"]:
          "new Date($store.notesStore.noteOpened?.note?.created_on).toLocaleDateString('fr-FR')",
      };
    },
    getOneRichText() {
      return {
        ["x-html"]: "$store.notesStore.noteOpened?.note?.rich_text_ordo",
      };
    },
    getAuthor() {
      return {
        ["x-text"]:
          "($store.notesStore.noteOpened?.member?.lastName === undefined && $store.notesStore.noteOpened?.member?.name === undefined) ? 'Non renseigné' : ($store.notesStore.noteOpened?.member?.name || 'Non renseigné') + ' ' + ($store.notesStore.noteOpened.member.lastName || 'Non renseigné')",
      };
    },
    copyBtn() {
      return {
        ["x-show"]:
          "$store.notesStore.noteOpened.note?.type === 'prescriptions'",
      };
    },
    printBtn() {
      return {
        ["x-show"]:
          "$store.notesStore.noteOpened.note?.type === 'recommendations'",
      };
    },
    getFiles() {
      return {
        ["x-for"]: "file in $store.notesStore.noteOpened.note?.documents",
      };
    },
    listPathologies() {
      return {
        ["x-for"]: "ptag in $store.notesStore.noteOpened.note?.pathologies",
      };
    },
  };
}

export async function handleCloseDrawer() {
  const notesStore = /**
   * @type {import("@store/myNotes.store").INotesStore}
   */ Alpine.store(StateStore.MY_NOTES);

  const userStore = /**
   * @type {import("@store/user.store").IUserStore}
   */ Alpine.store(StateStore.USER);

  if (window.location.pathname.includes("/pathologies")) {
    notesStore.drawerOpened = false;
  } else {
    notesStore.drawerOpened = false;
    // Reset drawer
    const pageNumber = notesStore.noteListMeta.pageNumber || "";
    const documentType = notesStore.noteListType;

    // Redirect to list
    const listRedirect = `/list?type=${documentType ? documentType : "all"}${
      pageNumber && "&page=" + pageNumber
    }`;

    window.PineconeRouter.currentContext.navigate(listRedirect);
    await setNotesRuleStatus({ noteStore: notesStore, userStore });
  }
  // Reset document object in store
  console.log("close drawer");
  notesStore.drawerOpened = false;
  notesStore.noteOpened = {
    note: null,
    member: null,
  };
}

export default DocumentsDrawer;
