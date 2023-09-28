import React from "react";
import ReactDOM from "react-dom/client";
import { ReactiveBase, SearchBox } from "@appbaseio/reactivesearch";

import "./index.css";
import {
  fetchSearchBoxPreferences,
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
    },
  } = await fetchSearchBoxPreferences({
    url: clusterUrl,
    credentials,
    searchBoxId,
  });

  const root = ReactDOM.createRoot(document.getElementById(id));

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
          // Below is temporarily disabled due to an issue with the backend, which is returning empty hits
          // enableEndpointSuggestions={form.value.enableEndpointSuggestions}
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
          searchboxId={searchBoxId}
          showVoiceSearch={design.enableVoiceSearch}
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
        />
      </ReactiveBase>,
      root
    );
  }
};

renderById("searchbox-root");
