// content.js

function extractMapsSearchResults() {
  console.log("hello\n\n");
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

  console.log(results);

  return results; // Return the array of tuples (place name and place address)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "get_search_results") {
    sendResponse(extractMapsSearchResults());
  } else if (message.action === "go_to_next_page") {
    console.log("message received to go to next page");

    // Try to click the "Next" button
    let NextButton = document.querySelector("#pnnext");
    if (!NextButton) {
      console.log("no next button found");
      sendResponse(false);
    } else {
      NextButton.click();
      sendResponse(true);
    }
  }
});
