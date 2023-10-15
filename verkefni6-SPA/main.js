// Tiago Miguel Martins Foutinho
// Skilaverkefni 6

// ------------------ Constants ------------------ //

// Ná í html gögn fyrir síðari notkun.
const container = document.getElementById('itemContainer');
const slider = document.getElementById('priceRange');
const minValue = document.getElementById('minValue');
const maxValue = document.getElementById('maxValue');
const currentValueLabel = document.getElementById('currentValueLabel');
const sortOptions = document.getElementById('sortOptions');
const searchInput = document.getElementById('searchInput');
const dateInput = document.getElementById('dateInput');

// ------------------ Global Variables ------------------ //


let originalItems = []; // Fylki til að geyma upprunalega listann fyrir hluti í JSON skrá.

// ------------------ Functions ------------------ //

// fetchData aðgerð: Nær í gögn úr 'vidburdir.json' skrá á ósamstilltan hátt.
async function fetchData() {
  try {
    const response = await fetch('vidburdir.json');
    const data = await response.json();
    originalItems = data;
    processData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// processData aðgerð: Vinna úr gögnum, reikna lágmarks og hámarksverð, og frumstilla rennilás og skjár.
function processData(data) {
  const prices = data.map(item => parseInt(item.Price.replace(/[^0-9]/g, '')));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const step = 1000;
  
  initializeSlider(minPrice, maxPrice, step);
  displayData(data);
}

// displayData aðgerð: Birtir hluti á vefsíðunni.
function displayData(items) {
  container.innerHTML = '';
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-card';
    itemDiv.innerHTML = 
        `<h2>${item.Name}</h2>
        <sub>Staður: ${item.Place} Dagsetning: ${item.Date}</sub>
        <p>price: ${item.Price}</p>
        <img src="${item.ImageLink}" alt="" >`;
    container.appendChild(itemDiv);
  });
}

// initializeSlider aðgerð: Stilla verðsviðrennilás með min, max, og skref gildum.
function initializeSlider(min, max, step) {
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = max;

  minValue.textContent = min + ' ISK';
  maxValue.textContent = max + ' ISK';

  updatePriceRangeLabel(slider.value);
}

// updatePriceRangeLabel aðgerð: Uppfærir textamerki fyrir rennilás með núverandi gildi.
function updatePriceRangeLabel(value) {
  currentValueLabel.innerText = value + ' ISK';
  filterItemsByPrice(value);
}

// filterItemsByPrice aðgerð: Síar hluti eftir verði og uppfærir birta hluti.
function filterItemsByPrice(value) {
  const filteredItems = originalItems.filter(item => parseInt(item.Price.replace(/[^0-9]/g, '')) <= value);
  displayData(filteredItems);
}

// cleanPrice aðgerð: Hreinsar verðstreng með því að fjarlægja ekki-tölustafi og umbreyta í tölu.
function cleanPrice(price) {
  return Number(price.replace(/[^0-9.-]+/g,""));
}

// filterItemsBySearch aðgerð: Síar hluti eftir leitarskilyrðum sem notandi slær inn.
function filterItemsBySearch(event) {
  const query = event.target.value.toLowerCase();
  const filteredItems = originalItems.filter(function(item) {
      return item.Name.toLowerCase().includes(query);
  });
  displayData(filteredItems);
}

// sortItems aðgerð: Raðar hlutum eftir völdum viðmiðum (verði hækkandi, verði lækkandi, eða dagsetningu).
function sortItems() {
  const sortOption = this.value;
  let sortedItems;

  switch (sortOption) {
    case 'priceAsc':
      sortedItems = [...originalItems].sort((a, b) => cleanPrice(a.Price) - cleanPrice(b.Price));
      break;
    case 'date':
      sortedItems = [...originalItems].sort((a, b) => new Date(b.Date) - new Date(a.Date));
      break;
    default:
      sortedItems = [...originalItems];
      break;
  }

  displayData(sortedItems);
}

// ------------------ Event Listeners ------------------ //

// Event Listiner fyrir verð slider og síun.
slider.oninput = function() {
  updatePriceRangeLabel(this.value);
  filterItemsByPrice(this.value);
};

// Bæta við Event Listiner fyrir röðun og leit.
sortOptions.addEventListener('change', sortItems); // Referenced the sortItems function
searchInput.addEventListener('input', filterItemsBySearch); // Referenced the filterItemsBySearch function

// ------------------ Initial Execution ------------------ //

fetchData(); // Ná í gögn og birta hluti í upphafi.

