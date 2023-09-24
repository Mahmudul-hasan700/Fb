// Function to toggle FAQ answers
function toggleAnswer() {
  const answer = this.nextElementSibling;
  answer.classList.toggle("hidden");
}

// Add click event listeners to all question elements
const questions = document.querySelectorAll(".question .toggle");
questions.forEach(question => {
  question.addEventListener("click", toggleAnswer);
});

const shareButton = document.querySelector(".share-button");

shareButton.addEventListener("click", e => {
  if (navigator.share) {
    navigator
      .share({ title: "Share Facebook Video Downloader", url: window.location.href })
      .then(() => {
        console.log("Shared successfully");
      })
      .catch(error => {
        console.error("Error sharing:", error);
      });
  } else {
    // Fallback for browsers that don't support navigator.share
    const shareURL = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("Check out this Facebook Video Downloader!");
    const socialMediaURL = `https://twitter.com/intent/tweet?url=${shareURL}&text=${shareText}`;

    // Open a new window with the social media sharing link
    window.open(socialMediaURL, "_blank");
  }
});

// Get references to the necessary elements
const btnPaste = document.querySelector(".btn-paste");
const inputUrl = document.getElementById("videoUrl");

// Function to toggle between paste and clear functionality
function toggleInput() {
  if (inputUrl.value.length > 0) {
    // Clear input and show paste button
    inputUrl.value = "";
    showBtnPaste();
  } else {
    // Paste from clipboard and show clear button
    pasteFromClipboard();
    showBtnClear();
  }
}

// Function to show the paste button
function showBtnPaste() {
  btnPaste.classList.add("active");
  document.querySelector(".btn-paste span").innerHTML = '<i class="fas fa-paste"></i>';
}

// Function to show the clear button
function showBtnClear() {
  btnPaste.classList.add("active");
  document.querySelector(".btn-paste span").innerHTML = '<i class="fas fa-times"></i>';
}

// Define the pasteFromClipboard function
function pasteFromClipboard() {
  navigator.clipboard.readText().then(function(clipboardText) {
    // Set the clipboard content in the input field
    inputUrl.value = clipboardText;
    showBtnClear(); // Show the clear button after pasting
  }).catch(function(error) {
    console.error('Failed to read clipboard: ', error);
  });
}

// Function to hide the alert (if any)
function hideAlert() {
  // Implement this function if you have an alert mechanism in your code
}

// Add event listeners to the input field
inputUrl.addEventListener("keyup", updateClearButton);
inputUrl.addEventListener("input", updateClearButton);

// Function to update the clear button based on input content
function updateClearButton() {
  if (inputUrl.value.length > 0) {
    showBtnClear();
  } else {
    showBtnPaste();
  }
  hideAlert();
}
