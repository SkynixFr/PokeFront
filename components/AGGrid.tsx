import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const App = () => {
	const [rowData] = useState([
		{ Nom: 'Toyota', Type: 'Celica', PV: 35000 },
		{ Nom: 'Ford', Type: 'Mondeo', PV: 32000 },
		{ Nom: 'Porsche', Type: 'Boxster', PV: 72000 }
	]);

	const [columnDefs] = useState([
		{ field: 'Nom' },
		{ field: 'Type' },
		{ field: 'PV' }
	]);

	return (
		<div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
			<AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
		</div>
	);
};

export default App;
