import Tetris from '../components/Tetris';
import React from 'react';

const TetrisPage = () => {
    let address = window.location.href
    let room = address.split('/')[3];
    let ip = "http:" + address.split(':')[1] + ":";
    return <div className="App">
        <Tetris room={room} ip={ip}/>
    </div>
}
export default TetrisPage