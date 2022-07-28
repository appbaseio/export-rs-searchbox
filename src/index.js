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
      >
        <SearchBox
          componentId={searchBoxId}
          enableIndexSuggestions={false}
          enablePopularSuggestions
          enableRecentSuggestions
          enableFeaturedSuggestions
          popularSuggestionsConfig={{
            ...popular,
          }}
          recentSuggestionsConfig={{
            ...recent,
          }}
          featuredSuggestionsConfig={{
            maxSuggestionsPerSection: layout.maxSuggestionsPerSection,
            sectionsOrder: layout.sectionsOrder,
            searchboxId: searchBoxId,
          }}
          themePreset={design.theme}
        />
      </ReactiveBase>,
      root
    );
  }
};

renderById("searchbox-root");
