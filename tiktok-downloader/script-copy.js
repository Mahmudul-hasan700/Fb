const BLOBS = {};
const RETRIES = {};

const startLoading = () => {
  const loader = document.getElementById('overlay_loader');
  loader.classList.remove("hidden");
}

const stopLoading = () => {
  const loader = document.getElementById('overlay_loader');
  loader.classList.add("hidden");
}

const showPageContent = () => {
  const container = document.getElementById("container");
  container.classList.remove('hidden');
  const card = document.getElementById("card");
  card.classList.add('hidden');
}

const renderOverlayErrorMessage = (msg, secondary_msg = null) => {
  const alertDiv = document.getElementById('alert');
  alertDiv.classList.remove("hidden");
  const child = document.createElement('div');
  child.classList.add("text-center", "text-2xl", "text-neutral-100");
  child.innerText = msg;

  if (secondary_msg) {
    const secondaryChild = document.createElement('div');
    secondaryChild.classList.add("text-center", "text-lg", "text-neutral-300");
    secondaryChild.innerText = secondary_msg;
    alertDiv.appendChild(secondaryChild);
  }

  alertDiv.innerHTML = '';
  alertDiv.appendChild(child);
  stopLoading();
  const form = document.getElementById("form");
  form.classList.remove('hidden');
}
const makeRequest = async () => {
  const url = document.getElementById('videoUrl').value;
  if (url) {
    startLoading();
    try {
      const response = await fetch(`https://tikwm.com/api/?url=${url}`);

      if (response.status >= 200 && response.status <= 299) {
        const data = await response.json();
        processResponse(data);
      } else {
        renderOverlayErrorMessage("Server returned Error code : " + response.status, response.statusText);
      }
    } catch (error) {
      renderOverlayErrorMessage("Error Occurred", error.message);
      throw error;
    }
  } else {
    alert("Please enter a valid video URL.");
  }
};

const processResponse = (resJSON) => {
  if (!resJSON) {
    renderOverlayErrorMessage("Failed to fetch video."); // Show error if response is empty
    return;
  }

  const resCode = resJSON['code'];
  const resMsg = resJSON['msg'];

  if (resCode === -1) {
    renderOverlayErrorMessage("Failed to fetch video.", resMsg); // Show error with custom message
  } else if (resCode === 0) {
    const data = resJSON['data'];
    renderPage(data);
    stopLoading();
  } else {
    console.error("UNKNOWN RESPONSE CODE.");
    console.log(resJSON);
  }
}

const renderPage = (data) => {
  renderData(data);
  showPageContent();
  getMediaBlobs(data); // Fetch media blobs when rendering the page.
}

const renderData = (data) => {
  const videoThumbnailField = document.getElementById('video_thumbnail');
  const videoTagField = document.getElementById('video_tag');
  const videoPoster = data['origin_cover'];
  const videoTitle = data['title'];

  // Display the thumbnail image, video title, etc., in their respective places
  videoThumbnailField.src = videoPoster;
  videoTagField.innerText = videoTitle;
}

const downloadFileFromBlob = (blobKey, filename, extension) => {
  const blob = BLOBS[blobKey];
  if (!blob) {
    console.error(`Blob with key '${blobKey}' not found.`);
    return;
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.style = "display: none";
  document.body.appendChild(a);
  a.href = url;
  a.download = filename + "." + extension;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

const getBlob = (blobKey, url) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = 'blob';
  xhr.onreadystatechange = function() {
    if (this.readyState === this.DONE) {
      if (this.status == 200) {
        const blob = new Blob([this.response]);
        BLOBS[blobKey] = blob;
      } else {
        console.log(`Failed to get blob '${blobKey}'. Trying again.`);
        !(blobKey in RETRIES) && (RETRIES[blobKey] = 0);
        if (RETRIES[blobKey] < 50) {
          RETRIES[blobKey]++;
          getBlob(blobKey, url);
        }
      }
    }
  };
  xhr.send();
}

const getMediaBlobs = (data) => {
  const video = data['play'];
  const video_wm = data['wmplay'];
  const music = data['music'];

  getBlob("video", video);
  getBlob("music", music);
  getBlob("video_wm", video_wm);
}

document.getElementById('downloadBtn').addEventListener('click', () => {
  makeRequest();
});

document.getElementById('video_download').addEventListener('click', (e) => {
  handleDownloadButtonClick(e.target);
});

document.getElementById('music_download').addEventListener('click', (e) => {
  handleDownloadButtonClick(e.target);
});

const handleDownloadButtonClick = (button) => {
  const blobKey = button.getAttribute('key');
  const videoTitle = document.getElementById('video_tag').innerText;
  const fileName = sanitizeFileName(videoTitle);

  toggleButtonLoading(button);
  waitForBlobToDownload(blobKey, button, fileName);
}

const waitForBlobToDownload = (blobKey, button, fileName) => {
  if (!BLOBS.hasOwnProperty(blobKey)) {
    setTimeout(waitForBlobToDownload, 100, blobKey, button, fileName);
  } else {
    downloadFileFromBlob(blobKey, fileName, blobKey === "music" ? "mp3" : "mp4");
    toggleButtonLoading(button);
  }
}

const sanitizeFileName = (fileName) => {
  // Replace characters that are not allowed in file names
  return fileName.replace(/[<>:"/\\|?*]/g, '_');
}

const toggleButtonLoading = (button) => {
  const loader = button.querySelector("#loader");
  const text = button.querySelector(".button-content");
  const loading = !(loader.classList.contains('hidden'));
  loader.classList.toggle('hidden');
  text.classList.toggle('opacity-0');
  if (loading) {
    button.style.pointerEvents = "all";