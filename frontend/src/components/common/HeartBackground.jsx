import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeartBackground = () => {
	const ref = useRef();
	
	useEffect(() => {
		const container = ref.current;
		if (!container) return;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
		camera.position.set(0, 0, 8);

		const renderer = new THREE.WebGLRenderer({ 
			alpha: true, 
			antialias: true,
			powerPreference: "high-performance"
		});
		
		renderer.setSize(320, 320);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.shadowMap.enabled = false;
		container.appendChild(renderer.domElement);

		// Create a proper heart shape
		const heartShape = new THREE.Shape();
		const x = 0, y = 0;
		
		heartShape.moveTo(x + 0, y - 0.5);
		heartShape.bezierCurveTo(x + 0, y - 0.2, x - 0.3, y + 0.1, x - 0.6, y + 0.1);
		heartShape.bezierCurveTo(x - 1.2, y + 0.1, x - 1.2, y - 0.7, x - 1.2, y - 0.7);
		heartShape.bezierCurveTo(x - 1.2, y - 1.2, x - 0.7, y - 1.6, x + 0, y - 2.0);
		heartShape.bezierCurveTo(x + 0.7, y - 1.6, x + 1.2, y - 1.2, x + 1.2, y - 0.7);
		heartShape.bezierCurveTo(x + 1.2, y - 0.7, x + 1.2, y + 0.1, x + 0.6, y + 0.1);
		heartShape.bezierCurveTo(x + 0.3, y + 0.1, x + 0, y - 0.2, x + 0, y - 0.5);

		const extrudeSettings = {
			depth: 0.3,
			bevelEnabled: true,
			bevelThickness: 0.05,
			bevelSize: 0.05,
			bevelSegments: 3
		};

		const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
		geometry.center();

		const material = new THREE.MeshPhysicalMaterial({
			color: 0xff3b5c,
			metalness: 0.1,
			roughness: 0.3,
			reflectivity: 0.8,
			clearcoat: 0.8,
			clearcoatRoughness: 0.1,
			transmission: 0.1
		});

		const heart = new THREE.Mesh(geometry, material);
		heart.rotation.x = -0.2;
		heart.rotation.y = 0.1;
		heart.scale.set(2.5, 2.5, 2.5);
		heart.castShadow = false;
		heart.receiveShadow = false;
		scene.add(heart);

		// Enhanced lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
		directionalLight.position.set(5, 5, 5);
		// shadows disabled
		scene.add(directionalLight);

		const fillLight = new THREE.DirectionalLight(0xff758f, 0.3);
		fillLight.position.set(-5, -2, 3);
		scene.add(fillLight);

		const rimLight = new THREE.DirectionalLight(0x6366f1, 0.2);
		rimLight.position.set(0, -5, -5);
		scene.add(rimLight);

		// Animation
		const clock = new THREE.Clock();
		let rafId;
		let isPaused = false;

		const animate = () => {
			if (isPaused) { rafId = requestAnimationFrame(animate); return; }
			const elapsedTime = clock.getElapsedTime();
			// Subtle heartbeat effect (no vertical movement)
			const heartbeat = 1 + Math.sin(elapsedTime * 3) * 0.05;
			heart.scale.set(2.5 * heartbeat, 2.5 * heartbeat, 2.5 * heartbeat);
			// Gentle rotation
			heart.rotation.y = 0.1 + Math.sin(elapsedTime * 0.5) * 0.1;
			heart.rotation.x = -0.2 + Math.sin(elapsedTime * 0.3) * 0.05;
			renderer.render(scene, camera);
			rafId = requestAnimationFrame(animate);
		};

		rafId = requestAnimationFrame(animate);

		// Handle resize
		const handleResize = () => {
			const containerWidth = container.clientWidth;
			const containerHeight = container.clientHeight;
			const size = Math.min(containerWidth, containerHeight);
			
			renderer.setSize(size, size);
			camera.aspect = 1;
			camera.updateProjectionMatrix();
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		const onVisibilityChange = () => { isPaused = document.hidden; };
		document.addEventListener('visibilitychange', onVisibilityChange);
		let observer;
		if ('IntersectionObserver' in window) {
			observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => { isPaused = !entry.isIntersecting || document.hidden; });
			});
			observer.observe(container);
		}

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
			document.removeEventListener('visibilitychange', onVisibilityChange);
			if (observer) observer.disconnect();
			if (renderer.domElement && renderer.domElement.parentNode === container) {
				container.removeChild(renderer.domElement);
			}
			cancelAnimationFrame(rafId);
			renderer.dispose();
			geometry.dispose();
			material.dispose();
		};
	}, []);

	return (
		<div 
			ref={ref} 
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '300px',
				height: '300px',
				pointerEvents: 'none',
				opacity: 0.4,
				filter: 'blur(8px)',
				zIndex: 5
			}}
		/>
	);
};

export default HeartBackground;