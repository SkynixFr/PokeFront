// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import pikachuVolant from '../public/images/pikachu_volant.png';

// const MouseFollower: React.FC = () => {
// 	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
// 	const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

// 	useEffect(() => {
// 		const handleMouseMove = (event: MouseEvent) => {
// 			setMousePosition({ x: event.clientX, y: event.clientY });
// 		};

// 		window.addEventListener('mousemove', handleMouseMove);

// 		return () => {
// 			window.removeEventListener('mousemove', handleMouseMove);
// 		};
// 	}, []);

// 	useEffect(() => {
// 		let requestId: number;
// 		let prevTime = performance.now();
// 		let prevMousePosition = { x: 0, y: 0 };

// 		const updatePosition = (currentTime: number) => {
// 			prevTime = currentTime;

// 			const targetX = mousePosition.x; // Offset to center the image
// 			const targetY = mousePosition.y; // Offset to center the image

// 			const deltaX = (targetX - imagePosition.x) * 0.2; // 0.1 is the smoothness factor, you can adjust it
// 			const deltaY = (targetY - imagePosition.y) * 0.2; // 0.1 is the smoothness factor, you can adjust it

// 			// Check if mouse has stopped moving
// 			const distanceMoved = Math.sqrt(
// 				Math.pow(mousePosition.x - prevMousePosition.x, 2) +
// 					Math.pow(mousePosition.y - prevMousePosition.y, 2)
// 			);

// 			prevMousePosition = mousePosition;

// 			if (distanceMoved < 1) {
// 				cancelAnimationFrame(requestId);
// 				return;
// 			}

// 			setImagePosition(prevPosition => ({
// 				x: prevPosition.x + deltaX,
// 				y: prevPosition.y + deltaY
// 			}));

// 			requestId = requestAnimationFrame(updatePosition);
// 		};

// 		requestId = requestAnimationFrame(updatePosition);

// 		return () => {
// 			cancelAnimationFrame(requestId);
// 		};
// 	}, [mousePosition]);

// 	return (
// 		<div
// 			className="mouse-follower"
// 			style={{ left: imagePosition.x, top: imagePosition.y }}
// 		>
// 			<Image src={pikachuVolant} alt="Pikachu volant" priority />
// 		</div>
// 	);
// };

// export default MouseFollower;
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
			const smoothnessFactor = 0.01; // Adjust this value to change the delay duration

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
