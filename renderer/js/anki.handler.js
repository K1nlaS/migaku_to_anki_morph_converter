const anki = document.querySelector("#anki");
const modelSelect = document.getElementById('modelSelect');
const fieldSelect = document.getElementById('fieldSelect');
const addCards = document.querySelector("#addCards");

const MAX_STRING_LENGTH = 1024; // Maximum string length

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


    const selectedModel = modelSelect.options[modelSelect.selectedIndex];
    const fields = await ankiConnectInvoke('modelFieldNames', 5, { "modelName": selectedModel.value });

    fields.forEach(fieldName => {
      const option = document.createElement('option');
      option.text = fieldName;
      fieldSelect.add(option);
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
  fields.forEach(fieldName => {
    const option = document.createElement('option');
    option.text = fieldName;
    fieldSelect.add(option);
  });

};

const splitStringIntoChunks = (inputString) => {
  const chunks = [];
  for (let i = 0; i < inputString.length; i += MAX_STRING_LENGTH) {
    chunks.push(inputString.slice(i, i + MAX_STRING_LENGTH));
  }
  return chunks;
};

const cardsDuplicateSearch = async (selectedDeck, selectedField) => {
  try {
    const alreadyInIdsParams = {
      "query": '"deck:' + selectedDeck.value.toString() + '"'
    };

    const alreadyInIds = await ankiConnectInvoke("findNotes", 5, alreadyInIdsParams);

    const alreadyInCardsParams = {
      "notes": alreadyInIds
    };
    const alreadyInCards = await ankiConnectInvoke("notesInfo", 5, alreadyInCardsParams);

    const formattedAlreadyInCards = alreadyInCards.map(card => card.fields[selectedField.value].value);

    // Function to split Japanese text into words
    function splitJapaneseText(text) {
      return text.split(/[\s。、]+/).filter(word => word.length > 0);
    }

    // Convert formattedAlreadyInCards to a set of unique words
    const uniqueWordsArray = new Set();
    for (const element of formattedAlreadyInCards) {
      const words = splitJapaneseText(element);
      words.forEach(word => uniqueWordsArray.add(word));
    }

    // Filter filteredArray to remove elements that contain words from formattedAlreadyInCards
    const filteredFinalArray = filteredArray.filter(([element]) => {
      const words = splitJapaneseText(element);
      return !words.some(word => uniqueWordsArray.has(word));
    });

    console.log("Final Filtered Deck completed:", filteredFinalArray);
    return filteredFinalArray;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error; // Re-throw the error to handle it at the calling site if needed.
  }
};

const addUnknownWords = async () => {
  const selectedDeck = deckSelect.options[deckSelect.selectedIndex];
  const selectedModel = modelSelect.options[modelSelect.selectedIndex];
  const selectedField = fieldSelect.options[fieldSelect.selectedIndex];

  if (!filteredArray) {
    console.log("Please upload Migaku JSON and Anki Morphman data file first.");
    return;
  }

  // Removing words that are already in the deck.
  const finalFilteredArray = await cardsDuplicateSearch(selectedDeck, selectedField);

  // Extract the first elements and join them with "。"
  const kanjiString = finalFilteredArray.map(subArray => subArray[0]).join('。 ');
  const kanjiChunks = splitStringIntoChunks(kanjiString);

  // Extract the second elements and join them with "。"
  const hiraganaString = finalFilteredArray.map(subArray => subArray[1]).join('。 ');
  const hiraganaChunks = splitStringIntoChunks(hiraganaString);

  // Create separate arrays for kanji and hiragana strings
  const kanjiParamsArray = kanjiChunks.map((chunk) => ({
    "note": {
      "deckName": selectedDeck.value.toString(),
      "modelName": selectedModel.value.toString(),
      "fields": {
        [selectedField.value.toString()]: chunk.toString(),
      },
    },
  }));

  const hiraganaParamsArray = hiraganaChunks.map((chunk) => ({
    "note": {
      "deckName": selectedDeck.value.toString(),
      "modelName": selectedModel.value.toString(),
      "fields": {
        [selectedField.value.toString()]: chunk.toString(),
      },
    },
  }));

  try {
    // Loop through the arrays and make AnkiConnect calls
    for (const kanjiParams of kanjiParamsArray) {
      await ankiConnectInvoke('addNote', 5, kanjiParams);
    }

    for (const hiraganaParams of hiraganaParamsArray) {
      await ankiConnectInvoke('addNote', 5, hiraganaParams);
    }

    console.log("Success");
  } catch (error) {
    console.error('An error occurred:', error);
  }

};

modelSelect.addEventListener("change", getFields);
anki.addEventListener("click", getDecks);
addCards.addEventListener("click", addUnknownWords);
