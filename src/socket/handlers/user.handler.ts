import { Server, Socket } from "socket.io";
import PresentationService from "../../modules/presentation/presentation.service";

type Role = "author" | "viewer" | "editor";

interface UserInfo {
  socketId: string;
  nickname: string;
  role: Role;
}

interface JoinProps {
  pptId: string;
  nickname: string;
  role: Role;
  authorToken: string | undefined;
}

const rooms = new Map<string, Map<string, UserInfo>>();

async function verifyAuthor(socket: Socket, newUser: JoinProps) {
  const { pptId, role, authorToken } = newUser;
  const presentationService = PresentationService.getInstance();
  let finalRole = role;

  if (role === "author" && authorToken) {
    try {
      const result = await presentationService.isAuthor(authorToken, pptId);
      if (!result.success || !result.data) {
        finalRole = "viewer";
        console.log(
          `User claimed to be author but verification failed, downgraded to viewer: ${socket.id}`
        );
      }
    } catch (error) {
      finalRole = "viewer";
      console.log(
        `Error during author verification, defaulting to viewer: ${socket.id}`,
        error
      );
    }
  } else if (role === "author" && !authorToken) {
    finalRole = "viewer";
    console.log(
      `User claimed to be author but no token provided, defaulted to viewer: ${socket.id}`
    );
  }

  return finalRole;
}

export function userHandler(io: Server, socket: Socket) {
  socket.on("join-ppt", async (newUser: JoinProps) => {
    const { pptId, nickname } = newUser;
    const roomId = `ppt-${pptId}`;
    let finalRole = await verifyAuthor(socket, newUser);

    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const users = rooms.get(roomId);
    if (!users) {
      console.log("There is no room with this Id");
      return;
    }

    users.set(socket.id, { socketId: socket.id, nickname, role: finalRole });

    io.to(roomId).emit("new-user-joined", {
      users: Array.from(users.values()),
    });
  });

  socket.on("leave-ppt", (pptId: string) => {
    const roomId = `ppt-${pptId}`;

    const users = rooms.get(roomId);
    if (users) {
      const leavingUser = users.get(socket.id);
      users.delete(socket.id);

      if (users.size === 0) {
        rooms.delete(roomId);
      }

      socket.leave(roomId);

      if (leavingUser) {
        io.to(roomId).emit("user-left", {
          users: Array.from(users.values()),
        });
      }
    }
  });

  socket.on("disconnect", () => {
    for (const [roomId, users] of rooms.entries()) {
      if (users.has(socket.id)) {
        const leavingUser = users.get(socket.id);
        users.delete(socket.id);

        if (users.size === 0) {
          rooms.delete(roomId);
        }

        if (leavingUser) {
          io.to(roomId).emit("user-left", {
            users: Array.from(users.values()),
            leftUser: leavingUser,
          });
        }
      }
    }
  });
}
