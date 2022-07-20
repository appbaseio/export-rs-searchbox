export const isIdAvailble = (id) => document.getElementById(id);

export const getPropsById = (id) => {
  const container = isIdAvailble(id);
  if (container) {
    return {
      widgetId: container.getAttribute("widget-id"),
      currentProduct: container.getAttribute("current-product"),
      isOpen: container.getAttribute("isOpen") === "true",
      openAsPage: container.getAttribute("openaspage") === "true",
      isPreview: container.getAttribute("isPreview") === "true",
      disableSearchText: container.getAttribute("disableSearchText") === "true",
    };
  }
  return null;
};
