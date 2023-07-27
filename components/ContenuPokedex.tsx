import React from 'react';

const ContenuPokedex = ({ todo }) => {
	console.log(todo);

	return (
		<div>
			<ul>
				<li>{todo.name} </li>
			</ul>
		</div>
	);
};

export default ContenuPokedex;
