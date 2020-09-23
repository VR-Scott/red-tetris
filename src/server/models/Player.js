class Player {
	//create Player Obj with room, player name, tetris board properties
	constructor(id, p_name, room) {
		this.id = id;
		this.p_name = p_name;
		this.arena = null;
		this.room = room;
	}
}

module.exports.Player = Player