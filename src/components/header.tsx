import Link from 'next/link';
import Image from 'next/image';
import pokefrontLogo from '../public/images/pokefront-logo-reduit.png';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import pokedex from '../public/images/pokedex.png';
import maleTrainer from '../public/images/trainer-ash.png';

const Header = () => {
	return (
		<header className="header">
			<div className="header-logo">
				<Image src={pokefrontLogo} alt="Pokefront logo" priority></Image>
			</div>
			<ul className="header-links">
				<li className="header-link pokedex">
					<Link href="/pokedex">
						<Image src={pokedex} alt="Pokedex" priority></Image>
						<span className="tooltip">Pokedex</span>
					</Link>
				</li>
				<li className="header-link trainer">
					<Link href="/user/me">
						<Image src={maleTrainer} alt="Male trainer" priority></Image>
						<span className="tooltip">Profil</span>
					</Link>
				</li>
			</ul>
			<div className="header-logout">
				<FaArrowRightFromBracket />
				<span className="logout">Profil</span>
			</div>
		</header>
	);
};

export default Header;
