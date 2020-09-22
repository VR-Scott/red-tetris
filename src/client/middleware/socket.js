import io from "socket.io-client";

export let mainSocket = null;
export const userSocket = (room, ip) => {
  return new Promise((resolve) => {
    if (mainSocket?.connected === false || !mainSocket) {
      mainSocket = io.connect(ip + "2000");
      mainSocket.on("connection", () => {
        mainSocket.emit("join", room);
        resolve(mainSocket);
      });
    } else resolve(mainSocket);
  });
};

export const socketOn = (socket,event, cb) =>{
    socket.on(event, cb)
}
export const socketOff = (socket,event) =>{
    socket.off(event)
}
export const socketEmit = (socket,event, params = []) =>{
    socket.emit(event, params)
}