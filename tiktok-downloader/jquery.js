
const shareButton = document.querySelector(".share-button");

shareButton.addEventListener("click", e => {
  if (navigator.share) {
    navigator
      .share({ title: "Share TikTok Video Downloader", url: window.location.href })
      .then(() => {
        console.log("Shared successfully");
      })
      .catch(error => {
        console.error("Error sharing:", error);
      });
  } else {
    const shareURL = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("Check out this TikTok Video Downloader!");
    const socialMediaURL = `https://twitter.com/intent/tweet?url=${shareURL}&text=${shareText}`;
    window.open(socialMediaURL, "_blank");
  }
});

const inputField = document.getElementById('videoUrl');
const pasteButton = document.querySelector('.close-button');
inputField.addEventListener('input', function() {
  const inputValue = inputField.value;
  if (inputValue === '') {
    pasteButton.innerHTML = '';
  } else {
    pasteButton.innerHTML = '<i class="fas fa-times"></i>';
  }
});
pasteButton.addEventListener('click', function() {
  inputField.value = '';
  pasteButton.innerHTML = '';
});