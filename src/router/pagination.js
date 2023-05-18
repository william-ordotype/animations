// Function to convert location.hash to an object
function hashToObject(hash) {
  let hashObj = {};

  if (hash !== "") {
    // check if hash is not empty
    hash.split("&").forEach(function (pair) {
      // split hash by "&" character
      let keyValue = pair.split("="); // split each pair by "=" character
      hashObj[keyValue[0]] = decodeURIComponent(keyValue[1] || ""); // set object property with key and value, decoding the URI component
    });
  }

  return hashObj;
}

// Function to convert an object to location.hash
function objectToHash(obj) {
  let hash = "";

  Object.keys(obj).forEach(function (key) {
    // loop through each object property
    let value = encodeURIComponent(obj[key]); // encode URI component of the property value
    hash += key + "=" + value + "&"; // concatenate key-value pair with "&" character
  });

  if (hash !== "") {
    // remove the last "&" character if hash is not empty
    hash = hash.slice(0, -1); // add "#" character to the beginning of the hash string
  }

  return hash;
}

window.handlePagination = (routerParams, pageNumber) => {
  debugger;
  const page = pageNumber || routerParams.page;
  let newQuery;

  if(pageNumber > Alpine.store('documentsStore').getList.pageTotal) {
    console.log('No more pages')
    return;
  }
  if (routerParams.path.includes("?")) {
    const query = routerParams.path.split("?");
    const hashObj = hashToObject(query[1]);

    if (hashObj.page) {
      hashObj.page = page;
    }
    const urlHash = objectToHash(hashObj);
    newQuery = query[0] + "?" + urlHash;
  } else {
    newQuery = routerParams.path + "?page=" + page;
  }

  routerParams.navigate(newQuery);
};
