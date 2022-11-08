const formatQuery = args => {
    const p = JSON.stringify(args, null, 2);
    const result = JSON.parse(p);
    return result;
};

module.exports = formatQuery;
