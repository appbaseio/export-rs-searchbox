export const isIdAvailble = (id) => document.getElementById(id);

export const getPropsById = (id) => {
  const container = isIdAvailble(id);
  if (container) {
    return {
      searchBoxId: container.getAttribute("searchbox-id"),
      clusterUrl: container.getAttribute("cluster-url"),
      credentials: container.getAttribute("credentials"),
    };
  }
  return null;
};

export const fetchSearchBoxPreferences = ({
  url,
  credentials,
  searchBoxId,
}) => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Basic " + btoa(credentials));
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  return fetch(`${url}/_uibuilder/searchbox/${searchBoxId}`, requestOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.log("error", error);
      return error;
    });
};
