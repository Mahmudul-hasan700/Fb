// Function to hide the input container and show the loading animation
function showLoadingAnimation() {
  const inputContainer = document.querySelector(".input-container");
  const loaderWrapper = document.getElementById("loader-wrapper");

  inputContainer.style.display = "none";
  loaderWrapper.style.display = "block";
}

// Function to hide the loading animation and show the download buttons
function showDownloadButtons() {
  const loaderWrapper = document.getElementById("loader-wrapper");
  const downloadButtonsContainer = document.getElementById("downloadLinks");
  const downloadAnotherButton = document.getElementById("downloadAnotherButton");

  loaderWrapper.style.display = "none";
  downloadButtonsContainer.style.display = "block";
  downloadAnotherButton.style.display = "block";
}

// Function to trigger the download
function downloadFile(url, fileName) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}

// Function to show the error message and hide loading animation
function showErrorMessage() {
  const errorMessage = document.getElementById("fetch-error");
  errorMessage.style.display = "block";
  hideLoadingAnimation();
  const inputContainer = document.querySelector(".input-container");
  inputContainer.style.display = "block";

  // Set a timer to hide the error message after 3 seconds (3000 milliseconds)
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 3000);
}

// Function to hide the error message
function hideErrorMessage() {
  const errorMessage = document.getElementById("fetch-error");
  errorMessage.style.display = "none";
}

// Function to hide the loading animation
function hideLoadingAnimation() {
  const loaderWrapper = document.getElementById("loader-wrapper");
  loaderWrapper.style.display = "none";
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
      'X-RapidAPI-Key': '614217f6c7msh1e300360887b413p1665e8jsn4eb75dedc7fd',
      'X-RapidAPI-Host': 'facebook17.p.rapidapi.com'
    },
    processData: false,
    data: `{"url":"${videoUrl}"}`
  };

  // Show the loading animation when the download button is clicked
  showLoadingAnimation();

  $.ajax(settings)
    .done(function(response) {
      if (response && response.length > 0) {
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

        // Show the download buttons and hide the error message
        showDownloadButtons();
        hideErrorMessage();
      } else {
        // Show the error message when there's no response or response is false
        showErrorMessage();
      }
    })
    .fail(function() {
      // Show the error message when the AJAX request fails
      showErrorMessage();
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
