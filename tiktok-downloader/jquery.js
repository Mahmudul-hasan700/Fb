
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

// Get references to the input field and the paste button
const inputField = document.getElementById('URL'); // Assuming your input field has the id 'params'
const pasteButton = document.querySelector('.close-button');

// Add an event listener to the input field for input changes
inputField.addEventListener('input', function() {
  const inputValue = inputField.value;

  // Check if the input value is empty
  if (inputValue === '') {
    // If empty, hide the close icon
    pasteButton.innerHTML = '';
  } else {
    // If not empty, display the close icon
    pasteButton.innerHTML = '<i class="fas fa-times"></i>';
  }
});

// Function to clear the input field when the close icon is clicked
pasteButton.addEventListener('click', function() {
  inputField.value = ''; // Clear the input field
  pasteButton.innerHTML = ''; // Hide the close icon again
});