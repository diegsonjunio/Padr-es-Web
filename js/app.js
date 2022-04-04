function preRender(){
    let countVisibleCards = getCountVisibleCards();
    updateResults(countVisibleCards);
}

function getCountVisibleCards(){
    return 
    Array.from(document.getElementsByClassName("card")).filter((card) => !card.getElementsByClassName.display || card.getElementsByClassName.display !=="none").length;
}

function updateResults(count) {
    document.getElementById("countResult").textContent = count;
}

function filter() {
    let {search, operation, languages} = getFilterProperties();
    let interval = setInterval((_) => {
        let[containerEl] = document.getElementsByClassName("container");
        let changedText = search !== getSearchValue();
        if(!changedText) clearInterval(interval);
        if(containerEl && containerEl.children && !changedText) {
            let visibleCards = updateVisibleCards(containerEl,search,operation, languages);
            updateResults(visibleCards);
        }
    }, 800);
}

function getFilterProperties() {
    let search = getSearchValue();
    let[radio] = getSelectedRadio();
    let operation = RADIO.id == "1" ? "AND" : "OR";
    let languages = Array.from(getSelectedLanguages()).map((lang) => lang.name);
    return {
        search,
        operation,
        languages,
    };
}

function getSearchValue(){
    let inputSearchEl = document.getElementById("nameSearch");
    return inputSearchEl.value;
}

function getSelectedRadio(){
    return Array.from(document.querySelectorAll('header input[type="radio"]:checked'));
}

function getSelectedLanguages(){
    return Array.from(document.querySelectorAll('header input[type="checkbox"]:checked'));
}

function updateVisibleCards(container_el, search, operation, selectedLanguages){
    let visibleCards = 0;
    Array.from(container_el.children).forEach((card_el) => {
        let [title_el] = card_el.getElementsByClassName("card-title");
        let cardLanguages = Array.from(card_el.getElementsByClassName("iconLanguage")).map((image) => image.name);
        if(title_el) {
            let isMatchName = isMatchByName(title_el.textContent, search);
            if(!isMatchName && operation == "AND"){
                hideCard(card_el);
            } else if(isMatchName && operation == "OR") {
                showCard(card_el);
                visibleCards++;
            } else if(isMatchName && operation == "AND"){
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage) {
                    showCard(card_el);
                    visibleCards++;
                } else{
                    hideCard(card_el);
                }
            } else if (!isMatchName && operation == "OR") {
                let isMatchLanguage = isMatchByLanguage(cardLanguages, selectedLanguages);
                if(isMatchLanguage){
                    showCard(card_el);
                    visibleCards++;
                } else {
                    hideCard(card_el);
                }
            }
        }
    });
    return visibleCards;
}

function isMatchByName(textCard, textInput) {
    return textCard.toLowerCase().includes(textInput.toLowerCase());
}

function isMatchByLanguage(cardLanguages, selectedLanguages){
    return cardLanguages.some(cardLang => selectedLanguages.includes(cardLang));
}

function hideCard(card) {
    card.style.display = "none";
};

function showCard(card) {
    card.style.display = "flex";
}

const modalTemplate = `
      <div class="modal">
        <button class="fechar">x</button>
        <div class="profilePictureModal">
            <img class="image" name ="image-profile" src="_DEV_IMAGE_" alt="desenvolvedor" />
        </div>
        <div class="profileDescriptionModal">
            <div style="display: flex; flex-direction: column">
                <h2 class="card-title" name="devname">_DEV_NAME_</h2>
                <span name="age">_DEV_AGE_</span>
                <span name="description">_DEV_DESCRIPTION_</span>
                
                <h3>Contato</h3>
                <span name="mail">Email: <a href="#">_DEV_MAIL_</a></span>
                <span name="git">Github: <a href="#">_DEV_GIT_</a></span>
                <span name="phone">Telefone:_DEV_PHONE_</span>
            </div>
            <div class="languages">
            <h3>Linguagens</h3>
                _DEV_LANGUAGES_
            </div>
        </div>
      </div>
`;

Array.from(document.querySelectorAll('.card')).forEach(card => {
    card.addEventListener('click', (event) => iniciaModal('modal-profile', event.currentTarget.id));
});

function iniciaModal(modalID, cardId) {
    fillModal(getUserInfo(cardId));
    const modal = document.getElementById(modalID);
    if(modal) {
        modal.classList.add("mostrar");
        modal.addEventListener("click", (e) => {
            if(e.target.id == modalID || e.target.className == "fechar"){
                modal.classList.remove("mostrar");
            }
        })
    }
}

function getUserInfo(id) {
    let cardUser = document.getElementById(id);
    let userData = {};
    if (cardUser) {
      userData = [
        "age",
        "mail",
        "phone",
        "github",
        "username",
        "description",
        "descriptionAbility",
      ].reduce((acc, name) => {
        
        acc[name] = getTextContentByName(cardUser, name);
        return acc;
      }, {});
  
  userData.languages = Array.from(
          cardUser.querySelectorAll(".languages > .iconLanguage")
        ).reduce(function (acc, el) {
          let nameLanguage = el.name;
          acc[nameLanguage] = `${el.getAttribute("experience")}`;
          return acc;
        }, {});
        userData.picture = cardUser
          .querySelector(".profilePicture > img")
          .getAttribute("src");
    }
    
    return userData;
  }


function getTextContentByName(el, name, defaultValue = "") {
    let element = el.querySelector(`*[name=${name}]`);
    return element ? element.textContent : defaultValue;
}

function fillModal(userInfo) {
    let descriptionLanguages = getDescriptionLanguage();
    console.log(userInfo);

    languages = Object.keys(userInfo.languages)
    .map((langCode) => {
        return `
            <div class="languageDescription">
                <div class="language-name">
                    <img name="${langCode}" class="iconLanguage" src="images/${langCode}.png"
                    alt="language"/>
                    <span>${descriptionLanguages[langCode]}</span>               
                </div>
                <div class="modal-experience">
                    <span>${userInfo.languages[langCode]} Anos</span>
                </div>
            </div>          
        `;
    })
    .join("\n");


    modal = modalTemplate;
    modal = modal.replaceAll('_DEV_IMAGE_', userInfo.picture);
    modal = modal.replaceAll('_DEV_NAME', userInfo.username);
    modal = modal.replaceAll('_DEV_AGE', userInfo.age);
    modal = modal.replaceAll('_DEV_DESCRIPTION_', userInfo.description);
    modal = modal.replaceAll('_DEV_DESCRIPTION_ABILITY_',userInfo.descriptionAbility);    
    modal = modal.replaceAll('_DEV_MAIL_', userInfo.mail);
    modal = modal.replaceAll('_DEV_PHONE_', userInfo.phone);
    modal = modal.replaceAll('_DEV_GIT_', userInfo.github);
    modal = modal.replaceAll('_DEV_LANGUAGES_', languages);
    document.querySelector('#modal-profile').innerHTML = modal;
}

function getDescriptionLanguage() {
    let description = {
        js: "JavaScript",
        php: "PHP",
        java: "Java",
        python: "Python",
    };
    return description;
}