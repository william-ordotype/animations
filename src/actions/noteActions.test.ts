import { beforeEach, describe, vi, afterEach, test, expect, it } from "vitest";

import {
  setNoteItemOpen,
  setNoteList,
  setNoteOpened,
  setNotesRuleStatus,
} from "./notesActions";
import NotesService, {
  PaginatedNoteListExtended,
} from "@services/notesService";
import { notesInitialStore } from "../tests/static/store/notes.store.initial";
import getAll from "../tests/static/api/notes.getList.response.filled.json";
import getOne from "../tests/static/api/notes.getOne.response.json";
import getRules from "../tests/static/api/note-rules.status.response.json";
import { axiosSuccessTemplate } from "../tests/static/api/axios.template.response";

import toasterActions from "./toasterActions";
import { NoteItem, NoteList, NoteRules } from "@interfaces/apiTypes/notesTypes";
import { AxiosResponse } from "axios";
import { noteActionsToastMsgs } from "@utils/toastMessages";
import { freeUserStore } from "../tests/static/store/user.store.auth.free";
import { unAuthUserStore } from "../tests/static/store/user.store.unauth";

vi.mock("@services/notesService");
vi.stubGlobal("toastActionMsg", {
  notes: {
    ...noteActionsToastMsgs,
  },
});

describe("Note List setter", () => {
  let notesStore: typeof notesInitialStore;

  beforeEach(() => {
    notesStore = { ...notesInitialStore }; // Ensure a deep copy to prevent shared state between tests
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("loading status is true before calling getList", async () => {
    vi.mocked(NotesService.prototype.getList).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getAll as PaginatedNoteListExtended<NoteList>,
    } as AxiosResponse<PaginatedNoteListExtended<NoteList>>);

    expect(notesStore.isNotesLoading).toBe(true);
    await setNoteList(
      { page: 1, direction: "DESC", sort: "created_by", limit: 10 },
      { noteStore: notesStore }
    );
  });
  test("loading status is false after getList responds", async () => {
    vi.mocked(NotesService.prototype.getList).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getAll as PaginatedNoteListExtended<NoteList>,
    } as AxiosResponse<PaginatedNoteListExtended<NoteList>>);

    await setNoteList(
      { page: 1, direction: "DESC", sort: "created_by", limit: 10 },
      { noteStore: notesStore }
    );
    expect(notesStore.isNotesLoading).toBe(false);
  });
  it("should return correct pagination from response", async () => {
    vi.mocked(NotesService.prototype.getList).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getAll as PaginatedNoteListExtended<NoteList>,
    } as AxiosResponse<PaginatedNoteListExtended<NoteList>>);

    const expectedPagination = {
      items_per_page: 10,
      items_total: 25,
      page_number: 1,
      page_total: 3,
    };

    await setNoteList(
      { page: 1, direction: "DESC", sort: "created_by", limit: 10 },
      { noteStore: notesStore }
    );
    expect(notesStore.noteListMeta.itemsPerPage).toBe(
      expectedPagination.items_per_page
    );
    expect(notesStore.noteListMeta.itemsTotal).toBe(
      expectedPagination.items_total
    );
    expect(notesStore.noteListMeta.pageNumber).toBe(
      expectedPagination.page_number
    );
    expect(notesStore.noteListMeta.pageTotal).toBe(
      expectedPagination.page_total
    );
  });
  it("should execute alert after a failed response from server", async () => {
    vi.mocked(NotesService.prototype.getList).mockRejectedValueOnce({
      status: 404,
      statusText: "Not Found",
    });
    const spy = vi
      .spyOn(toasterActions, "setToastMessage")
      .mockReturnValueOnce();

    await setNoteList(
      { page: 1, direction: "DESC", sort: "created_by", limit: 10 },
      { noteStore: notesStore }
    );
    expect(spy).toHaveBeenCalledOnce;
  });
});

describe("SetNoteOpened - Deprecated", () => {
  let notesStore: typeof notesInitialStore;

  beforeEach(() => {
    notesStore = { ...notesInitialStore }; // Ensure a deep copy to prevent shared state between tests
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("loading status is true before calling getOne", async () => {
    vi.mocked(NotesService.prototype.getOne).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getOne as NoteItem,
    } as AxiosResponse<NoteItem>);

    expect(notesStore.isNoteLoading).toBe(true);
    await setNoteOpened("12345", {
      noteStore: notesStore,
      modalStore: { showModal: false },
    });
  });

  test("loading status is false after calling getOne", async () => {
    vi.mocked(NotesService.prototype.getOne).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getOne as NoteItem,
    } as AxiosResponse<NoteItem>);

    await setNoteOpened("12345", {
      noteStore: notesStore,
      modalStore: { showModal: false },
    });
    expect(notesStore.isNoteLoading).toBe(false);
  });

  test("correctly populates noteOpen object", async () => {
    vi.mocked(NotesService.prototype.getOne).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getOne as NoteItem,
    } as AxiosResponse<NoteItem>);

    await setNoteOpened("12345", {
      noteStore: notesStore,
      modalStore: { showModal: false },
    });

    expect(notesStore.noteOpened.note).toEqual({
      _id: "65ff0517ff5d3087dd8a7e24",
      created_by: {
        role: "client",
        email: "raquelcle@gmail.com",
        full_name: "name last name",
      },
      member_id: "mem_cl9kd859p01fz0s8s0tgoh27v",
      title: "special char and pdf",
      type: "notes",
      rich_text_ordo: "<p>This is a text rich <strong>text</strong></p>",
      prescription_type: "",
      created_on: "2024-03-23T16:36:39.284Z",
      updated_on: "2024-05-21T17:52:44.815Z",
      pathologies: [
        {
          _id: "63b4b1d5714fbf406661a0bb",
          title: "Acné",
          slug: "acne",
        },
      ],
      updated_by: {
        role: "client",
        email: "raquelcle@gmail.com",
        full_name: "name last name",
      },
      documents: [
        {
          _id: "65ff0517ff5d3087dd8a7e25",
          member_id: "mem_cl9kd859p01fz0s8s0tgoh27v",
          file_name: "pro__file__-fote___17112117994140.jpeg",
          file_url:
            "https://ordotype-assets.fra1.digitaloceanspaces.com/mem_cl9kd859p01fz0s8s0tgoh27v/pro__file__-fote___17112117994140.jpeg",
          size: 17405,
          mime_type: "image/jpeg",
          original_name: "proÌfileÌ-foteÌ.jpeg",
          thumbnail_name: "pro__file__-fote___17112117994140_thumbnail.jpeg",
          thumbnail_url:
            "https://ordotype-assets.fra1.digitaloceanspaces.com/mem_cl9kd859p01fz0s8s0tgoh27v/pro__file__-fote___17112117994140_thumbnail.jpeg",
          note_id: "65ff0517ff5d3087dd8a7e24",
          created_on: "2024-03-23T16:36:39.979Z",
          updated_on: "2024-03-23T16:36:39.979Z",
        },
        {
          _id: "65ff0518ff5d3087dd8a7e26",
          member_id: "mem_cl9kd859p01fz0s8s0tgoh27v",
          file_name: "recordatorio_abuelo_17112117994141.pdf",
          file_url:
            "https://ordotype-assets.fra1.digitaloceanspaces.com/mem_cl9kd859p01fz0s8s0tgoh27v/recordatorio_abuelo_17112117994141.pdf",
          size: 12399977,
          mime_type: "application/pdf",
          original_name: "recordatorio abuelo.pdf",
          thumbnail_name: "recordatorio_abuelo_17112117994141_thumbnail.png",
          thumbnail_url:
            "https://ordotype-assets.fra1.digitaloceanspaces.com/mem_cl9kd859p01fz0s8s0tgoh27v/recordatorio_abuelo_17112117994141_thumbnail.png",
          note_id: "65ff0517ff5d3087dd8a7e24",
          created_on: "2024-03-23T16:36:40.547Z",
          updated_on: "2024-03-23T16:36:40.547Z",
        },
      ],
    });
  });

  test("correctly populates note author object", async () => {
    vi.mocked(NotesService.prototype.getOne).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getOne as NoteItem,
    } as AxiosResponse<NoteItem>);

    await setNoteOpened("12345", {
      noteStore: notesStore,
      modalStore: { showModal: false },
    });

    expect(notesStore.noteOpened.member).toEqual({
      name: "name",
      lastName: "last name",
      email: "raquelcle@gmail.com",
    });
  });

  test("should execute alert after failing response from server", async () => {
    vi.mocked(NotesService.prototype.getOne).mockRejectedValueOnce({
      status: 404,
      statusText: "Not Found",
    });
    const spy = vi
      .spyOn(toasterActions, "setToastMessage")
      .mockReturnValueOnce();

    await setNoteOpened("12345", {
      noteStore: notesStore,
      modalStore: { showModal: false },
    });

    expect(spy).toHaveBeenCalledOnce;
  });
});

describe("setNoteItemOpen", () => {
  let notesStore: typeof notesInitialStore;

  beforeEach(() => {
    notesStore = { ...notesInitialStore }; // Ensure a deep copy to prevent shared state between tests
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("loading status is true before calling getOne", async () => {
    vi.mocked(NotesService.prototype.getOne).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getOne as NoteItem,
    } as AxiosResponse<NoteItem>);

    expect(notesStore.isNoteLoading).toBe(true);
    await setNoteItemOpen("12345", {
      noteStore: notesStore,
    });
  });

  test("loading status is false after calling getOne", async () => {
    vi.mocked(NotesService.prototype.getOne).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getOne as NoteItem,
    } as AxiosResponse<NoteItem>);

    await setNoteItemOpen("12345", {
      noteStore: notesStore,
    });
    expect(notesStore.isNoteLoading).toBe(false);
  });

  test("correctly populates noteOpen object", async () => {
    vi.mocked(NotesService.prototype.getOne).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getOne as NoteItem,
    } as AxiosResponse<NoteItem>);

    await setNoteItemOpen("12345", {
      noteStore: notesStore,
    });

    expect(notesStore.noteOpened.note).toEqual({
      _id: "65ff0517ff5d3087dd8a7e24",
      created_by: {
        role: "client",
        email: "raquelcle@gmail.com",
        full_name: "name last name",
      },
      member_id: "mem_cl9kd859p01fz0s8s0tgoh27v",
      title: "special char and pdf",
      type: "notes",
      rich_text_ordo: "<p>This is a text rich <strong>text</strong></p>",
      prescription_type: "",
      created_on: "2024-03-23T16:36:39.284Z",
      updated_on: "2024-05-21T17:52:44.815Z",
      pathologies: [
        {
          _id: "63b4b1d5714fbf406661a0bb",
          title: "Acné",
          slug: "acne",
        },
      ],
      updated_by: {
        role: "client",
        email: "raquelcle@gmail.com",
        full_name: "name last name",
      },
      documents: [
        {
          _id: "65ff0517ff5d3087dd8a7e25",
          member_id: "mem_cl9kd859p01fz0s8s0tgoh27v",
          file_name: "pro__file__-fote___17112117994140.jpeg",
          file_url:
            "https://ordotype-assets.fra1.digitaloceanspaces.com/mem_cl9kd859p01fz0s8s0tgoh27v/pro__file__-fote___17112117994140.jpeg",
          size: 17405,
          mime_type: "image/jpeg",
          original_name: "proÌfileÌ-foteÌ.jpeg",
          thumbnail_name: "pro__file__-fote___17112117994140_thumbnail.jpeg",
          thumbnail_url:
            "https://ordotype-assets.fra1.digitaloceanspaces.com/mem_cl9kd859p01fz0s8s0tgoh27v/pro__file__-fote___17112117994140_thumbnail.jpeg",
          note_id: "65ff0517ff5d3087dd8a7e24",
          created_on: "2024-03-23T16:36:39.979Z",
          updated_on: "2024-03-23T16:36:39.979Z",
        },
        {
          _id: "65ff0518ff5d3087dd8a7e26",
          member_id: "mem_cl9kd859p01fz0s8s0tgoh27v",
          file_name: "recordatorio_abuelo_17112117994141.pdf",
          file_url:
            "https://ordotype-assets.fra1.digitaloceanspaces.com/mem_cl9kd859p01fz0s8s0tgoh27v/recordatorio_abuelo_17112117994141.pdf",
          size: 12399977,
          mime_type: "application/pdf",
          original_name: "recordatorio abuelo.pdf",
          thumbnail_name: "recordatorio_abuelo_17112117994141_thumbnail.png",
          thumbnail_url:
            "https://ordotype-assets.fra1.digitaloceanspaces.com/mem_cl9kd859p01fz0s8s0tgoh27v/recordatorio_abuelo_17112117994141_thumbnail.png",
          note_id: "65ff0517ff5d3087dd8a7e24",
          created_on: "2024-03-23T16:36:40.547Z",
          updated_on: "2024-03-23T16:36:40.547Z",
        },
      ],
    });
  });

  test("correctly populates note author object", async () => {
    vi.mocked(NotesService.prototype.getOne).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getOne as NoteItem,
    } as AxiosResponse<NoteItem>);

    await setNoteItemOpen("12345", {
      noteStore: notesStore,
    });

    expect(notesStore.noteOpened.member).toEqual({
      name: "name",
      lastName: "last name",
      email: "raquelcle@gmail.com",
    });
  });

  test("should execute alert after failing response from server", async () => {
    vi.mocked(NotesService.prototype.getOne).mockRejectedValueOnce({
      status: 404,
      statusText: "Not Found",
    });
    const spy = vi
      .spyOn(toasterActions, "setToastMessage")
      .mockReturnValueOnce();

    await setNoteOpened("12345", {
      noteStore: notesStore,
      modalStore: { showModal: false },
    });

    expect(spy).toHaveBeenCalledOnce;
  });
});

describe("Note Rules setter", () => {
  let notesStore: typeof notesInitialStore;
  let freeUser: typeof freeUserStore;
  let unAuthUser: typeof unAuthUserStore;

  beforeEach(() => {
    notesStore = { ...notesInitialStore }; // Ensure a deep copy to prevent shared state between tests
    freeUser = { ...freeUserStore };
    unAuthUser = { ...unAuthUserStore };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("correctly populates note rules if user is auth", async () => {
    vi.mocked(NotesService.prototype.getRulesStatus).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getRules as NoteRules,
    } as AxiosResponse<NoteRules>);

    const expectedResult = {
      consumedNotesPercent: 35,
      consumedMegabytesPercent: 2.666666666666667,
      consumedNotesNumber: 21,
      consumedMegabytesNumber: 8,
      allowedNumberOfNotes: 60,
      allowedMegabyte: 300,
    };

    await setNotesRuleStatus({
      noteStore: notesStore,
      userStore: freeUser,
    });
    expect(notesStore.currentRuleStatus).toEqual(expectedResult);
  });
  test("don't render note rules if user is unAuth", async () => {
    vi.mocked(NotesService.prototype.getRulesStatus).mockResolvedValueOnce({
      ...axiosSuccessTemplate,
      data: getRules as NoteRules,
    } as AxiosResponse<NoteRules>);

    const expectedResult = {
      consumedNotesPercent: undefined,
      consumedMegabytesPercent: undefined,
      consumedNotesNumber: undefined,
      consumedMegabytesNumber: undefined,
      allowedNumberOfNotes: undefined,
      allowedMegabyte: undefined,
    };

    await setNotesRuleStatus({
      noteStore: notesStore,
      userStore: unAuthUser,
    });

    expect(notesStore.isRuleStatusLoading).toBe(true);
    expect(notesStore.currentRuleStatus).toEqual(expectedResult);
  });
});
