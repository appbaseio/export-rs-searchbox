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

  const { searchBoxId, clusterUrl, credentials } = getPropsById(id);

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
        enableAppbase
        app="featured_suggestions"
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
          enableIndexSuggestions={false}
          enablePopularSuggestions={design.enablePopularSuggestions}
          enableRecentSuggestions={design.enableRecentSuggestions}
          enableFeaturedSuggestions={design.enableFeaturedSuggestions}
          enableFAQSuggestions={design.enableFAQSuggestions}
          enableAI={design.enableAI}
          popularSuggestionsConfig={{
            ...popular,
          }}
          recentSuggestionsConfig={{
            ...recent,
          }}
          featuredSuggestionsConfig={{
            ...(layout.maxSuggestionsPerSection
              ? { maxSuggestionsPerSection: layout.maxSuggestionsPerSection }
              : {}),
            ...(Array.isArray(layout.sectionsOrder) &&
            layout.sectionsOrder.length
              ? { sectionsOrder: layout.sectionsOrder }
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
