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

// Get references to the input field and the paste button
const inputField = document.getElementById('videoUrl'); // Assuming your input field has the id 'params'
const closePasteButton = document.querySelector('.close-button'); // Unique variable name

// Add an event listener to the input field for input changes
inputField.addEventListener('input', function() {
  const inputValue = inputField.value;

  // Check if the input value is empty
  if (inputValue === '') {
    // If empty, hide the close icon
    closePasteButton.innerHTML = '';
  } else {
    // If not empty, display the close icon
    closePasteButton.innerHTML = '<i class="fas fa-times"></i>';
  }
});

// Function to clear the input field when the close icon is clicked
closePasteButton.addEventListener('click', function() {
  inputField.value = ''; // Clear the input field
  closePasteButton.innerHTML = ''; // Hide the close icon again
});