// Function to hide the input container and show the video download buttons
function showDownloadButtons() {
  const inputContainer = document.querySelector(".input-container");
  const downloadButtonsContainer = document.getElementById("downloadLinks");
  const downloadAnotherButton = document.getElementById("downloadAnotherButton");

  inputContainer.style.display = "none";
  downloadButtonsContainer.style.display = "block";
  downloadAnotherButton.style.display = "block";
}

document.getElementById("downloadButton").addEventListener("click", function() {
  const videoUrl = document.getElementById("videoUrl").value;
  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://facebook17.p.rapidapi.com/api/facebook/links',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '3310140644msh1db7d0febe86dabp1bec8bjsn72eab7657ff6',
      'X-RapidAPI-Host': 'facebook17.p.rapidapi.com'
    },
    processData: false,
    data: `{"url":"${videoUrl}"}`
  };

  $.ajax(settings).done(function(response) {
    const downloadLinks = response[0].urls;
    const downloadHDButton = document.getElementById("downloadHD");
    const downloadSDButton = document.getElementById("downloadSD");

    // Clear previous download links
    downloadHDButton.style.display = "none";
    downloadSDButton.style.display = "none";

    // Display download links for HD and SD separately
    downloadLinks.forEach(linkInfo => {
      if (linkInfo.subName.toLowerCase() === "hd") {
        downloadHDButton.style.display = "block";
        downloadHDButton.setAttribute("data-url", linkInfo.url);
        downloadHDButton.setAttribute("data-extension", linkInfo.extension);
      } else if (linkInfo.subName.toLowerCase() === "sd") {
        downloadSDButton.style.display = "block";
        downloadSDButton.setAttribute("data-url", linkInfo.url);
        downloadSDButton.setAttribute("data-extension", linkInfo.extension);
      }
    });

    // Show the download buttons and "Download Another Video" button
    showDownloadButtons();
  });
});

// Add click event listeners for the download buttons
document.getElementById("downloadHD").addEventListener("click", function() {
  const url = this.getAttribute("data-url");
  const extension = this.getAttribute("data-extension");
  const fileName = "video_hd" + extension;
  downloadFile(url, fileName);
});

document.getElementById("downloadSD").addEventListener("click", function() {
  const url = this.getAttribute("data-url");
  const extension = this.getAttribute("data-extension");
  const fileName = "video_sd" + extension;
  downloadFile(url, fileName);
});

// Function to trigger the download
function downloadFile(url, fileName) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}

// Add click event listener for the "Download Another Video" button
document.getElementById("downloadAnotherButton").addEventListener("click", function() {
  // Reset the input field and hide the download buttons
  const inputContainer = document.querySelector(".input-container");
  const downloadButtonsContainer = document.getElementById("downloadLinks");
  const downloadAnotherButton = document.getElementById("downloadAnotherButton");

  document.getElementById("videoUrl").value = "";
  inputContainer.style.display = "block";
  downloadButtonsContainer.style.display = "none";
  downloadAnotherButton.style.display = "none";
});