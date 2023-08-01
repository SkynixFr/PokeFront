import React, { useRef, useEffect } from 'react';
import { Vector2 } from 'three';
import Image from 'next/image';
import pikachuVolant from '../public/images/pikachu_volant.png';

const MouseFollower: React.FC = () => {
	const imageRef = useRef<HTMLImageElement>(null);
	const mousePosition = useRef(new Vector2(0, 0));
	const targetPosition = useRef(new Vector2(0, 0));

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			mousePosition.current.set(event.clientX, event.clientY);
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	useEffect(() => {
		const imageElement = imageRef.current;
		if (!imageElement) return;

		const updateImagePosition = () => {
			const smoothnessFactor = 0.01;

			targetPosition.current.lerp(mousePosition.current, smoothnessFactor);
			imageElement.style.transform = `translate(${targetPosition.current.x}px, ${targetPosition.current.y}px)`;

			requestAnimationFrame(updateImagePosition);
		};

		requestAnimationFrame(updateImagePosition);
	}, []);

	return (
		<div className="mouse-follower">
			<Image
				ref={imageRef}
				src={pikachuVolant}
				alt="Pikachu volant"
				priority
			/>
		</div>
	);
};

export default MouseFollower;
