import Link from 'next/link';
import Image from 'next/image';
import pokefrontLogo from '../public/images/pokefront-logo-reduit.png';
import pokedex from '../public/images/pokedex-icon.png';
import trainer from '../public/images/pokemon-trainer-icon.png';
import logout from '../public/images/logout-icon.png';
import { useRouter } from 'next/router';

const Header = () => {
	const router = useRouter();

	function handleLogout() {
		router.push('/login');
	}

	return (
		<header className="header">
			<div className="header-infos">
				<div className="header-logo">
					<Image src={pokefrontLogo} alt="Pokefront logo" priority></Image>
				</div>
				<ul className="header-links">
					<li className="header-link pokedex-icon">
						<Link href="/pokedex">
							<Image src={pokedex} alt="Pokedex" priority></Image>
							<span className="tooltip">Pokedex</span>
						</Link>
					</li>
					<li className="header-link trainer-icon">
						<Link href="/user/me">
							<Image src={trainer} alt="Trainer" priority></Image>
							<span className="tooltip">Profil</span>
						</Link>
					</li>
				</ul>
				<div className="header-logout" onClick={handleLogout}>
					<Image src={logout} alt="Logout" priority></Image>
					<span className="tooltip">Se déconnecter</span>
				</div>
			</div>
		</header>
	);
};

export default Header;
