
## Sprint Retrospective: Sprint 2

### Date: 7 May 2024
### Team Members Present: 
- Muaawiyah
- Muhammed Raees
- Taahir Kolia
- Irfaan Mia

---

### What Went Well

- **Feature Enrichment:** We successfully expanded upon the foundation established in Sprint 1, enhancing the drawing game with several new features, including a tool selection box, drawing pen options, guest account login, eraser tool, and countdown timers. These additions significantly improved the user experience and enriched the gameplay.

- **Contributor Contributions:** The team made commendable contributions, with each member actively participating in the development process. Collaborative efforts were evident, and merging conflicts were minimal, indicating effective coordination within the team.

- **Adherence to Guidelines:** Team members continued to adhere to coding and commit guidelines, ensuring consistency and maintainability of the codebase. This disciplined approach facilitated smooth progress throughout the sprint.

---

### Challenges Faced

- **Playwright Test Issues:** Despite passing locally, certain Playwright tests encountered failures on GitHub Actions. @meneerfrikkie is dedicated to resolving this issue in Sprint 3 to ensure seamless integration testing across all environments.

- **Secret Variables Setup:** Difficulties arose in setting up secret variables related to the Firebase database within the GitHub repository environment in Sprint 1. This led to errors during GitHub Actions execution, highlighting the need for resolution to maintain the integrity of our testing pipeline. The idea was to resolve the issue by Sprint 3.

- **Cursor Alignment in Deployed Instances:** Discrepancies between the cursor and drawn elements were observed in certain deployed instances, impacting the user experience. @meneerfrikkie proposed a solution involving the creation of a cookie session to facilitate page navigation while logged in, aiming to rectify this issue in Sprint 3.

---

### Action Items for Future Sprints

- **Resolve Testing Issues:** Prioritize the resolution of Playwright test failures on GitHub Actions to ensure reliable integration testing across environments.

- **Address Secret Variables Setup:** Investigate and implement solutions to overcome difficulties related to setting up secret variables for the Firebase database, ensuring smooth execution of GitHub Actions.

- **Improve Cursor Alignment:** Implement @meneerfrikkie's proposed solution involving the creation of a cookie session to address cursor alignment issues in deployed instances, enhancing the overall user experience.

- **Focus on Page Navigation:** Redirect attention towards correcting issues related to page navigation, as identified by @meneerfrikkie's proposed solution, to mitigate challenges associated with dynamic dependency and complex implementation.

---

### Sprint Velocity (Based on Sprint 1)

- **Total Story Points:** 28
- **Team Members:** 4
- **Sprint Duration:** 1 week
- **Velocity per Team Member:** 7 story points

---
### Sprint Velocity 


To calculate sprint velocity, the team collaboratively assigned story points to each user story as shown below:

1. View a Tool Selection Box: 3 points
2. Select a Drawing Pen: 3 points
3. Select a Guest Account Option for Login: 3 points
4. Enter my name for my Guest Account: 1 points
5. Login as a Guest: 3 points
6. Select an Eraser: 3 points
7. View a Countdown Initiating the Game: 3 points
8. View a Countdown When Drawing: 3 points

Total story points: 22

Given that there are 8 user stories for the sprint and all 8 were completed, and with a team size of 4 members, the sprint velocity is calculated as follows:

Sprint Velocity = Total Story Points / Number of Team Members
               = 22 / 4
               ≈ 5.5 story points per team member

---

### Team Feedback

In addition to the insights provided above, the team has no further feedback to contribute at this stage of the project.

---


### Stakeholder Feedback

During our first stakeholder meeting on 02 May 2024, valuable insights were provided, highlighting areas for improvement:

- **User Identification in Lobby Sessions:** The stakeholder suggested implementing a feature to indicate which user is currently logged in during a lobby session. This enhancement would enhance clarity and facilitate smoother interactions within the game environment.

- **Password Field Management:** Feedback was given regarding the password fields on the Account Page screen, recommending the addition of separate hide/unhide buttons for each password field. Currently, a single button toggles visibility for both fields, potentially causing confusion. Implementing individual buttons would improve user experience and usability.