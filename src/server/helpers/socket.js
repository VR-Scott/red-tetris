const { Session } = require("../models/Session");

//create an instance of socket io
exports.makeSocket = (io) => {
	const generateShapes = require("./PieceHelpers");
	let users = [];
	const Player = require("../models/Player").Player;
	io.on("connection", function (socket) {
		let room = new Session().room;
		let p_name = null;
		socket.emit("connection");
		socket.on("action", (action) => {
			if (action.type === "server/ping") {
				socket.emit("action", { type: "pong" });
			}
		});
		//upon receiving the join message from a client -> give player a random name , join them to existing session created by host (1st person to join is host)
		socket.on("join", (r) => {
			let temp = r.split("[");
			room = temp[0][0] == "#" ? temp[0].substr(1) : temp[0];
			p_name = temp[1] ? temp[1].substr(0, temp[1].length - 1) : "Bobbers" + Math.ceil(Math.random() * 12);
			socket.join(room);
			let what = new Player(socket.id, p_name, room);
			users.push(what);
			what = null;
			io.to(room).emit(
				"update_users",
				users.filter((e) => e.room == room)
			);
		});
		socket.on("update_player", (p) => {
			users = users.map((e) => {
				if (e.id === socket.id) e.arena = [...p];
				return e;
			});
			io.to(room).emit(
				"update_users",
				users.filter((e) => e.room == room)
			);
		});
		socket.on("clearRow", () => {
			socket.to(room).emit("penalty_row");
		});
		socket.on("lose", (id) => {
			socket.to(room).emit("dc_player", id);
		});
		//last player standing send "winner" message
		socket.on("winner", (winner) => {
			socket.nsp.to(room).emit("set_player_winner", winner.p_name);
		});
		socket.on("end_game", () => {
			io.of("/")
				.in(room)
				.clients(function (error, clients) {
					if (clients.length - 2 == 0)
						socket.to(Object.keys(socket.rooms)[0]).emit("end_game");
				});
		});
		//array of shapes sent to each client upon receiving message from client/s 
		socket.on("create_tetrominos", (room) => {
			io.to(room).emit("create_tetrominos", generateShapes());
		});
		//once 1st player/host starts game - server waiting for "start" message
		socket.on("start?", (r) => {
			io.to(r).emit("start_game", r);
		});
		socket.on("disconnect", () => {
			users.splice(
				users.findIndex((e) => e.id == socket.id && e.room == room),
				1
			);
			socket.to(room).emit("dc_player", socket.id);
		});
	});
};