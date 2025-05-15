# Word of the Day App

A simple React Native app built with Expo that displays a "Word of the Day" fetched from a free public API along with its definition and example sentence. The app stores a history of viewed words using AsyncStorage for persistent local storage.

---

## Features

- Fetches a new random word with definition and example from a free public API.
- Saves and displays history of all previously viewed words using AsyncStorage.
- Allows clearing the entire history.
- Navigation between Home and History screens using React Navigation.
- Data persistence ensures history is saved between app sessions.


## Installation and Running the App
<img src="./assets/images/QR.png" alt="QR Code" width="200"/>


### Prerequisites

- Node.js and npm installed
- Expo CLI installed globally (optional but recommended):
  ```bash
  npm install -g expo-cli
