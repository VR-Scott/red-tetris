import React from "react";

import Cell from "./Cell";
import { StyledStage, StyledEnemyStage } from "./styles/StyledStage";

const Stage = ({ stage, type = 0 }) => {
	if (type === 0)
		return (
			<StyledStage width={stage[0].length} height={stage.length}>
				{stage.map((row) =>
					row.map((cell, x) => <Cell key={x} type={cell[0]} />)
				)}
			</StyledStage>
		);
	else
		return (
			<StyledEnemyStage width={stage[0].length} height={stage.length}>
				{stage.map((row) =>
					row.map((cell, x) => <Cell key={x} type={cell[0]} />)
				)}
			</StyledEnemyStage>
		);
};

export default Stage;
