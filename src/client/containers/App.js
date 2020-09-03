// const App = () => (
//   <div className="App">
//     <Tetris />
//   </div>
// );

import React from 'react';
import {
	BrowserRouter as Router,
	Route,
} from "react-router-dom";
import TetrisPage from '../pages/TetrisPage';

const App = () => {

	return (
		<Router>
			<Route path="/:room?" component={TetrisPage} />
		</Router>
	)
};

export default App;