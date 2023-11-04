// Changing input labels to uploaded file's names
const migakuInput = document.getElementById('migaku');
const migakuLabel = document.querySelector('.custom-file-label[for="migaku"]');
const customFileMigaku = document.querySelector('.custom-file[data-target="migaku"]');

migakuInput.addEventListener('change', function() {
  migakuLabel.textContent = migakuInput.files[0].name;
  customFileMigaku.classList.add('file-selected');
});

const dataInput = document.getElementById('data');
const dataLabel = document.querySelector('.custom-file-label[for="data"]');
const customFileData = document.querySelector('.custom-file[data-target="data"]');

dataInput.addEventListener('change', function() {
  dataLabel.textContent = dataInput.files[0].name;
  customFileData.classList.add('file-selected');
});


// Don't display Upload Cards button unilt there are elemtns in the deck selects
const deckSelect = document.getElementById('deckSelect');
const addCardsButton = document.getElementById('addCards');

// Function to check if any of the selects have options selected
function checkSelects() {
  if (deckSelect.options.length === 0 && modelSelect.options.length === 0 && fieldSelect.options.length === 0) {
    addCardsButton.style.display = 'none'; // Hide the button
  } else {
    addCardsButton.style.display = ''; // Show the button
  }
}

// Call the function initially
checkSelects();