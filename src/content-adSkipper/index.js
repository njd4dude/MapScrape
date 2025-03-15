// content.js

function extractGoogleMapsSearchResults() {
  const results = [];

  // Select all the parent divs that contain place details
  const allDetails = document.querySelectorAll(".rllt__details");

  allDetails.forEach((detail) => {
    // Extract the place name inside the div with role="heading"
    const placeName = detail
      .querySelector('[role="heading"]')
      ?.innerText.trim();

    // Extract the place address, assuming it's in the 3rd div (or adjust based on your actual structure)
    const placeAddress = detail
      .querySelector("div:nth-child(3)")
      ?.innerText.trim();

    // Ensure both placeName and placeAddress exist before pushing to results
    if (placeName && placeAddress) {
      results.push([placeName, placeAddress]);
    }
  });

  return results; // Return the array of tuples (place name and place address)
}

function googleGoToNextPage(sendResponse) {
  let NextButton = document.querySelector("#pnnext");
  if (!NextButton) {
    console.log("no next button found");
    sendResponse(false);
  } else {
    NextButton.click();
    sendResponse(true);
  }
}

// we have two options: we handle the scraping the detailed page seperately by just collecting the href tags for now
//  or we handle it here and try to get all the data at once for each

function extractYelpSearchResults() {
  const results = [];

  const elements = document.querySelectorAll(
    '[data-traffic-crawl-id="OrganicBusinessResult"]'
  );

  for (const element of elements) {
    // scrape the url and name
    const aTag = element.querySelectorAll("a")[1];
    const url = aTag.href;
    const placeName = aTag.innerText;

    console.log("url: ", url);
    console.log("placeName: ", placeName);
    if (url && placeName) {
      results.push([placeName, url]);
    }
  }
  return results;
}

function yelpGoToNextPage(sendResponse) {
  let NextButton = document.querySelector('a[aria-label="Next"]');
  console.log("NextButton", NextButton);
  if (!NextButton) {
    console.log("no next button found");
    sendResponse(false);
  } else {
    NextButton.click();
    sendResponse(true);
  }
}

// tasks:
// left off implement a yelp scraper, maybe: include way to get address and phone number in google maps when scraping

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const currentUrl = window.location.href;

  if (currentUrl.includes("yelp")) {
    yelpScrape();
  } else if (currentUrl.includes("google")) {
    googleMapsScrape();
  }

  function yelpScrape() {
    console.log("in yelpScrape");
    if (message.action === "get_search_results") {
      sendResponse(extractYelpSearchResults());
    } else if (message.action === "go_to_next_page") {
      yelpGoToNextPage(sendResponse);
    }
  }

  function googleMapsScrape() {
    if (message.action === "get_search_results") {
      console.log("called get_search_results");
      sendResponse(extractGoogleMapsSearchResults());
    } else if (message.action === "go_to_next_page") {
      console.log("called go_to_next_page");
      googleGoToNextPage(sendResponse);
    }
  }
});
