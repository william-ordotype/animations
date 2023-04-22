window.handlePagination = (k, v, params) => {
    const [route, hashParams] = location.hash.split("?");
    const h = hashParams ? hashParams.split("&") : hashParams;
    let cParams = [];

    for (const [key, value] of Object.entries({ ...params })) {
        if (key === k) {
            cParams.push([key, v].join("="));
        }
    }
    cParams.length > 0 ? cParams.join("&") : (cParams = [k, v].join("="));
    location.hash = `${route}?${cParams}`;
};
