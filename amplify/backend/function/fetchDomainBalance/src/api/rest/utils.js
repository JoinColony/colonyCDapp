const buildAPIEndpoint = (
    url,
    queryParams
) => {
    Object.keys(queryParams).forEach((key) =>
        url.searchParams.append(key, queryParams[key]),
    );
    return url.href;
};

module.exports = {
    buildAPIEndpoint
};