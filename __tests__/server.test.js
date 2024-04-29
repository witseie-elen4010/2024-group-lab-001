const { Server } = require("socket.io");
const ioClient = require("socket.io-client");

describe("Socket.IO Server Tests", () => {
  let ioServer, serverSocket, clientSocket;

  // Setup
  beforeAll((done) => {
    // Start the server
    const httpServer = require("http").createServer();

    // Pass the http server instance to the socket.io server
    ioServer = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;

      // Connect the client to the server 
      clientSocket = ioClient.connect(`http://localhost:${port}`);

      // Emit an event from the client to the server
      ioServer.on("connection", (socket) => {
        serverSocket = socket;
      });

      // Callback to indicate that the setup is done
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    ioServer.close();
    clientSocket.disconnect();
  });

  test("Player disconnect", (done) => {
    clientSocket.disconnect();
    serverSocket.on("disconnect", () => {
      expect(serverSocket.roomId).toBeUndefined(); // Player should not be in any room
      done();
    });
  });
});