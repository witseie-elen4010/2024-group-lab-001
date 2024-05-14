## Sprint Retrospective: Sprint 3

### Date: 14 May 2024

### Team Members Present:

- Muaawiyah Dadabhay

- Muhammed Raees Dindar

- Taahir Kolia

- Irfaan Mia

---

### What Went Well


-  **Feature Enrichment:** In Sprint 3, we focused on enhancing the main functionality of our game by introducing a fully functional gameplay loop which randomly selects users within a lobby to either provide a prompt, draw, or describe a drawing - all within a specified duration. Additionally, features such as accepting cookies, providing random prompts to users, and post-game lobby management options were implemented to improve user experience, promote engagement, and offer greater flexibility during gameplay. 



-  **Contributor Contributions:** The team made commendable contributions, with each member actively participating in the development process. Collaborative efforts were evident, and merging conflicts were minimal, indicating effective coordination within the team.

  

-  **Adherence to Guidelines:** Team members continued to adhere to coding and commit guidelines, ensuring consistency and maintainability of the codebase. This disciplined approach facilitated smooth progress throughout the sprint.

  

---

  

### Challenges Faced

  -   **Button Emitting Issues:** During development, a challenge emerged where if users returned to the same lobby and pressed the start game button in the lobby, server emits would be produced by multiple users rather than one, thereby causing unintended behavior. The challenge stemmed from the host initially being assigned to the player who initiated the game. However, upon returning to the same lobby, any player starting the game would also be assigned as a host, resulting in emits to the server from multiple  users. This issue hindered the flow of user interactions within the lobby environment. It was fixed by assigning the player who created the lobby as a host and only allowing the host to start the game. 

-   **Timer Resetting Issue:** After implementing the feature allowing players to remain within the same game, we encountered difficulties with timers only resetting correctly for the host. This inconsistency disrupted the synchronisation of game elements and affected the overall gameplay experience. This issue was resolved by ensuring that the timers were correctly reset across all users.
  
 -   **Socket.io Testing Environment Complexity:** Mocking and testing the socket connections within the game loop proved to be challenging due to the intricate logical complexity of these connections. This issue hindered the efficiency of testing procedures and posed a barrier to ensuring the stability and reliability of the game's networking functionality.

---

  

### Action Items for Future Sprints

  

-  **Resolve Testing Issues:** Prioritise the resolution of Playwright test failures on GitHub Actions to ensure reliable integration testing across environments. Furthermore, ensure comprehensive implementation of socket testing, covering various aspects and scenarios to validate the stability and functionality of the socket connections thoroughly.
  

-  **Address Secret Variables Setup:** Further investigate and implement solutions to overcome difficulties related to setting up secret variables for the Firebase database, ensuring smooth execution of GitHub Actions.

 - **Implement Remaining Game Features:**   Aim to develop and integrate the remaining game features to conclude the development phase effectively. This includes drawing tool additions, displaying the entire sequence of prompts, drawings, and descriptions at the end of a game, and providing admin insights. 

 - **Incorporate Stakeholder Feedback:** Attempt to incorporate feedback received from stakeholders on May 2, 2024, into the last sprint, making necessary adjustments and enhancements based on their input.
  
---

  

### Sprint Velocity (Based on Sprint 2)

  

-  **Total Story Points:** 22

-  **Team Members:** 4

-  **Sprint Duration:** 1 week

-  **Velocity per Team Member:** 5.5 story points

  

---

### Sprint Velocity

  
  

To calculate sprint velocity, the team collaboratively assigned story points to each user story as shown below:

  

1. Accept Cookies: 3 points

2. Enter my own drawing prompt: 5 points

3. Be notified that a player is entering a Prompt if it is not my turn to enter a Prompt: 2 points

4. Select a pre-listed prompt from a Random Set of prompts: 3 points

5. View a countdown when prompting: 3 points

6. Be notified that a player is drawing/entering a Prompt: 3 points

7. Option to Remain in the Same lobby and return to the Lobby Screen for a New Game: 3 points

8. Option to Leave Lobby Session and Return to Lobby Management Screen: 2 points

  

Total story points: 24

  

Given that there are 8 user stories for the sprint and all 8 were completed, and with a team size of 4 members, the sprint velocity is calculated as follows:


Sprint Velocity = Total Story Points / Number of Team Members

= 24 / 4

= 6 story points per team member

---

### Team Feedback

In addition to the insights provided above, the team has no further feedback to contribute at this stage of the project.

---


### Stakeholder Feedback
  

During our second stakeholder meeting on 09 May 2024, stakeholders' were satisfied with the progress and outcomes of the implemented features, feedback during the subsequent meeting was relatively limited. This indicates a positive reception and alignment with stakeholder expectations regarding the direction and quality of the project's development.