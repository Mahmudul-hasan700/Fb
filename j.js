function showLoadingAnimation() {
  const inputContainer = document.querySelector(".input-container");
  const loaderWrapper = document.getElementById("loader-wrapper");
  inputContainer.style.display = "none";
  loaderWrapper.style.display = "block";
}

function showDownloadButtons() {
  const loaderWrapper = document.getElementById("loader-wrapper");
  const downloadButtonsContainer = document.getElementById("downloadLinks");

  loaderWrapper.style.display = "none";
  downloadButtonsContainer.style.display = "block";
}

function downloadFile(url, fileName) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}

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

function hideErrorMessage() {
  const errorMessage = document.getElementById("fetch-error");
  errorMessage.style.display = "none";
}

function hideLoadingAnimation() {
  const loaderWrapper = document.getElementById("loader-wrapper");
  loaderWrapper.style.display = "none";
}

document.getElementById("downloadButton").addEventListener("click", function() {
  const videoUrl = document.getElementById("videoUrl").value;
  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://facebook17.p.rapidapi.com/api/facebook/links', // Replace with your RapidAPI endpoint
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '614217f6c7msh1e300360887b413p1665e8jsn4eb75dedc7fd',
      'X-RapidAPI-Host': 'facebook17.p.rapidapi.com'
    },
    processData: false,
    data: `{"url":"${videoUrl}"}`
  };

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

        // Initialize variables to store thumbnail URL and title
        let thumbnailUrl = "";
        let videoTitle = "";

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

          // Check for thumbnail and title
          if (linkInfo.subName.toLowerCase() === "thumbnail") {
            thumbnailUrl = linkInfo.url;
          } else if (linkInfo.subName.toLowerCase() === "title" && linkInfo.title) {
            videoTitle = linkInfo.title;
          }
        });

        // Display thumbnail
        const thumbnail = document.getElementById("thumbnail");
        thumbnail.src = thumbnailUrl;

        // Display title
        const videoTitleElement = document.getElementById("videoTitle");
        videoTitleElement.textContent = videoTitle;

        // Show the video info container
        const videoInfoContainer = document.getElementById("videoInfo");
        videoInfoContainer.style.display = "block";

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