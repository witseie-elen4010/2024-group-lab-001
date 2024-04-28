# Code Review Conventions

1. **Purpose of Code Reviews**:
   - Maintaining a high standard of code quality. 
   - Early identification of any potential issues.
   - Promotes collaboration between project team members.
   - Ensure compliance with code and committing conventions. 

2. **Roles and Responsibilities**:
   - Authors: Responsible for submitting high-quality code and actively participating in the review process. When submitting code review must include a concise 
     comment about the implemented changes and any issues experienced that may need to be resolved in the future. 
   - Reviewers: Responsible for providing constructive feedback, identifying potential improvements, and ensuring adherence to coding and committing standards. Must prepare by obtaining an understanding of the relevant 
     parts of the codebase and ensure the review is manageable.

3. **Timing and Process**:
   - Pull requests should be reviewed promptly to facilitate timely feedback and code integration.
   - Reviewers should aim to complete their reviews within a specified timeframe, considering the size and complexity of the changes.
   - Reviewers must promptly ask for assistance if a review cannot be done in a timely manner. 

4. **Scope of Reviews**:
   - Reviewers should focus on the correctness, clarity, maintainability, and performance of the code.
   - Reviews should consider alignment with project goals, coding standards, committing standards, and architectural principles.
   - Reviewers should ensure the code is sufficiently addressing the user story. 

5. **Review Checklist**:
   - Use a checklist of common issues to ensure thorough and consistent reviews.
   - Include items such as code formatting, committing formatting, pull request formatting, error handling, documentation, and security considerations.

6. **Feedback Guidelines**:
   - Provide specific, actionable feedback, referencing relevant lines of code or sections.
   - Offer suggestions for improvement rather than just pointing out problems.
   - Do not phrase feedback in a manner that attacks an individual rather provide constructive criticism.
   - Prioritize feedback based on severity and impact on code quality.
   - Address specific user stories or features mentioned in pull requests to ensure alignment with project goals.
   - Be concise when providing feedback and specific when referring to potential issues with the submitted code. 
   - Include praise if good coding practices are utilized. 

7. **Communication and Collaboration**:
   - Engage in constructive dialogue with the author to discuss feedback and potential solutions.
   - Encourage open communication, mutual respect, and a willingness to learn from each other.

8. **Documentation and Context**:
   - Ensure that pull requests include sufficient documentation and context to aid reviewers in understanding the changes.
   - Ensure commit messages are concise and fully encompass the changes made to the codebase in each commit. 
   - Provide background information, references to relevant issues or requirements, and explanations of design decisions.

9. **Acceptance Criteria and Merging**:
    - Ensure that all acceptance criteria are met before approving a pull request for merging.
    - Acceptance criteria can be defined by the clarity, efficiency, maintainability of the code, thorough testing, and compliance with coding and committing guidelines. 
    - Avoid merging code that does not meet quality standards or has outstanding issues.
    - Note any skipped tests or issues encountered during review for transparency and follow-up.

10. **Continuous Improvement**:
    - Reflect on the review process regularly and identify opportunities for improvement.
    - Encourage feedback from team members to refine the review process and foster a culture of continuous improvement.
    - If a significant issue is identified note it down and make a plan to address the issue in the future. 
    - Aims to resolve any discussions and if a disagreement persists involve necessary parties to resolve the disagreement.

11. **Example Review Feedback**:
Code reviews should be structured in a similar manner to the outlined template below: 

### Pull Request Submission:

#### Comment:
This pull request addresses User Story XX, [Concise description of what feature was focused on and functionality achieved]. [Add any additional notes such as certain known issues. An example would be
a reason for a certain test case not passing or any additional information deemed necessary]. 

**Note:** Please review the changes and provide any feedback or suggestions for improvement. [Outline any possible areas of concern]. 

### Review:

#### Comment:
Concise comment addressing if the code and commits sufficiently follow required conventions. 

### References

[1] M. Mignonsin, “mawrkus/pull-request-review-guide,” GitHub, Apr. 26, 2024. https://github.com/mawrkus/pull-request-review-guide (accessed Apr. 28, 2024).
