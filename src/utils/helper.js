import { transform } from "@babel/standalone";
import React from "react";

export const isIdAvailble = (id) => document.getElementById(id);

export const getPropsById = (id) => {
  const container = isIdAvailble(id);
  if (container) {
    return {
      searchBoxId: container.getAttribute("searchbox-id"),
      clusterUrl: container.getAttribute("cluster-url"),
      credentials: container.getAttribute("credentials"),
      index: container.getAttribute("index"),
      pipeline: container.getAttribute("pipeline")
        ? JSON.parse(container.getAttribute("pipeline"))
        : {},
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

/**
 * Assumption:
 *  functionString would contain comments and one function definition only.
 *  The function definition needs to be the classic function definition. i.e. using function keyword.
 */

/**
 *
 * @param {string} functionString
 * @returns {function} convertedFunction
 */
export const getFunctionFromString = (functionString) => {
  const transpiledCode = transform(functionString, {
    presets: ["react"],
  }).code;
  // Remove comments and trim spaces
  const cleanCode = transpiledCode
    .replace(/(\/\*[\s\S]*?\*\/)|(\/\/.+)/g, "") // Remove comments
    .trim();
  // eslint-disable-next-line
  const func = new Function("React", `return (${cleanCode})`)(React);
  return func;
};
