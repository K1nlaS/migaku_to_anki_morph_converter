const migaku = document.querySelector("#migaku");
const data = document.querySelector("#data");
const crosscheck = document.querySelector("#crosscheck");


let filteredArray = null;
let migakuFile = null;
let dataFile = null;

// Migaku File Logic
const loadMigakuFile = (e) => {
  const file = e.target.files[0];

  if (!checkMigakuFile(file)) {
    console.log("Please upload a .json file");
    return;
  }

  migakuFile = file;
};

const checkMigakuFile = (file) => {
  const acceptedType = "application/json";

  return file && acceptedType.includes(file["type"]);
};

const formatMigaku = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function(e) {
      try {
        const jsonArray = JSON.parse(e.target.result);

        // Process each item in the array
        const formattedArray = jsonArray
          .filter((item) => item[1] === 2) // Filter by the number at the end being 2, which stands for Known words
          .map((item) => {
            const [before, after] = item[0].split("◴");
            return [before, after];
          });

        resolve(formattedArray);
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsText(file);
  });
};

// Data File Logic
const loadDataFile = (e) => {
  const file = e.target.files[0];

  if (!checkDataFile(file)) {
    console.log("Please upload a .txt file");
    return;
  }

  dataFile = file;
};

const checkDataFile = (file) => {
  const acceptedType = "text/plain";

  return file && acceptedType.includes(file["type"]);
};

const formatDataFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function(e) {
      try {
        const text = e.target.result;

        // Split the text into lines
        const lines = text.split("\n");

        // Initialize an array to store the cleaned words
        const cleanedWords = [];

        // Loop through the lines starting from the second line
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim(); // Remove leading/trailing whitespace

          // Split the line by "-" and keep only the first part
          const word = line.split("-")[0].trim();

          cleanedWords.push(word);
        }

        // Check if the cleanedWords array contains only strings
        if (cleanedWords.every((item) => typeof item === "string")) {
          resolve(cleanedWords);
        } else {
          reject(new Error("Array must contain only strings."));
        }

      } catch (error) {
        reject(error);
      }
    };

    reader.readAsText(file);

  });
};


// Cross Check Logic
const crossCheck = async () => {
  const formattedMigaku = await formatMigaku(migakuFile);
  const formattedDataFile = await formatDataFile(dataFile);

  const stringSet = new Set(formattedDataFile);

  // Filter the arrayOfArrays to keep only elements that don't match any word in arrayOfStrings
  const returnFilteredArray = formattedMigaku.filter((wordArray) => {
    // Check if any word in wordArray is in the stringSet
    return !wordArray.some((word) => stringSet.has(word));
  });
  console.log("Filtered Deck completed:", returnFilteredArray);
  filteredArray = returnFilteredArray;
};




migaku.addEventListener("change", loadMigakuFile);
data.addEventListener("change", loadDataFile);
crosscheck.addEventListener("click", crossCheck);
