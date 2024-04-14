import { hashToObject, objectToHash } from "@utils/pagination";

const handlePagination = (routerParams, pageNumber) => {
  const page = pageNumber || routerParams.page;
  let newQuery;

  if (pageNumber > Alpine.store("documentsStore").getList.pageTotal) {
    console.log("No more pages");
    return;
  }
  if (routerParams.path.includes("?")) {
    const query = routerParams.path.split("?");
    const hashObj = hashToObject(query[1]);
    hashObj.page = page;
    const urlHash = objectToHash(hashObj);
    newQuery = query[0] + "?" + urlHash;
  } else {
    newQuery = routerParams.path + "?page=" + page;
  }
  routerParams.navigate(newQuery);
};

const handleItemsPerPage = (routerParams, limit) => {
  const perPage = limit || routerParams.perPage;
  let newQuery;

  if (routerParams.path.includes("?")) {
    const query = routerParams.path.split("?");
    const hashObj = hashToObject(query[1]);
    hashObj.perPage = perPage;
    const urlHash = objectToHash(hashObj);
    newQuery = query[0] + "?" + urlHash;
  } else {
    newQuery = routerParams.path + "?perPage=" + perPage;
  }
  routerParams.navigate(newQuery);
};

const handleSorting = (routerParams, sortBy, directionOrder = "DESC") => {
  const sort = sortBy || routerParams.sort;
  const direction = directionOrder || routerParams.directionOrder;
  let newQuery;

  if (routerParams.path.includes("?")) {
    const query = routerParams.path.split("?");
    const hashObj = hashToObject(query[1]);
    hashObj.sort = sort;
    hashObj.direction = direction;
    const urlHash = objectToHash(hashObj);
    newQuery = query[0] + "?" + urlHash;
  } else {
    newQuery = routerParams.path + "?sort=" + sort + "&direction=" + direction;
  }
  routerParams.navigate(newQuery);
};

export { handleSorting, handlePagination, handleItemsPerPage };
