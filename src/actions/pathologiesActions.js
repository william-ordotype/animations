import PathologiesService from "../services/pathologiesService";

const pathologyService = new PathologiesService();

async function searchIdBySlug(payload) {
  const { pathologySlug } = payload;
  try {
    const a = await pathologyService.searchBySlug(pathologySlug);
  } catch (err) {}
}
