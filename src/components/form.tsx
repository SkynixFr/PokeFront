import React, { useState, FormEvent, ReactNode } from 'react';
import ReactLoading from 'react-loading';

export interface FormField {
	name: string;
	label: string;
	type: string;
}

interface FormProps {
	fields: FormField[]; // Tableau des champs du formulaire
	onSubmit: (data: { [key: string]: string }) => void; // Fonction de soumission du formulaire
	isLoading: boolean;
	children?: ReactNode; // Propriété enfants optionnelle
	submitButtonLabel: string; // Nouvelle prop pour le texte personnalisé du bouton de soumission
}

const Form: React.FC<FormProps> = ({
	fields,
	onSubmit,
	isLoading,
	children,
	submitButtonLabel // Utiliser la nouvelle prop pour le texte personnalisé du bouton de soumission
}) => {
	const [formData, setFormData] = useState<{ [key: string]: string }>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			{fields.map(field => (
				<div key={field.name}>
					<label htmlFor={field.name}>{field.label}</label>
					<input
						id={field.name}
						type={field.type}
						name={field.name}
						value={formData[field.name] || ''}
						onChange={handleChange}
					/>
				</div>
			))}
			<button type="submit" disabled={isLoading}>
				{isLoading ? (
					<ReactLoading
						type="spin"
						color="#ffffff"
						height={20}
						width={20}
					/>
				) : (
					submitButtonLabel // Utiliser la nouvelle prop pour afficher le texte du bouton de soumission personnalisé
				)}
			</button>
			{children}
		</form>
	);
};

export default Form;
