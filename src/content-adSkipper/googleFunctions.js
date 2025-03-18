// Google Maps Scraping Functions




export async function extractGoogleMapsSearchResults() {
  console.log("called extractGoogleMapsSearchResults");
  const results = [];

  try {
    const detailElements = document.querySelectorAll(".rllt__details");

    for (const detail of detailElements) {
      try {
        const aTag = detail.closest("a");
        if (!aTag) {
          console.warn("No anchor tag found for detail element");
          continue;
        }

        aTag.click();

        // Wait for 2 seconds to allow the details page to load
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Get details
        const informationBlock = document.querySelectorAll(".LrzXr");
        console.log("informationBlock", informationBlock);

        const name =
          document.querySelector('h2[data-attrid="title"] span')?.innerText ||
          "Name not found";
        const address = informationBlock[0]?.innerText || "Address not found";
        const phoneNumber =
          informationBlock[1]?.innerText || "Phone number not found";
        const website = document.querySelector("a.n1obkb.mI8Pwc")?.href || "NA";

        console.log("name", name);
        console.log("address", address);
        console.log("phoneNumber", phoneNumber);
        console.log("website", website);

        results.push([name, address, phoneNumber, website]);
      } catch (err) {
        console.error("Error processing a detail element:", err);
      }
    }
  } catch (error) {
    console.error("Error extracting Google Maps search results:", error);
  }

  return results;
}

export function googleGoToNextPage() {
  console.log("called googleGoToNextPage");
  const nextButton = document.querySelector("#pnnext");
  if (nextButton) {
    nextButton.click();
    return true;
  } else {
    return false;
  }
}
