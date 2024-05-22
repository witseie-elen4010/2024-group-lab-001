# Architecture Decision Record
---
## 1. Firebase
---
### 1.1 Context

The application requires a robust and scalable backend solution for storing user data and application data. Additionally, a secure and user-friendly user authentication system is necessary. The authentication must be secure -- user passwords should be hashed. We considered several options for the backend, including self-hosting a database and implementing a custom user authentication system. However, these options would require significant development and maintenance effort.

### 1.2 Solution

We propose using Firebase as the backend solution for the following reasons:
- Ease of Use: Firebase offers a wide range of features that can be easily integrated into our application.
- Scalability: Firebase can automatically scale to meet the needs of our application as it grows.
- Security: Firebase provides built-in security features to protect user data and prevent unauthorized access. Hashing of passwords is automatic.
- Reliability: Firebase is a Google-backed service with a high degree of uptime and reliability. The libraries are maintained and documented.
- Cost-Effectiveness: Firebase offers a free tier with generous limits, and pay-as-you-go pricing for higher usage.
- File Sizes: Only functions that will be used need to be imported, rather than the entire library, allowing for decreased file sizes.

### 1.3 Consequences

- Vendor Lock-in: By using Firebase, we become somewhat reliant on Google's cloud platform. However, Firebase offers a well-documented API and a variety of data export options, which would mitigate the impact of switching to another platform in the future, if necessary.
- Cost: Firebase has a free tier with generous limits, but exceeding those limits will incur costs. We will need to ensure we do not exceed the limits of the free plan.
- Limitations: As developers, we are limited to the featureset offered by Firebase.
- Complexity: Integrating an external service requires us to hide certain variables such as API keys. Testing will be difficult as the sourcecode of Firebase is not available.
---
## 2. Socket.io
---
### 2.1 Context

 The game we are developing relies heavily on players receiving information and updates instantly. Socket.IO facilitates this by enabling a persistent two-way connection between the server and all connected clients. This allows for:
- Sending the player's drawing to other participants as they draw.
- Broadcasting the revealed word or phrase to everyone simultaneously.
- Updating the game state (for example: whose turn it is) for all players in real-time.

### 2.2 Solution
We propose evaluating Socket.IO as a real-time communication solution for the following reasons:

- Real-time Communication: Socket.IO enables low-latency, bidirectional communication between the server and client, allowing for real-time updates.
- Ease of Use: Socket.IO offers a relatively simple API for both server-side and client-side integration.
- Scalability: Socket.IO can handle a large number of concurrent connections making it suitable for applications with many users.
- 
### 2.3 Consequences

- Complexity: Introducing Socket.IO adds another layer of complexity to the application architecture. Debugging and maintaining real-time communication can be challenging as new socket instances are created when refreshing or redirecting to a different page.
- Security: Since Socket.IO establishes a persistent connection, security considerations are crucial. Proper authentication and authorization mechanisms need to be implemented to prevent unauthorized access.
- Performance Considerations: Sending large amounts of data through real-time connections can impact performance. Careful message design and optimization are necessary.

## 3. Express-Session
---
### 3.1 Context

For managing user sessions and ensuring secure handling of user data within the application, a robust session management solution is required. Session management is crucial for maintaining user state across multiple requests and ensuring a seamless user experience. We considered several options, including custom session management solutions and other third-party libraries. However, these options either lacked comprehensive support or required extensive implementation effort.

### 3.2 Solution

We propose using `express-session` as the session management solution for the following reasons:

- **Ease of Integration:** `express-session` integrates seamlessly with Express, the web framework used in our application. This allows for quick and straightforward implementation.
- **Session Storage:** `express-session` supports various session storage options, including in-memory storage for development and scalable solutions like Redis or MongoDB for production.
- **Security:** `express-session` offers built-in security features such as session ID rotation, secure cookies, and support for HTTPS to protect against common web vulnerabilities.
- **Customization:** The library provides extensive configuration options, allowing us to tailor session management to meet our specific requirements, such as setting session expiration times and controlling cookie properties.
- **Community Support:** `express-session` is widely used and well-documented, with active community support and regular updates, ensuring long-term reliability.

### 3.3 Consequences

- **Memory Usage:** Using in-memory session storage can lead to increased memory usage on the server. For production environments, using a more scalable solution like Redis is recommended to mitigate this issue.
- **Configuration Complexity:** Properly configuring session management to balance security and performance can be complex. Ensuring that session cookies are secure, HTTP-only, and have appropriate expiration settings requires careful consideration.
- **Scalability:** While `express-session` is suitable for initial deployment, high-traffic applications may require distributed session storage solutions to handle the increased load effectively.
- **Security Considerations:** Storing sensitive session data requires robust security practices to prevent unauthorized access and session hijacking. Implementing HTTPS and regularly rotating session keys are necessary measures.

---
### References
---
[1] J.P. Henderson,  "architecture-decision-record," GitHub, Oct. 18, 2023. Availabe: https://github.com/joelparkerhenderson/architecture-decision-record/tree/main/locales/en/templates/decision-record-template-for-alexandrian-pattern (accessed Apr. 29, 2024).

[2] “Express cookie-session middleware,” expressjs.com. https://expressjs.com/en/resources/middleware/cookie-session.html (accessed May. 22, 2024).
