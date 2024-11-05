const generateForm = document.querySelector(".generate-form")
const imageGallery = document.querySelector(".image-gallery")


const handleDownloadBtn = (e) => {
    const downloadBtn = e.currentTarget
    downloadBtn.setAttribute("href", downloadBtn.previousElementSibling.src)
    downloadBtn.setAttribute("download", `${new Date().getTime()}`)
}

const handleFormSubmission = (e) => {
    e.preventDefault()

    const userPrompt = e.srcElement[0].value
    const userImgQuantity = e.srcElement[1].value
    const userModelOfAi = e.srcElement[2].value

    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        `<div class="img-card loading">
            <img src="images/loader.svg" alt="loader">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
    ).join("")
    imageGallery.innerHTML = imgCardMarkup
    makeArrOfImages(userPrompt, userImgQuantity, userModelOfAi)
}

const fetchAiImages = async (userPrompt, userModelOfAi) => {
    try {
        const modelURL = userModelOfAi
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${modelURL}`,
            {
                headers: { Authorization: "Bearer //apiKey//" },
                method: "POST",
                body: JSON.stringify(userPrompt),
            }
        );
        const result = await response.blob();
        return result;
    } catch (e) {
        console.log(e.body)
    }

}

const makeArrOfImages = async (userPrompt, userImgQuantity, userModelOfAi) => {
    const arrayOfFetchedURL = []
    for (let i = 0; i < userImgQuantity; i++) {
        const responseBlob = URL.createObjectURL(await fetchAiImages(userPrompt + i, userModelOfAi))
        arrayOfFetchedURL.push(responseBlob)
    }

    const newImgMarkup = arrayOfFetchedURL.map((item, index) =>
        `<div class="img-card">
            <img src="${item}" alt="loader">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
    ).join("")
    imageGallery.innerHTML = newImgMarkup
    updateDownloadButton()
}

const updateDownloadButton = () => {
    const downloadBtn = document.querySelectorAll(".download-btn")
    for (let i = 0; i < downloadBtn.length; i++) {
        downloadBtn[i].addEventListener('click', handleDownloadBtn)
    }
};

generateForm.addEventListener("submit", handleFormSubmission)
updateDownloadButton()
