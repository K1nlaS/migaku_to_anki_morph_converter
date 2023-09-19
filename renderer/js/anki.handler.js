const anki = document.querySelector("#anki");
const modelSelect = document.getElementById('modelSelect');
const fieldSelect = document.getElementById('fieldSelect');
const addCards = document.querySelector("#addCards");

const ankiConnectInvoke = async (action, version, params = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', () => reject('failed to connect to AnkiConnect'));
    xhr.addEventListener('load', () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.error) {
          throw response.error;
        } else {
          if (response.hasOwnProperty('result')) {
            resolve(response.result);
          } else {
            reject('failed to get results from AnkiConnect');
          }
        }
      } catch (e) {
        reject(e);
      }
    });

    xhr.open('POST', 'http://127.0.0.1:8765');
    xhr.send(JSON.stringify({ action, version, params }));
  });
};

const getDecks = async () => {
  try {
    const decks = await ankiConnectInvoke('deckNames', 5);
    const models = await ankiConnectInvoke('modelNames', 5);

    // Get a reference to the <select> element
    const deckSelect = document.getElementById('deckSelect');

    // Clear any existing options
    deckSelect.innerHTML = '';
    modelSelect.innerHTML = '';

    //Populate the dropdown with deck names
    decks.forEach(deckName => {
      const option = document.createElement('option');
      option.text = deckName;
      deckSelect.add(option);
    });

    //Populate the dropdown with model names
    models.forEach(modelName => {
      const option = document.createElement('option');
      option.text = modelName;
      modelSelect.add(option);
    });

  } catch (e) {
    console.log(`error getting decks: ${e}`);
  }
};

const getFields = async (e) => {
  const fields = await ankiConnectInvoke('modelFieldNames', 5, { "modelName": e.target.value });

  // Clear any existing options
  fieldSelect.innerHTML = '';

  //Populate the dropdown with deck names
  fields.forEach(deckName => {
    const option = document.createElement('option');
    option.text = deckName;
    fieldSelect.add(option);
  });

};

const addUnknownWords = async () => {
  const selectedDeck = deckSelect.options[deckSelect.selectedIndex];
  const selectedModel = modelSelect.options[modelSelect.selectedIndex];
  const selectedField = fieldSelect.options[fieldSelect.selectedIndex];

  if (!filteredArray) {
    console.log("Please upload Migaku JSON and Anki Morphman data file first.");
    return;
  }

  // Extract the first elements and join them with "。"
  const kanjiString = filteredArray.map(subArray => subArray[0]).join('。 ');

  // Extract the second elements and join them with "。"
  const hiraganaString = filteredArray.map(subArray => subArray[1]).join('。 ');


  const kanjiParams = {
    "note": {
      "deckName": selectedDeck.value.toString(),
      "modelName": selectedModel.value.toString(),
      "fields": {
        [selectedField.value.toString()]: kanjiString.toString(),
      },
    }
  };

  const hiraganaParams = {
    "note": {
      "deckName": selectedDeck.value.toString(),
      "modelName": selectedModel.value.toString(),
      "fields": {
        [selectedField.value.toString()]: hiraganaString.toString(),
      },
    }
  };

  try {
    await ankiConnectInvoke('addNote', 5, kanjiParams);
    await ankiConnectInvoke('addNote', 5, hiraganaParams);
  } catch (error) {
    console.error('An error occurred:', error);
  }

};

modelSelect.addEventListener("change", getFields);
anki.addEventListener("click", getDecks);
addCards.addEventListener("click", addUnknownWords);