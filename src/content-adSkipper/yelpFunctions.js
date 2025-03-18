// Yelp Scraping Functions
export function extractYelpSearchResults() {
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
export function yelpGoToNextPage(sendResponse) {
  const nextButton = document.querySelector('a[aria-label="Next"]');
  if (nextButton) {
    nextButton.click();
    sendResponse(true);
  } else {
    sendResponse(false);
  }
}
