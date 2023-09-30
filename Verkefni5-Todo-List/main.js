// Tiago Miguel Martins Foutinho
// Verkefni 5

// ------------------ Constants ------------------ //

const itemList = document.getElementById('itemList');
const totalPrice = document.getElementById('totalPrice');

// ------------------ Global Breytur ------------------ //

let shoppingList = loadShoppingListFromLocalStorage();

// ------------------ Functions ------------------ //

// Hlaða inn innkaupalista úr localStorage eða nota gefinn lista
function loadShoppingListFromLocalStorage() {
  const savedList = localStorage.getItem('shoppingList');
  if (savedList) {
      return JSON.parse(savedList);
  } else {
      return {
        items: [
          {name:"T-Shirt", price: 3000},
          {name:"Pizza", price: 850},
          {name:"Bounty", price: 150},
          {name:"Coke", price: 250}
        ],
        total: 0
      };
  }
}
  
// Vista innkaupalistann í localStorage
function saveShoppingListToLocalStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Fall sem fjarlægir hlut úr listanum
function removeItem(index) {
  const confirmation = confirm("Ertu viss um að þú viljir fjarlægja þennan hlut?");
  if (confirmation) {
    shoppingList.items.splice(index, 1);
    saveShoppingListToLocalStorage();  // Vista breytingar í localStorage
    displayShoppingList();  // Birta listann aftur eftir breytingu
  }
}

// Birta innkaupalistann
function displayShoppingList() {
  const itemListDiv = document.getElementById('itemList');
  itemListDiv.innerHTML = ''; // Hreinsa núverandi birtu

  shoppingList.items.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.innerText = `${item.name}: ${item.price} Isk`;
    itemDiv.style.cursor = 'pointer';
    itemDiv.title = 'Smelltu til að fjarlægja';
    itemDiv.addEventListener('click', () => removeItem(index));
    itemListDiv.appendChild(itemDiv);
  });

  // Reikna samtalsverð
  shoppingList.total = shoppingList.items.reduce((acc, item) => acc + item.price, 0);
  document.getElementById('totalPrice').innerText = `Samtals: ${shoppingList.total} Isk`;
}

// Bæta við nýjum hlut í listann
function addNewItem() {
  const itemName = document.getElementById('itemName').value;
  const itemPrice = parseInt(document.getElementById('itemPrice').value); // Breyta í heiltölu

  if (itemName && itemPrice) {
    const newItem = {
        name: itemName,
        price: itemPrice
    };

  shoppingList.items.push(newItem);
  saveShoppingListToLocalStorage();  // Vista breytingar í localStorage
  displayShoppingList();  // Birta listann aftur eftir breytingu

  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  } else {
    alert('Vinsamlegast skráðu nafn og verð vöru.');
  }
}

// ------------------ Automatic Code ------------------ //

// Birta innkaupalistann þegar síðan er hlaðin
displayShoppingList();
