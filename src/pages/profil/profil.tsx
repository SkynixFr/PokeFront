import { useRouter } from 'next/router';

const Profile = () => {
	const router = useRouter();
	return <h1>Profil : {router.query.name}</h1>;
};

export default Profile;
