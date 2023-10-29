import { catsData } from '/data.js'

const emotionRadios = document.getElementById('emotion-radios')
const getImageBtn = document.getElementById('get-image-btn')
const gifsOnlyOption = document.getElementById('gifs-only-option')
const memeModalInner = document.getElementById('meme-modal-inner')
const memeModal = document.getElementById('meme-modal')
const memeModalCloseBtn = document.getElementById('meme-modal-close-btn')


emotionRadios.addEventListener('change', highlightCheckedOption)

memeModalCloseBtn.addEventListener('click', closeModal)

getImageBtn.addEventListener('click', function(event) {
    renderCat();
    event.stopPropagation(); // stops the blooming of the event to the body
});


function highlightCheckedOption(e){
    const radios = document.getElementsByClassName('radio')
    for (let radio of radios){
        radio.classList.remove('highlight')
    }
    document.getElementById(e.target.id).parentElement.classList.add('highlight')
}

function closeModal(){
    memeModal.style.display = 'none'
}

function renderCat(){
    const catsArray = getMatchingCatsArray()
    console.log(catsArray)
    const catObject = getSingleCatObject()
    //creating the thumbnail container
    const thumbnailContainer = document.createElement("div")
    thumbnailContainer.style.display = "flex"
    thumbnailContainer.style.flexWrap = "wrap"
    thumbnailContainer.classList.add("thumbnail-container")

    memeModalInner.innerHTML =  `
        <img 
        class="cat-img" 
        src="./images/${catObject.image}"
        alt="${catObject.alt}"
        >
        `
    memeModalInner.appendChild(thumbnailContainer)
    
    // Filter the catsArray to exclude the cat object obtained from getSingleCatObject
    const filteredCatsArray = catsArray.filter(cat => cat !== catObject);

    filteredCatsArray.forEach(cat => {
        let thumbnailImage = document.createElement("img");
        thumbnailImage.classList.add("thumbnail-image");
        thumbnailImage.src = `./images/${cat.image}`;
        thumbnailImage.alt = cat.alt;
        thumbnailContainer.appendChild(thumbnailImage);
    });

    //making the modal visible
    memeModal.style.display = 'flex'
}

function getSingleCatObject(){
    const catsArray = getMatchingCatsArray()
    
    if(catsArray.length === 1){
        return catsArray[0]
    }
    else{
        const randomNumber = Math.floor(Math.random() * catsArray.length)
        return catsArray[randomNumber]
    }
}

function getMatchingCatsArray(){     
    if(document.querySelector('input[type="radio"]:checked')){
        const selectedEmotion = document.querySelector('input[type="radio"]:checked').value
        const isGif = gifsOnlyOption.checked
        
        const matchingCatsArray = catsData.filter(function(cat){
            
            if(isGif){
                return cat.emotionTags.includes(selectedEmotion) && cat.isGif
            }
            else{
                return cat.emotionTags.includes(selectedEmotion)
            }            
        })
        return matchingCatsArray 
        
    }  
}

function getEmotionsArray(cats){
    const emotionsArray = []    
    for (let cat of cats){
        for (let emotion of cat.emotionTags){
            if (!emotionsArray.includes(emotion)){
                emotionsArray.push(emotion)
            }
        }
    }
    return emotionsArray
}

function renderEmotionsRadios(cats){
        
    let radioItems = ``
    const emotions = getEmotionsArray(cats)
    for (let emotion of emotions){
        radioItems += `
        <div class="radio">
            <label for="${emotion}">${emotion}</label>
            <input
            type="radio"
            id="${emotion}"
            value="${emotion}"
            name="emotions"
            >
        </div>`
    }
    emotionRadios.innerHTML = radioItems
}

renderEmotionsRadios(catsData)



document.body.addEventListener('click', function(event) {
    if (window.getComputedStyle(memeModal).display === "flex" && !memeModal.contains(event.target)) {
        console.log("success");
        memeModal.style.display = "none";
    }
});
