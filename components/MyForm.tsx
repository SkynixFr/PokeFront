import { useState, useEffect } from 'react';

const MyForm = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	const onSubmit = () => {
		alert(`Rechercher de ${name} ${email}`);
	};

	return (
		<form>
			<input value={name} onChange={e => setName(e.target.value)} />
			<input value={email} onChange={e => setEmail(e.target.value)} />
			<button onClick={onSubmit}>Rechercher</button>
		</form>
	);
};

export default MyForm;
