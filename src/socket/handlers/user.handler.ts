import { Server, Socket } from "socket.io";

interface UserInfo {
  socketId: string;
  nickname: string;
}

const rooms = new Map<string, Map<string, UserInfo>>();

export function userHandler(io: Server, socket: Socket) {
  socket.on("join-ppt", (pptId: string, nickname: string) => {
    const roomId = `ppt-${pptId}`;

    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const users = rooms.get(roomId);
    if (!users) {
      console.log("There is no room with this Id");
      return;
    }

    users.set(socket.id, { socketId: socket.id, nickname });

    io.to(roomId).emit("new-user-joined", {
      users: Array.from(users.values()),
      joinedUser: { socketId: socket.id, nickname },
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
          leftUser: leavingUser,
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
