import Form from '../../components/form';
import Link from 'next/link';
import logo from '../../public/images/pokefront-logo.png';
import leaf from '../../public/images/leaf.png';
import Image from 'next/image';
import Cookies = require('js-cookie');
import snorlax from '../../public/images/snorlax.png';

interface FormField {
	type: string;
	name: string;
	id: string;
	placeholder: string;
	label: string;
	required: boolean;
}

const Login = () => {
	Cookies.remove('refreshToken');
	Cookies.remove('accessToken');
	const fields: FormField[] = [
		{
			type: 'text',
			name: 'data',
			id: 'data',
			placeholder: '',
			label: 'Pseudo',
			required: true
		},

		{
			type: 'password',
			name: 'password',
			id: 'password',
			label: 'Mot de passe',
			placeholder: '',
			required: true
		}
	];

	return (
		<section className="login">
			<div className="snorlax">
				<Image
					src={snorlax}
					alt="leaf"
					priority
					className="snorlax-image-leaf"
				/>
			</div>
			<div className="leaf">
				<Image src={leaf} alt="Leaf logo" priority></Image>
			</div>
			<div className="leaf">
				<Image src={leaf} alt="Leaf logo" priority></Image>
			</div>
			<div className="leaf">
				<Image src={leaf} alt="Leaf logo" priority></Image>
			</div>
			<div className="leaf">
				<Image src={leaf} alt="Leaf logo" priority></Image>
			</div>
			<div className="leaf">
				<Image src={leaf} alt="Leaf logo" priority></Image>
			</div>
			<div className="leaf">
				<Image src={leaf} alt="Leaf logo" priority></Image>
			</div>
			<div className="leaf">
				<Image src={leaf} alt="Leaf logo" priority></Image>
			</div>
			<div className="leaf">
				<Image src={leaf} alt="Leaf logo" priority></Image>
			</div>
			<div className="login-logo">
				<Image src={logo} alt="Pokéfront logo" priority></Image>
			</div>
			<div className="form-card">
				<div className="form-title">
					<h1>Connexion</h1>
				</div>
				<Form
					fields={fields}
					labelButton={'Connexion'}
					where={'/pokedex'}
				></Form>
				<div className="form-links">
					<span>Pas encore de compte ?</span>
					<Link href="/register">Créer un compte</Link>
				</div>
			</div>
		</section>
	);
};

export default Login;
