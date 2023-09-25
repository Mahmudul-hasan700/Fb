var BLOBS = {}
var DATA
var RETRIES = {}

const startLoading = () => {
  const loader = document.getElementById('overlay_loader')
  loader.classList.remove("hidden")
}
const stopLoading = () => {
  const loader = document.getElementById('overlay_loader')
  loader.classList.add("hidden")
}
const showPageContent = () => {
  const container = document.getElementById("container")
  container.classList.remove('hidden')
  const card = document.getElementById("card")
  card.classList.add('hidden')
  const bodyitem = document.getElementById("body-item")
  bodyitem.classList.add('hidden')
}

const readUrl = () => {
  const url = new URL(window.location.href)
  const targetUrlValue = url.searchParams.get('url')
  if (targetUrlValue === null) {

    return false
  }
  return (targetUrlValue)
}
const makeRequest = () => {
  const url = readUrl();
  const endpoint = "https://tikwm.com/api/?url=";
  if (url) {
    const requestURL = endpoint + url;
    fetch(requestURL)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          renderOverlayErrorMessage("Server returned Error code : " + response.status, response.statusText);
          return null;
        }
      })
      .then((data) => processResponse(data))
      .catch((e) => {
        renderOverlayErrorMessage("Error Occurred", e.message);
        throw e;
      });
  }
};

const processResponse = (resJSON) => {
  if (!resJSON) { return false }
  const resCode = resJSON['code']
  const resMsg = resJSON['msg']
  if (resCode === -1) {
    renderOverlayErrorMessage("Failed to fetch video.", resMsg)
  } else if (resCode === 0) {
    DATA = resJSON['data']
    getMediaBlobs(resJSON['data'])
    renderPage(resJSON['data'])
    stopLoading()
  }
  else {
    console.error("UNKNOWN RESPONSE CODE.")
    console.log(resJSON)
  }
}
const renderPage = (data) => {
  renderData(data)
  showPageContent()
}
const renderData = (data) => {
  const videoThumbnailField = document.getElementById('video_thumbnail');
  const videoTagField = document.getElementById('video_tag');
  const videoPoster = data['origin_cover'];
  const videoTitle = data['title'];

const videoDownloadField = document.getElementById('video_download')
    const videoDownloadWMField = document.getElementById('video_download_wm')
  
  videoThumbnailField.src = videoPoster; // Set the thumbnail image URL
  videoTagField.innerText = videoTitle; // Set the video tag
}
const getMediaBlobs = (data) => {
  console.log("getting media blobs")
  
  const video = data['play']
  const video_wm = data['wmplay']
  const music = data['music']

  getBlob("video", video)
  getBlob("music", music)
  getBlob("video_wm", video_wm)
}
const getBlob = (blobKey, url) => {
  const xhr = new XMLHttpRequest()
  xhr.open("GET", url)
  xhr.responseType = 'blob';
  xhr.onreadystatechange = function() {
    if (this.readyState === this.DONE) {
      console.log('DONE: ', this.status);
      if (this.status == 200) {
        var blob = new Blob([this.response]);
        console.log("got blob " + blobKey)
        BLOBS[blobKey] = blob
      } else {
        console.log("failed to get blob. trying again.")
        !(blobKey in RETRIES) && (RETRIES[blobKey] = 0)
        if (RETRIES[blobKey] < 50) {
          RETRIES[blobKey]++
          getBlob(blobKey, url)
        }
      }
    }
  }
  xhr.send()
}
const downloadFileFromBlob = (blobKey, filename, extension) => {
  console.log("downloading blob " + blobKey)
  const blob = BLOBS[blobKey]
  console.log(Boolean(blob))
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.style = "display: none";
  document.body.appendChild(a);
  a.href = url;
  a.download = filename + extension;

  a.click();
  console.log(url)
  window.URL.revokeObjectURL(url);
  a.remove()
}
const handleDownloadButtonClick = (button) => {
  console.log("clicked button")
  const blobKey = button.getAttribute('key')
  toggleButtonLoading(button)
  waitForBlobToDownload(blobKey, button)
}
const waitForBlobToDownload = (blobKey, button) => {
  console.log("looking for blob")
  if (!BLOBS.hasOwnProperty(blobKey)) {
    console.log("no blob found. recalling ...")
    setTimeout(waitForBlobToDownload, 100, blobKey, button)
  } else {
    console.log("Found blob")
    let filename = DATA['author']['unique_id'] + "___" + DATA['title'] + "___"
    if (blobKey == "video") {
      filename += "NO_WM"
      var extension = ".mp4"
    }
    else if (blobKey == "music") {
      filename = DATA["music_info"]['author'] + "___" + DATA["music_info"]['title']
      var extension = ".mp3"
    }
    downloadFileFromBlob(blobKey, filename, extension)
    toggleButtonLoading(button)
  }
}
const toggleButtonLoading = (button) => {
  console.log("toggled button state")
  const loader = button.querySelector("#loader")
  const text = button.querySelector(".button-content")
  const loading = !(loader.classList.contains('hidden'))

  loader.classList.toggle('hidden')
  text.classList.toggle('opacity-0')

  if (loading) {
    button.style.pointerEvents = "all"
  } else {
    button.style.pointerEvents = "none"
  }
}
const KMBFormat = (num) => {
  return Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num)
}

startLoading()
makeRequest()