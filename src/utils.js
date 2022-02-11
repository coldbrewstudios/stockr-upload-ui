// http client (fetch wrapper)
export function http(url = "", options = {}) {
  const baseURL = process.env.VUE_APP_API_BASE_URI
    ? process.env.VUE_APP_API_BASE_URI
    : "https://booqnly-stockr.herokuapp.com";
  return fetch(`${baseURL}/api/v1${url}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response && response.json();
    })
    .catch((error) => {
      return { error: error.message };
    });
}
