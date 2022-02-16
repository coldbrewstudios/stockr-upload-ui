// http client (fetch wrapper)

export function http(url = "", options = {}) {
  const baseURL = process.env.VUE_APP_API_BASE_URI
    ? process.env.VUE_APP_API_BASE_URI
    : "https://booqnly-stockr.herokuapp.com";
  return fetch(`${baseURL}/api/v1${url}`, {
    ...options
  }).then(async (response) => {
    if (!response.ok) {
      throw await response.json();
    }
    return response && response.json();
  });
}
