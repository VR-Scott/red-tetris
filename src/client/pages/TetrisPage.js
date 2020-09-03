import Tetris from '../components/Tetris';
import React from 'react';

const TetrisPage = () => {
    let room = window.location.href.split('/')[3];
    return <div className="App">
        <Tetris room={room} />
    </div>
}
export default TetrisPage