const queryStringGenerator = (url, filters) => {
  let modifiedUrl = url;
  let flag = false;

  Object.entries(filters).map(([key, value]) => {
    if (!value) {
      return;
    } else if (!flag) {
      modifiedUrl += `?${key}=${value}`;
      flag = true;
    } else {
      modifiedUrl += `&${key}=${value}`;
    }
  });
  return modifiedUrl;
};

export default queryStringGenerator;
