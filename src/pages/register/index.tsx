import Form from '../../components/form';
import Image from 'next/image';
import logo from '../../public/images/pokefront-logo.png';
import pokeball from '../../public/images/pokeball.png';
import Link from 'next/link';

interface FormField {
	type: string;
	name: string;
	id: string;
	placeholder: string;
	label: string;
	required: boolean;
}

const Register = () => {
	const fields: FormField[] = [
		{
			type: 'text',
			name: 'username',
			id: 'username',
			placeholder: '',
			label: 'Pseudo',
			required: true
		},
		{
			type: 'email',
			name: 'email',
			id: 'email',
			placeholder: 'email@exemple.com',
			label: 'Email',
			required: true
		},
		{
			type: 'password',
			name: 'password',
			id: 'password',
			placeholder: '',
			label: 'Mot de passe',
			required: true
		},
		{
			type: 'password',
			name: 'password2',
			id: 'password2',
			label: 'Confirmer le mot de passe',
			placeholder: '',
			required: true
		}
	];

	return (
		<section className="register">
			<div className="pokeball">
				<Image src={pokeball} alt="Pokeball logo" priority></Image>
			</div>
			<div className="pokeball">
				<Image src={pokeball} alt="Pokeball logo" priority></Image>
			</div>
			<div className="pokeball">
				<Image src={pokeball} alt="Pokeball logo" priority></Image>
			</div>
			<div className="pokeball">
				<Image src={pokeball} alt="Pokeball logo" priority></Image>
			</div>
			<div className="pokeball">
				<Image src={pokeball} alt="Pokeball logo" priority></Image>
			</div>
			<div className="pokeball">
				<Image src={pokeball} alt="Pokeball logo" priority></Image>
			</div>
			<div className="pokeball">
				<Image src={pokeball} alt="Pokeball logo" priority></Image>
			</div>
			<div className="pokeball">
				<Image src={pokeball} alt="Pokeball logo" priority></Image>
			</div>

			<div className="register-logo">
				<Image src={logo} alt="Pokéfront logo" priority></Image>
			</div>
			<div className="form-card">
				<div className="form-title">
					<h1>Inscription</h1>
				</div>
				<Form
					fields={fields}
					labelButton={'Créer son compte'}
					where={'/login'}
				></Form>
				<div className="form-links">
					<span>Déjà un compte ?</span>
					<Link href="/login">Se connecter</Link>
				</div>
			</div>
		</section>
	);
};

export default Register;
