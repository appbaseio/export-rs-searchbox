import React from "react";
import ReactDOM from "react-dom/client";
import { ReactiveBase, SearchBox } from "@appbaseio/reactivesearch";

import "./index.css";
import {
  fetchSearchBoxPreferences,
  getFunctionFromString,
  getPropsById,
  isIdAvailble,
} from "./utils/helper";
import DOMPurify from "dompurify";

const renderById = async (id) => {
  const container = isIdAvailble(id);

  const { searchBoxId, clusterUrl, credentials, index, pipeline } =
    getPropsById(id);

  const {
    searchbox: {
      popular,
      recent,
      featured: { design, layout },
      document: documentSuggestion,
    },
  } = await fetchSearchBoxPreferences({
    url: clusterUrl,
    credentials,
    searchBoxId,
  });

  const root = ReactDOM.createRoot(document.getElementById(id));
  const renderDocumentSuggestion = documentSuggestion?.renderSuggestion
    ? getFunctionFromString(documentSuggestion?.renderSuggestion)
    : null;

  if (container) {
    root.render(
      <ReactiveBase
        url={clusterUrl}
        credentials={credentials}
        // Older searchbox didn't have a index field. So, they had "featured_suggestions" passed as the index.
        app={index || "featured_suggestions"}
        endpoint={
          pipeline?.id
            ? {
                url: `${clusterUrl}${pipeline.url}`,
                headers: {
                  Authorization: `Basic ${btoa(credentials)}`,
                },
                method: pipeline?.method,
              }
            : undefined
        }
        theme={{
          colors: {
            primaryColor: design.primaryColor,
            textColor: design.textColor,
          },
        }}
        themePreset={design.theme}
      >
        <SearchBox
          componentId={searchBoxId}
          enablePopularSuggestions={design.enablePopularSuggestions}
          enableRecentSuggestions={design.enableRecentSuggestions}
          enableFeaturedSuggestions={design.enableFeaturedSuggestions}
          enableDocumentSuggestions={design.enableDocumentSuggestions}
          // Below is temporarily disabled due to an issue with the backend, which is returning empty hits
          enableEndpointSuggestions={design.enableEndpointSuggestions}
          enableIndexSuggestions={!!index}
          enableFAQSuggestions={design.enableFAQSuggestions}
          enableAI={design.enableAI}
          popularSuggestionsConfig={{
            ...popular,
          }}
          recentSuggestionsConfig={{
            ...recent,
          }}
          featuredSuggestionsConfig={{
            ...(layout?.maxSuggestionsPerSection
              ? { maxSuggestionsPerSection: layout?.maxSuggestionsPerSection }
              : {}),
            ...(Array.isArray(layout?.sectionsOrder) &&
            layout?.sectionsOrder.length
              ? { sectionsOrder: layout?.sectionsOrder }
              : {}),
          }}
          documentSuggestionsConfig={{
            sectionLabel: documentSuggestion?.sectionLabel || undefined,
          }}
          renderItem={
            renderDocumentSuggestion && design.enableDocumentSuggestions
              ? (suggestion) => {
                  if (suggestion._suggestion_type === "document") {
                    return renderDocumentSuggestion(suggestion);
                  }
                  return null;
                }
              : undefined
          }
          searchboxId={searchBoxId}
          showVoiceSearch={design.enableVoiceSearch}
          showImageSearch={design.enableImageSearch}
          highlight={design.highlight}
          iconPosition={design.iconPosition}
          focusShortcuts={design.focusShortcuts}
          placeholder={design.placeholder}
          iconURL={design.iconURL}
          addonBefore={
            design.addonBefore ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(design.addonBefore),
                }}
              />
            ) : null
          }
          addonAfter={
            design.addonAfter ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(design.addonAfter),
                }}
              />
            ) : null
          }
          showDistinctSuggestions
        />
      </ReactiveBase>,
      root
    );
  }
};

renderById("searchbox-root");
