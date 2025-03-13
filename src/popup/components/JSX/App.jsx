import React, { useEffect, useState } from "react";
import icon from "/public/icons/128x128.png";
import { use } from "react";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isDoneScraping, setIsDoneScraping] = useState(false);

  useEffect(() => {
    console.log("searchResults", searchResults);
  }, [searchResults]);

  function goToNextPage() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "go_to_next_page" },
          (response) => {
            if (response) {
              resolve(response); // Resolving the promise with the response
            } else {
              reject("No response received. End of results."); // Rejecting if no response
            }
          }
        );
      });
    });
  }

  async function scrapeCurrentPage() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "get_search_results" },
          (response) => {
            if (response) {
              console.log("response", response);
              resolve(response); // Resolve the promise with the response
            } else {
              reject("No search results found"); // Reject if no response
            }
          }
        );
      });
    });
  }

  // task: fix it so it doesnt create duplicates: right not temporary fix is putting it at 1 second delay. another solution could be filtering out duplicates.
  async function scrape() {
    let nextPageExists = true;
    let index = 0;
    do {
      console.log("new page", index);
      try {
        let currentPageResults = await scrapeCurrentPage();
        console.log("currentPageResults", currentPageResults);
        setSearchResults((prevResults) => [
          ...prevResults,
          ...currentPageResults,
        ]);
      } catch (error) {
        console.log("error", error);
      }
      try {
        nextPageExists = await goToNextPage();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        index++;
      } catch (error) {
        console.log("error", error);
        nextPageExists = false;
      }
    } while (nextPageExists == true);
    setIsDoneScraping(true);
  }

  function saveArrayToCSV(data, headers, filename) {
    // Add headers as the first row in the CSV data
    const arrayWithHeaders = [headers, ...data];

    // Convert the array (with headers) to CSV format
    const csvContent = arrayWithHeaders
      .map((tuple) =>
        tuple
          .map((item) =>
            item.includes(",") || item.includes('"')
              ? `"${item.replace(/"/g, '""')}"` // Escape double quotes by doubling them
              : item
          )
          .join(",")
      )
      .join("\n");

    // Create a Blob object with CSV data
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute with the filename
    link.download = filename;

    // Create an object URL for the Blob and set it as the href
    link.href = URL.createObjectURL(blob);

    // Programmatically click the link to trigger the download
    link.click();
  }

  // left off here 3/12 need to scrape off multiple pages
  return (
    <div className="bg-[#272625] w-80 h-80 p-4  overflow-hidden relative">
      <div>
        <div>
          <h1 className="text-white text-2xl">Maps Scraper</h1>
          {/* scrape button */}
          <button
            className="bg-[#3E3E3E] text-white px-4 py-2 rounded mt-4 mr-4"
            onClick={() => {
              console.log("Scrape button clicked");
              scrape();
            }}
          >
            Scrape
          </button>

          {/* download button */}
          <button
            className={`bg-[#3E3E3E] text-white px-4 py-2 rounded mt-4 ${isDoneScraping && "animate-pulse bg-green-500"}`}
            onClick={() => {
              console.log("Download button clicked");
              // Save as "data.csv"
              saveArrayToCSV(searchResults, ["Place", "Address"], "data.csv");
            }}
          >
            Download
          </button>
        </div>
        <div>
          {/* list of search results */}
          <ul className="mt-4 max-h-64 pb-12 overflow-auto">
            {searchResults.map((result, index) => (
              <li key={index} className="text-white">
                {result[0]} - {result[1]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
