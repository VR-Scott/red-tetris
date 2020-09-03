import React from 'react';
import {Toolbar, Typography, AppBar, Button, IconButton,} from '@material-ui/core';

const TopBar = () => (
	<AppBar position="static">
		<Toolbar color="secondary">
			<IconButton edge="start" color="inherit" aria-label="menu">
			</IconButton>
			<Button color="inherit">Login</Button>
			<Typography>Red Tetris</Typography>
		</Toolbar>
	</AppBar>
);

export default TopBar;