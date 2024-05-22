  

## Sprint Retrospective: Sprint 4

### Date: 21 May 2024

### Team Members Present:

- Muaawiyah Dadabhay

- Muhammed Raees Dindar

- Taahir Kolia

- Irfaan Mia

  

---

  

### What Went Well

  

-  **Feature Enrichment:** In Sprint 4, we focused on completing the main functionality of the game by incorporating administrator accounts and providing them with logs of actions carried out by users in games. Additionally, all the drawings and prompts that occured during a gameplay loop are displayed at the end of the game. Quality of life features such as allowing players to change tool colors and sizes were incorporated. Further improvements were made to the username displays by indicating to users who they are by highlighting their names in a different colour.



-  **Contributor Contributions:** The team made commendable contributions, with each member actively participating in the development process. Collaborative efforts were evident, and merging conflicts were minimal, indicating effective coordination within the team. Playwright and Jest tests were not designated solely to the team member who was assigned an associated user-story. This was done to allow the project to completed in a timely manner as all team members worked to compile an effective test suite.    

  

-  **Adherence to Guidelines:** Team members continued to adhere to coding and commit guidelines, ensuring consistency and maintainability of the codebase. This disciplined approach facilitated smooth progress throughout the sprint.

  

---

  

### Challenges Faced and Considerations
 - **Playwright Testing:** We encountered challenges with certain tests that were testing the main gameplay loop being flaky; they proved to take prolonged durations to complete for some browsers as loading of some assets and interactions were sluggish. This behaviour was only exhibited when testing. When manually testing these aspects, all assets loaded correctly. Additionally, end-to-end tests for the admin page were excluded as this required valid admin credentials to be used to access the admin page. This was a trade-off considered as this would've required leaking admin credentials in tests. This posed a potential security risk as access to the admin page should be restricted solely to the admins.
 
 - **Socket.io Testing Environment Complexity:** As mentioned in the Sprint 3 Retrospective, mocking and unit testing the socket connections was a challenge due to the intricate logical complexity of these connections. However, these challenges were overcome with a vast majority of these connections, and edge cases therein, being tested.   
 - **Usernames not  Displaying Correctly:** We faced an issue where usernames weren't accurately displayed on the game list. This was caused by an error in filtering the usernames when transmitting usernames to specific users. However, this issue was swiftly resolved.
 - **Admin logins:** When creating the admin logins, design considerations when storing admin credentials were considered. The first consideration was storing the credentials in a seperate database from the players which offered the advantage of an easy implementation but had the drawback of limiting admins strictly to the admin page. The second design choice considered was storing admin details and player details in the same database by assigning respective roles to the different users. The implementation was marginally more complex but allowed admin users to have access to logs on the admin page as well allowing them to play the game like a normal player. The second design choice was adopted due to the complete access that it provides to the admins.
 
 - **Limited Firebase Testing:** Furthermore, we encountered limitations in conducting Firebase testing because a significant portion of authentication and data handling processes occur within Firebase's infrastructure rather than within the application itself. Consequently, creating a mock environment for testing purposes became challenging, as there was no tangible data returned to facilitate testing. The login functionality was inherently tested in the end-to-end tests.   

---
### Current Known Bugs:
Having completed the final sprint, most problems that were encountered had been resolved. However, certain bugs are still prevelant:

- If a player leaves the game after returning to the lobby screen, all other players in the lobby will be shown the previous game's end-game screen. This bug was not gamebreaking and therefore was not prioritised over more crucial bugs

- If a player is selected to draw in two consecutive games within the same lobby, that player can "undo" their drawing in the second game, revealing their drawing from the first game. (Note: This bug could not be recreated consistently)
---

  

### Sprint Velocity (Based on Sprint 4)

  

-  **Total Story Points:** 27

-  **Team Members:** 4

-  **Sprint Duration:** 1 week

-  **Velocity per Team Member:** 6.75 story points

  

---

### Sprint Velocity

  
  

To calculate sprint velocity, the team collaboratively assigned story points to each user story as shown below:

  

1. Select an Admin Account Option for Login: 2 points
2. Login as an Admin Account: 3 points
3. View a Countdown when Guessing: 2 points
4. Select a Pen Colour: 3 points
5. Select a Pen Size: 3 points
6. Option to Undo a Stroke Recently Done and Clear Canvas: 3 points
7. Option for an Admin to View all Logs of Player Activities: 5 points
8. View all Drawings: 3 points
9. View all Prompts: 3 points

  

Total story points: 27

  

Given that there are 9 user stories for the sprint and all 9 were completed, and with a team size of 4 members, the sprint velocity is calculated as follows:

  

Sprint Velocity = Total Story Points / Number of Team Members

= 27 / 4

= 6.75 story points per team member


--- 
### Stakeholder Feedback

During the third stakeholder meeting on 16th May 2024, stakeholder was satisfied with the progress and outcomes of the implemented, feedback during the subsequent meeting was relatively limited. This indicates a positive reception and alignment with stakeholder expectations regarding the direction and quality of the project's development.

---

  

### Team Reflection
Having adopted Agile methodologies throughout this project, it taught us, as a team, to be adaptible and collaborative. Additionally, we learnt the importance of Iterative and Continuous Development as well as having a customer focus to ensure customer satisfaction by delivering a value application quickly and frequently. 
  
#### What We Did Well:
-   We successfully fulfilled all the fundamental requirements for the game's functionality within the specified timeframe.
-   These tasks were completed promptly and in a timely manner, ensuring adherence to project deadlines.
-   We placed a strong emphasis on user experience, striving to create an enjoyable and intuitive interface for our users.
-   As a team, we fostered clear and efficient communication and cultivated an environment conducive to collaboration, enabling us to freely seek assistance and brainstorm ideas.

  #### What We Could Improve On:
  -   We recognize the need for more comprehensive testing, particularly focusing on edge cases, right from the project's onset.
-   In hindsight, structuring all user stories to be independent of one another would have enhanced project organization and efficiency.
-   Reflecting on our project timeline, we acknowledge the importance of making more holistic time estimations for user stories, as many tasks ultimately took longer than initially anticipated.
---

  
  


