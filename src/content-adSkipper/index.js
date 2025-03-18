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
  } else if (
    currentUrl.includes("google") &&
    message.action === "get_current_page_results"
  ) {
    handleGoogleMapsScrapeCurrentPage(message, sendResponse);
  } else {
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

export async function handleGoogleMapsScrapeCurrentPage(message, sendResponse) {
  console.log("called In Google Maps Scrape Current Page");
  if (message.action === "get_current_page_results") {
    console.log("inside get_current_page_results");
    let scrapeResults = await extractGoogleMapsSearchResults();
    sendResponse(scrapeResults);
  }
}

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleScraping(message, sendResponse);
  return true;
});
