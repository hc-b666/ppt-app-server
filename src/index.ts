import { createServer } from "http";
import { createApp } from "./app";
import { createSocketServer } from "./socket";

const app = createApp();
const httpServer = createServer(app);
const io = createSocketServer(httpServer);

const PORT = 3000;

io.listen(PORT);
