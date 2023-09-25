// Get references to the input field and download button
const videoUrlInput = document.getElementById('videoUrl');
const downloadButton = document.getElementById('downloadButton');
const errorMessage = document.querySelector('.error-message');
const thumbnailImg = document.getElementById('thumbnail'); // Added reference to thumbnail image

// Function to check if a URL is a valid Facebook video link
function isValidFacebookVideoLink(url) {
  return url.includes('facebook.com') || url.includes('fb.watch');
}

// Add an event listener to the input field to check when it changes
videoUrlInput.addEventListener('input', () => {
  const videoUrl = videoUrlInput.value;

  // Check if the entered URL is a valid Facebook video link
  if (isValidFacebookVideoLink(videoUrl)) {
    // Enable the download button
    downloadButton.disabled = false;
    // Hide the error message
    errorMessage.classList.add('hidden');
  } else {
    // Disable the download button
    downloadButton.disabled = true;
    // Show the error message
    errorMessage.classList.remove('hidden');
  }
});

// Function to toggle the input field for paste button
function toggleInput() {
  videoUrlInput.select();
  document.execCommand('paste');
}

// Add an event listener to the paste button
const pasteButton = document.querySelector('.btn-paste');
pasteButton.addEventListener('click', toggleInput);

// Function to show the loading animation
function showLoadingAnimation() {
  const inputContainer = document.getElementById('input-container');
  const loaderWrapper = document.getElementById('loader-wrapper');

  if (inputContainer && loaderWrapper) {
    inputContainer.style.display = 'none';
    loaderWrapper.style.display = 'block';
  }
}

// Function to show the download buttons
function showDownloadButtons() {
  document.getElementById('loader-wrapper').style.display = 'none';
  document.getElementById('downloadLinks').style.display = 'block';
}

// Function to download a file
function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
}

// Function to show the error message and hide loader animation
function showErrorMessage() {
  const errorMessage = document.getElementById('fetch-error');
  errorMessage.style.display = 'block';
  document.getElementById('input-container').style.display = 'block';
  
  // Hide the loader animation
  hideLoadingAnimation();

  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 3000);
}

// Function to hide the error message
function hideErrorMessage() {
  document.getElementById('fetch-error').style.display = 'none';
}

// Function to hide the loading animation
function hideLoadingAnimation() {
  document.getElementById('loader-wrapper').style.display = 'none';
}

// Add a click event listener to the download button
downloadButton.addEventListener('click', function () {
  const videoUrl = document.getElementById('videoUrl').value;
  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php?url=' + encodeURIComponent(videoUrl),
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '3310140644msh1db7d0febe86dabp1bec8bjsn72eab7657ff6',
      'X-RapidAPI-Host': 'facebook-reel-and-video-downloader.p.rapidapi.com',
    },
  };

  showLoadingAnimation();

  $.ajax(settings)
    .done(function (response) {
      if (response.success) {
        const downloadLinks = response.links;
        const downloadHDButton = document.getElementById('downloadHD');
        const downloadSDButton = document.getElementById('downloadSD');

        downloadHDButton.style.display = 'none';
        downloadSDButton.style.display = 'none';

        // Check if the API response includes a thumbnail URL
        if (response.thumbnail) {
          thumbnailImg.src = response.thumbnail;
          thumbnailImg.style.display = 'block'; // Display the thumbnail image
        }

        for (const link in downloadLinks) {
          if (link.includes('Low Quality')) {
            downloadSDButton.style.display = 'block';
            downloadSDButton.addEventListener('click', function () {
              downloadFile(downloadLinks[link], 'video_sd.mp4');
            });
          } else if (link.includes('High Quality')) {
            downloadHDButton.style.display = 'block';
            downloadHDButton.addEventListener('click', function () {
              downloadFile(downloadLinks[link], 'video_hd.mp4');
            });
          }
        }

        showDownloadButtons();
        hideErrorMessage();
      } else {
        showErrorMessage();
      }
    })
    .fail(function () {
      showErrorMessage();
    });
});

// Add click event listeners for the download buttons
document.getElementById('downloadHD').addEventListener('click', function () {
  const url = this.getAttribute('data-url');
  const extension = this.getAttribute('data-extension');
  const fileName = 'video_hd' + extension;
  downloadFile(url, fileName);
});

document.getElementById('downloadSD').addEventListener('click', function () {
  const url = this.getAttribute('data-url');
  const extension = this.getAttribute('data-extension');
  const fileName = 'video_sd' + extension;
  downloadFile(url, fileName);
});