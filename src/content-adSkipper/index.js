// Google Maps Scraping Functions
function extractGoogleMapsSearchResults() {
  const results = [];
  document.querySelectorAll(".rllt__details").forEach((detail) => {
    const aTag = detail.closest("a");

    // Extract place name and address
    const placeName = detail
      .querySelector('[role="heading"]')
      ?.innerText.trim();

    const placeAddress = detail
      .querySelector("div:nth-child(3)")
      ?.innerText.trim();

    if (placeName && placeAddress) {
      results.push([placeName, placeAddress]);
    }
  });
  return results;
}

function googleGoToNextPage() {
  console.log("called googleGoToNextPage");
  const nextButton = document.querySelector("#pnnext");
  if (nextButton) {
    nextButton.click();
    // sendResponse(true);
    return true;
  } else {
    console.log("No next button found");
    // sendResponse(false);
    return false;
  }
}

// Yelp Scraping Functions
function extractYelpSearchResults() {
  const results = [];
  document
    .querySelectorAll('[data-traffic-crawl-id="OrganicBusinessResult"]')
    .forEach((element) => {
      const aTag = element.querySelectorAll("a")[1];
      const url = aTag.href;
      const placeName = aTag.innerText;

      if (url && placeName) {
        results.push([placeName, url]);
      }
    });
  return results;
}

function yelpGoToNextPage(sendResponse) {
  const nextButton = document.querySelector('a[aria-label="Next"]');
  if (nextButton) {
    nextButton.click();
    sendResponse(true);
  } else {
    console.log("No next button found");
    sendResponse(false);
  }
}

// Scraper Dispatcher
function handleScraping(message, sendResponse) {
  const currentUrl = window.location.href;
  if (currentUrl.includes("yelp")) {
    handleYelpScrape(message, sendResponse);
  } else if (currentUrl.includes("google")) {
    handleGoogleMapsScrape(message, sendResponse);
  }
}

// Handle Yelp-specific Actions
function handleYelpScrape(message, sendResponse) {
  console.log("In Yelp Scrape");
  if (message.action === "get_search_results") {
    sendResponse(extractYelpSearchResults());
  } else if (message.action === "go_to_next_page") {
    yelpGoToNextPage(sendResponse);
  }
}

// Handle Google Maps-specific Actions
async function handleGoogleMapsScrape(message, sendResponse) {
  console.log("In Google Maps Scrape", message.action);
  if (message.action === "get_search_results") {
    console.log("inside get_search_results");
    let allResults = []; // Store all the results
    let res = true;

    while (res) {
      console.log("inside while loop");

      // Collect current page's results
      let scrapeResults = extractGoogleMapsSearchResults();
      allResults = allResults.concat(scrapeResults); // Add results to the collection

      // Wait for the next page to load
      res = await new Promise((resolve) => {
        setTimeout(() => {
          console.log("waiting 1 second");
          resolve(googleGoToNextPage()); // Resolve the promise with the result of googleGoToNextPage
        }, 1000);
      });

      if (!res) {
        console.log("Scraping last page");
        let lastPageResults = extractGoogleMapsSearchResults();
        allResults = allResults.concat(lastPageResults);
      }
    }

    // IMPORTANT TASK: It doesn't get the last page

    sendResponse(allResults); // Send all collected results after scraping
  } else if (message.action === "go_to_next_page") {
    // If there's any action to go to the next page, it can be added here
    // googleGoToNextPage();
    // recent changes: i made it so that we call go to next page within one client listner call
  }
}

// Chrome Runtime Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleScraping(message, sendResponse);
  return true; // Ensure asynchronous response
});
