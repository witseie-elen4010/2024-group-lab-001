
# 🎨 Miscommunication Mayhem 🎨

[![Coverage Status](https://coveralls.io/repos/github/witseie-elen4010/2024-group-lab-001/badge.svg?branch=main)](https://coveralls.io/github/witseie-elen4010/2024-group-lab-001?branch=main)



## ✨ Authors:

-   **Muaawiyah Dadabhay**
-   **Muhammad Raees Dindar**
-   **Taahir Kolia**
-   **Irfaan Mia**

## 📄 Gameplay Description:

Welcome to **Miscommunication Mayhem**, a hilarious game inspired by the classic "Broken Picture Telephone"! This game breathes new life into the beloved mechanics of the original, with a delightful sequence of drawing, prompting, and guessing. 

Players start with a prompt, and the next player draws their interpretation. The fun continues as the next player guesses the drawing and writes a new prompt. This cycle repeats, leading to endless laughter from the humorous and unexpected miscommunications that arise.

🎉 **Minimum Players:** 3  
🎉 **Maximum Players:** 5

## 🚀 Current Features:

- **🔐 Personal Accounts:** Create and sign in to save your details.
- **🚪 Guest Accounts:** Jump straight in without passwords.
- **👥 Lobby Creation:** Create or join a lobby with a room code.
- **📏 Lobby Sizes:** 3 to 5 players.
- **⏲️ Timed Rounds:** Prompting and drawing timers for smooth gameplay.
- **💡 Prompt Generator:** Use our pre-defined prompts if you're stuck.
- **🎨 Artistic Tools:** Pen, highlighter, spray can, eraser, and more! Undo strokes or clear the canvas easily.
- **🔄 Replay:** Play again with the same lobby or create a new room for more friends.
- **👀 Endgame Gallery:** View all prompts and drawings at the end of the game.
- **🛠️ Admin Tools:** Access logs of all user actions if you have admin credentials.
- **👤 User Identification:** Usernames are displayed and identified properly.

## 🐛 Current Known Bugs:

- **Player Leaving Bug:** If a player leaves after returning to the lobby screen, other players will see the previous game's end-game screen.
- **Drawing Undo Bug:** If a player draws in two consecutive games in the same lobby, they can "undo" their drawing in the second game, revealing their first game's drawing. (This bug is inconsistent.)

## 🔧 Internals:

- **📝 JavaScript and HTML**
- **🎨 CSS** for visual styling
- **🔥 Firebase** for logins and database storage
- **💬 Socket.io** for server-client communication

## 💻 Technical Requirements:

- **Unique Users:** Ensure each user logs in with different credentials on different browsers if testing on a single computer. Session cookies may cause issues with multiple tabs in one browser session.

## 📦 Installation:

If you wish to set up the application locally for development purposes, please follow these steps:

**Cloning:**

```bash
git clone git@github.com:witseie-elen4010/2024-group-lab-001.git
cd 2024-group-lab-001
npm init (Accept all default settings)
npm install
```

**Usage:**

1.  Request a `.env` file by emailing 2426234@students.wits.ac.za. This file contains sensitive information such as API keys and should not be shared publicly.
    
2.  Once you have received the `.env` file, place it in the root directory of the project.
3.  Start the development server:

```bash
npm start
```
4. Access the application at `http://localhost:3000`.



## 📊 Jest Code Coverage Report:

| File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|-------------|---------|----------|---------|---------|-------------------|
| **All files** | 78.22  | 68.68   | 66.66  | 76.86  | - |

---

**Enjoy the mayhem and have a blast!** 😄🎉