import React from "react";
import ReactDOM from "react-dom/client";
import { ReactiveBase, SearchBox } from "@appbaseio/reactivesearch";

import "./index.css";
import {
  fetchSearchBoxPreferences,
  getPropsById,
  isIdAvailble,
} from "./utils/helper";

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
        app="test"
        theme={{ colors: { primaryColor: design.primaryColor } }}
      >
        <SearchBox
          componentId={searchBoxId}
          enableIndexSuggestions={design.enableIndexSuggestions}
          enablePopularSuggestions={design.enablePopularSuggestions}
          enableRecentSuggestions={design.enableRecentSuggestions}
          enableFeaturedSuggestions={design.enableFeaturedSuggestions}
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
            sectionsOrder: layout.sectionsOrder,
          }}
          themePreset={design.theme}
          searchboxId={searchBoxId}
          showVoiceSearch={design.enableVoiceSearch}
          highlight={design.highlight}
        />
      </ReactiveBase>,
      root
    );
  }
};

renderById("searchbox-root");
