import React from "react";
import ReactDOM from "react-dom/client";
import { ReactiveBase, SearchBox } from "@appbaseio/reactivesearch";

import "./index.css";
import {
  // fetchSearchBoxPreferences,
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
  } = {
    id: "document-search",
    enabled: true,
    hidden: false,
    searchbox: {
      popular: {
        size: 5,
        index: "good-books-ds",
        minChars: 3,
        minCount: 1,
        customEvents: {
          platform: "mac",
        },
        sectionLabel: "Recent",
      },
      recent: {
        size: 5,
        index: "good-books-ds",
        minHits: 1,
        minChars: 3,
        customEvents: {
          platform: "mac",
        },
        sectionLabel: "Recent",
      },
      featured: {
        design: {
          primaryColor: "red",
          theme: "dark",
        },
        layout: {
          maxSuggestionsPerSection: 3,
          sectionsOrder: ["examples", "docs"],
        },
      },
    },
    created_at: 1657667251,
    updated_at: 1657667259,
  };
  // await fetchSearchBoxPreferences({
  //     url: clusterUrl,
  //     credentials,
  //     searchBoxId,
  //   })

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
            featuredSuggestionsGroupId: id, // # mandatory
            maxSuggestionsPerSection: layout.maxSuggestionsPerSection,
            sectionsOrder: layout.sectionsOrder,
          }}
          themePreset={design.theme}
        />
      </ReactiveBase>,
      root
    );
  }
};

renderById("searchbox-root");
