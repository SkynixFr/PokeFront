import { FormEventHandler, useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface FormField {
	type: string;
	name: string;
	id: string;
	placeholder: string;
	label: string;
	required: boolean;
}

interface FormProps {
	fields: FormField[];
	labelButton: string;
	where: string;
}

const Form: React.FC<FormProps> = ({ fields, labelButton, where }) => {
	const [formData, setFormData] = useState<{ [key: string]: string }>({});
	const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
		{}
	);
	const [apiError, setApiError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const router = useRouter();

	function isValidEmail(email: string): boolean {
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailPattern.test(email);
	}

	function isValidPassword(password: string): boolean {
		const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,}$/;
		return passwordPattern.test(password);
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });

		const newFieldErrors: { [key: string]: string } = { ...fieldErrors };

		if (fields.find(field => field.name === name)?.required && !value) {
			newFieldErrors[name] = 'Ce champ est obligatoire.';
		} else if (name === 'email' && value && !isValidEmail(value)) {
			newFieldErrors[name] = 'Veuillez saisir une adresse email valide.';
		} else if (name === 'password' && value && !isValidPassword(value)) {
			newFieldErrors[name] =
				'Le mot de passe doit contenir au moins 8 caractères dont 1 majuscule, 1 caractère spécial et 1 chiffre.';
		} else {
			delete newFieldErrors[name];
		}

		setFieldErrors(newFieldErrors);
	}

	function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
		const { name, value } = event.target;

		if (fields.find(field => field.name === name)?.required && !value) {
			const newFieldErrors: { [key: string]: string } = { ...fieldErrors };
			newFieldErrors[name] = 'Ce champ est obligatoire.';
			setFieldErrors(newFieldErrors);
		}
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (formData.email?.length > 0) {
			if (formData.password !== formData.password2) {
				const newFieldErrors: { [key: string]: string } = {
					...fieldErrors
				};
				newFieldErrors['password'] =
					'Les mots de passe ne correspondent pas.';
				newFieldErrors['password2'] =
					'Les mots de passe ne correspondent pas.';
				setFieldErrors(newFieldErrors);
				return;
			}

			if (!isValidPassword(formData.password)) {
				const newFieldErrors: { [key: string]: string } = {
					...fieldErrors
				};
				newFieldErrors['password'] = 'Mauvais mot de passe.';

				setFieldErrors(newFieldErrors);
				return;
			}

			try {
				await axios.post('http://localhost:8080/api/v2/users/register', {
					username: formData.username,
					email: formData.email,
					password: formData.password
				});
				router.push(where);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					setApiError(error.response?.data);
				}
			}
		} else {
			try {
				const res = await axios.post(
					'http://localhost:8080/api/v2/users/login',
					{
						data: formData.data,
						password: formData.password
					}
				);
				const accessToken = res.data.accessToken;
				// Le cookies de l'accessToken expire dans 10 min max
				Cookies.set('accessToken', accessToken, {
					expires: 10 / (24 * 60)
				});
				const refreshToken = res.data.refreshToken;
				//le cookie du refreshToken s'expire dans 1 jour
				Cookies.set('refreshToken', refreshToken, {
					expires: 1
				});

				router.push(where);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					setApiError(error.response?.data);
				}
			}
		}
	}

	function handleShowPassword() {
		setShowPassword(prevShowPassword => !prevShowPassword);
	}
	function handleShowPassword2() {
		setShowPassword2(prevShowPassword2 => !prevShowPassword2);
	}

	return (
		<form className="form-fields" onSubmit={handleSubmit}>
			{fields.length === 0 ? (
				<div>Loading...</div>
			) : (
				fields.map(field => (
					<div className="form-field" key={field.id}>
						<div className="input-container">
							<label className="form-label" htmlFor={field.id}>
								{field.label}
							</label>
							<input
								type={
									(field.id === 'password' && showPassword) ||
									(field.id === 'password2' && showPassword2)
										? 'text'
										: field.type
								}
								name={field.name}
								id={field.id}
								placeholder={field.placeholder}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							{field.id === 'password' && (
								<div className="eye-icon" onClick={handleShowPassword}>
									{showPassword ? (
										<FaEye size={'1.5em'} />
									) : (
										<FaEyeSlash size={'1.5em'} />
									)}
								</div>
							)}
							{field.id === 'password2' && (
								<div className="eye-icon" onClick={handleShowPassword2}>
									{showPassword2 ? (
										<FaEye size={'1.5em'} />
									) : (
										<FaEyeSlash size={'1.5em'} />
									)}
								</div>
							)}
						</div>
						{fieldErrors[field.name] && (
							<div className="field-error">
								{fieldErrors[field.name]}
							</div>
						)}
					</div>
				))
			)}
			<div className="field-api-error">{apiError}</div>
			<button type="submit">{labelButton}</button>
		</form>
	);
};

export default Form;
