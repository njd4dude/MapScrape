// Yelp Scraping Functions
export function extractYelpSearchResults() {
  console.log("In Extract Yelp Search Results");
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
export function yelpGoToNextPage() {
  console.log("In Yelp Go To Next Page");
  const nextButton = document.querySelector('a[aria-label="Next"]');
  if (nextButton) {
    nextButton.click();
    return true;
  } else {
    return false;
  }
}
