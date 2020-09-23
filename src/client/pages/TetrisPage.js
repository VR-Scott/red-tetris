import Tetris from '../components/Tetris';
import React from 'react';

const TetrisPage = () => {
    let address = window.location.href
    // address = urls put in browser
    let room = address.split('/')[3];
    // room will be the part that contains the room and player name.
    let ip = "http:" + address.split(':')[1] + ":";
    // ip will be either localhost or the LAN IP of the computer to connect to.
    return <div className="App">
        <Tetris room={room} ip={ip}/>
    </div>
}
export default TetrisPage