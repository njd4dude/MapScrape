import {
  extractGoogleMapsSearchResults,
  googleGoToNextPage,
} from "./googleFunctions.js";
import { extractYelpSearchResults, yelpGoToNextPage } from "./yelpFunctions.js";

// Scraper Dispatcher
function handleScraping(message, sendResponse) {
  const currentUrl = window.location.href;
  if (currentUrl.includes("yelp")) {
    handleYelpScrape(message, sendResponse);
  } else if (currentUrl.includes("google")) {
    handleGoogleMapsScrape(message, sendResponse);
  }
}

function handleYelpScrape(message, sendResponse) {
  console.log("In Yelp Scrape");
  if (message.action === "get_search_results") {
    sendResponse(extractYelpSearchResults());
  } else if (message.action === "go_to_next_page") {
    yelpGoToNextPage(sendResponse);
  }
}

// task 3/18: get detailed info

async function handleGoogleMapsScrape(message, sendResponse) {
  console.log("In Google Maps Scrape", message.action);
  if (message.action === "get_search_results") {
    console.log("inside get_search_results");
    let allResults = [];
    let res = true;

    while (res) {
      console.log("inside while loop");
      let scrapeResults = await extractGoogleMapsSearchResults();
      allResults = allResults.concat(scrapeResults);
      res = googleGoToNextPage();

      // wait a second before going to next page so that the scraper has enough time to scrape
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    sendResponse(allResults);
  }
}
// a[.n1obkb mI8Pwc]
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleScraping(message, sendResponse);
  return true;
});
