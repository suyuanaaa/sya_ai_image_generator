//
const JSONBIN_API_KEY = "$2a$10$rPcjYa2JskbTj..4LxWai.DJWt2TW9A7Uc54eSZFfBY3jDcN5zLiO";
const JSONBIN_URL = "https://api.jsonbin.io/v3/b/686e98cb73529642b377cf2f";

let API_KEY = "";

if (!API_KEY) {
  API_KEY = prompt("请输入你的 OpenAI API Key：");
}

const submitIcon = document.querySelector("#submit-icon")
const inputElement = document.querySelector("#prompt-input");
const imageSection = document.querySelector('.images-section')

const getImages = async () => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: inputElement.value,
            n: 4,
            size: "1024x1024"
        })
    }
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", options)
        const data = await response.json()
        data?.data.forEach(imageObject => {
            const imageContainer = document.createElement("div")
            imageContainer.classList.add("image-container")

            const imageElement = document.createElement("img")
            imageElement.setAttribute("src", imageObject.url)

            imageElement.addEventListener("click", () => {
                fetch(JSONBIN_URL, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Master-Key": JSONBIN_API_KEY
                    },
                    body: JSON.stringify({
                            currentImage: imageObject.url
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("更新失败");
                        }
                        alert("图片已发送到 UE 展示页！");
                    })
                    .catch(error => {
                        console.error("发送失败：", error);
                    });
            });

            imageContainer.append(imageElement)
            imageSection.append(imageContainer)
        })

    } catch (error) {
        console.error(error)
    }
}

submitIcon. addEventListener('click', getImages)
