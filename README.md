# Migaku to Anki Morph Converter Documentation

## Technical Documentation for Developers

### 1. Introduction
- **Purpose:** The Migaku to Anki Morph Converter is an Electron application designed to convert Migaku JSON data into Anki cards for MorphMan to mark as known.
- **Prerequisites:** To develop or use this application, ensure you have the following:
  - Anki installed with Anki Connect
  - Chrome's Migaku extension
  - MorphMan extension for Anki
- **Key Features:**
  - JSON file processing
  - Anki integration
  - Data filtering

### 2. Installation
- **Development Setup:**
  - Clone the Git repository.
  - Install Node.js and npm.
  - Run `npm install` to install dependencies.
- **Anki and Extensions:**
  - Install Anki and the Anki Connect and MorphMan extensions.
  - Ensure Anki is running during usage.

### 3. Project Structure
- **Overview:** The project consists of the following key files and directories:
  - `main.js`: The main Electron script
  - `index.html`: The main HTML file
  - `anki.handler.js`: Handles Anki integration
  - `js/renderer.js`: Handles Migaku and data file processing
  - `js/html.handler.js`: Handles HTML input elements
  - `css/style.css`: Application styling

### 4. Configuration
- **Config Files:** The application uses specific configurations for Anki integration and file processing. These are found in the code.

### 5. How the App Works
- **Data Flow:** The application processes Migaku JSON data against MorphMan's known words database, filters it, and adds missing words to Anki.
- **Components:**
  - `crossCheck`: Filters data for duplicates.
  - Data file handling functions.
  - Anki integration using Anki Connect.

### 6. API and Data Format
- **External Services:** The app interacts with Anki via Anki Connect.


## How to Use Section for Users

### 1. Requirements
- Ensure you have Anki, Anki Connect, and MorphMan installed.

### 2. Installation
- **Setup:** Follow these steps to set up the application on your computer.
- **Extension Installation:** Check if Anki, Anki Connect, and MorphMan are properly installed.

### 4. Converting
- **File Selection:** Choose the Migaku JSON file you want to convert.
- **Known Words:** Choose the .txt file with known words obtained from MorphMan.

## .txt File Format

**Formatting:** Ensure your .txt file meets the following requirements:
- Each word is on a new line.

**Obtaining Data:** Here's how to create this file from Anki's MorphMan extension:
1. Go to Anki's "Tools" menu.
2. Select "MorphMan" and then "Data Manager."
3. In the opened window, click "Browse for DB A" and choose the "known.db" file in your Anki profile directory (e.g., Anki2/your-profile-name/dbs).
4. At the bottom of the window, choose "One Result Column."
5. Click the button labeled "A" to retrieve the data.
6. Select all the words that the window returns with Ctrl + A.
7. Create a .txt file and paste the copied data from MorphMan.

This .txt file will serve as the input for the application, allowing you to convert Migaku JSON to Anki cards with ease.

### 5. Adding Cards
- **Get Decks**: Click "Get Decks" to load your Anki decks and card notes.
- **Choose Deck to Add Cards**: It is recommended to create a sub-deck for your main sentence deck with a ::Known suffix, or you can simply use an empty deck.
- **Upload Cards**: Once you've filtered the morphs and selected a deck to add missing words, click "Upload Cards."
