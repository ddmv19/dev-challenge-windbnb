import './style.css'

const city = document.querySelector('#city');
const actualGuests = document.querySelector('#actual-guests');
const searchContainer = document.querySelector('.search-container');
const quantityResults = document.querySelector('#quantity-results');

const roomsContainer = document.querySelector('.results-container');

const closeSVG = document.querySelector('#close-svg');
const editSearchContainer = document.querySelector('#edit-search');

const optionsContainer = document.querySelector('.options-container');
const optionsLocations = document.querySelector('#options-locations');
const optionsGuests = document.querySelector('#options-guests');

const addGuests = document.querySelectorAll('.more');
const lessGuests = document.querySelectorAll('.less');
const quantityAdults = document.querySelector('#quantity-adults');
const quantityChildrens = document.querySelector('#quantity-childrens');
const locationSpanElement = document.querySelector('#location');
const guests = document.querySelector('#guests');

const btnSearch = document.querySelector('#btn-search');

async function getDataByCity(city) {
  const data = await fetch('./public/stays.json')
                .then(response => response.json());
  
  return data.filter(room => room.city === city);
}

async function getWholeData() {
  const data = await fetch('./public/stays.json')
                .then(response => response.json());

  return data;
}

const roomsToFill = await getWholeData();

roomsToFill.forEach(room => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
  <figure>
    <img src="${room.photo}" alt="photo">
  </figure>
  <div class="room-description">
    ${ room.superHost ? `<section class="superhost">
    Super Host
  </section>` : ``}
    <section class="type-room">
      ${room.type} ${room.beds != null ? `.${room.beds} beds` : ``} 
    </section>
    <section class="calification-room">
      <figure>
        <img src="./public/icon-star.svg" alt="icon-star">
      </figure>
      <span>${room.rating}</span>
    </section>
  </div>
  <div class="room-title">
    ${room.title}
  </div>
  `;
  roomsContainer.appendChild(card);
});

searchContainer.addEventListener('click', () => {
  editSearchContainer.classList.add('active');
});

closeSVG.addEventListener('click', () => {
  editSearchContainer.classList.remove('active');
});

optionsContainer.addEventListener('click', (e) => {
  const elementName = e.target.localName;
  if(elementName != 'button' && elementName === 'section') {
    const locationOptionsContainer = document.querySelector('.locations-options');
    const guestsOptionsContainer = document.querySelector('.guests-options');
    const section = e.target;
    const sectionName = section.getAttribute('class');
    locationOptionsContainer.classList.remove('active');
    guestsOptionsContainer.classList.remove('active');
    section.classList.add('active');
    optionsLocations.classList.remove('active');
    optionsGuests.classList.remove('active');
    if(sectionName.includes('locations')) {
      optionsLocations.classList.add('active');
    } else if(sectionName.includes('guests')) {
      optionsGuests.classList.add('active');
    }
  }
});

optionsLocations.addEventListener('click', (e) => {
  const elementName = e.target.localName;
  if(elementName === 'section') {
    const section = e.target;
    const location = section.innerText;
    const locationTextClean = location.split(',').at(0);
    const actualText = locationSpanElement.innerText;
    let newLocation;
    if(actualText.includes('Helsinki')) {
      newLocation = actualText.replace('Helsinki', locationTextClean);
    } else if(actualText.includes('Turku')) {
      newLocation = actualText.replace('Turku', locationTextClean);
    } else if(actualText.includes('Vaasa')) {
      newLocation = actualText.replace('Vaasa', locationTextClean);
    } else if(actualText.includes('Oulu')) {
      newLocation = actualText.replace('Oulu', locationTextClean);
    }
    locationSpanElement.innerText = newLocation;
  }
});

addGuests.forEach(btnAdd => {
  btnAdd.addEventListener('click', (e) => {
    const element = e.target.nextElementSibling;
    let actualQuantity;
    if(element.getAttribute('id') === 'quantity-adults') {
      actualQuantity = parseInt(quantityAdults.innerText);
      quantityAdults.innerText = ++actualQuantity;
    } else {
      actualQuantity = parseInt(quantityChildrens.innerText);
      quantityChildrens.innerText = ++actualQuantity;
    }
    guests.innerText = parseInt(quantityAdults.innerText) + parseInt(quantityChildrens.innerText);
  });
});

lessGuests.forEach(btnLess => {
  btnLess.addEventListener('click', (e) => {
    const element = e.target.previousElementSibling;
    let actualQuantity;
    if(element.getAttribute('id') === 'quantity-adults') {
      actualQuantity = parseInt(quantityAdults.innerText);
      quantityAdults.innerText = actualQuantity > 0 ? --actualQuantity : 0;
    } else if(element.getAttribute('id') === 'quantity-childrens') {
      actualQuantity = parseInt(quantityChildrens.innerText);
      quantityChildrens.innerText = actualQuantity > 0 ? --actualQuantity : 0;
    }
    guests.innerText = parseInt(quantityAdults.innerText) + parseInt(quantityChildrens.innerText);
  });
});

btnSearch.addEventListener('click', async (e) => {
  const locationText = locationSpanElement.innerText;
  const locationTextClean = locationText.split(',').at(0);
  const guestsQuantity = parseInt(guests.innerText);
  city.innerText = locationTextClean;
  actualGuests.innerText = guestsQuantity;
  const roomsByCity = await getDataByCity(locationTextClean);
  const searchResults = roomsByCity.filter(room => room.maxGuests >= guestsQuantity);
  quantityResults.innerText = `+${searchResults.length} stays`;
  roomsContainer.innerHTML = '';
  if(searchResults.length > 0) { 
    console.log({searchResults});
    searchResults.forEach(room => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
      <figure>
        <img src="${room.photo}" alt="photo">
      </figure>
      <div class="room-description">
        ${ room.superHost ? `<section class="superhost">
        Super Host
        </section>` : ``}
        <section class="type-room">
          ${room.type} ${room.beds != null ? `.${room.beds} beds` : ``} 
        </section>
        <section class="calification-room">
          <figure>
            <img src="./public/icon-star.svg" alt="icon-star">
          </figure>
          <span>${room.rating}</span>
        </section>
        </div>
        <div class="room-title">
          ${room.title}
        </div>
    `;
      roomsContainer.appendChild(card);
    });
  } else {
    const messageNotFound = document.createElement('h1');
    messageNotFound.innerText = 'No result found.';
    roomsContainer.appendChild(messageNotFound);
  }
  editSearchContainer.classList.remove('active');
});



