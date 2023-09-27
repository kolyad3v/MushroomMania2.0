/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { Player } from './Player' // Importing the Player component to control the character.
import { useMouseCapture } from './hooks/useMouseCapture' // Importing the hook for mouse input.
import { useKeyboard } from './hooks/useKeyboard' // Import

type GLTFResult = GLTF & {
	nodes: {
		ground: THREE.Mesh
		smallRocks: THREE.Mesh
	}
	materials: {}
}

export function Terrain(props: JSX.IntrinsicElements['group']) {
	const { nodes } = useGLTF('/models/map1.glb') as GLTFResult
	const bakedTexture = useLoader(
		THREE.TextureLoader,
		'./textures/bakes/bakedScene.jpg'
	)
	const bakedRocksTexture = useLoader(
		THREE.TextureLoader,
		'./textures/bakes/bakedSmallRocks.jpg'
	)
	const angleToRadians = (angleInDeg: number) => (Math.PI / 180) * angleInDeg

	const data: {
		position: [x: number, y: number, z: number]
		rotation: [x: number, y: number, z: number]
	}[] = [
		{
			position: [0, 0, -50],
			rotation: [0, 0, 0],
		},
		{
			position: [0, 0, 50],
			rotation: [0, 0, 0],
		},
		{
			position: [50, 0, 0],
			rotation: [0, angleToRadians(90), 0],
		},
		{
			position: [-50, 0, 0],
			rotation: [0, angleToRadians(-90), 0],
		},
	]

	function getInput(
		keyboard: { [x: string]: any },
		mouse: { x: number; y: number }
	) {
		let [x, y, z] = [0, 0, 0]
		// Checking keyboard inputs to determine movement direction
		if (keyboard['s']) z += 1.0 // Move backward
		if (keyboard['w']) z -= 1.0 // Move forward
		if (keyboard['d']) x += 1.0 // Move right
		if (keyboard['a']) x -= 1.0 // Move left
		if (keyboard[' ']) y += 1.0 // Jump

		// Returning an object with the movement and look direction
		return {
			move: [x, y, z],
			look: [mouse.x / window.innerWidth - 3, mouse.y / window.innerHeight + 0.2], // Mouse look direction
			running: keyboard['Shift'], // Boolean to determine if the player is running (Shift key pressed)
		}
	}

	const keyboard = useKeyboard() // Hook to get keyboard input
	const mouse = useMouseCapture() // Hook to get mouse input

	return (
		<>
			<Player
				walk={2}
				jump={5}
				input={() => getInput(keyboard, mouse)}
			/>
			<group
				{...props}
				dispose={null}
			>
				{/* Walls  */}
				{data.map((item, index) => (
					<RigidBody
						key={index}
						colliders='cuboid' // Type of collider shape for the wall (a cuboid in this case)
						lockTranslations // Lock translations to prevent movement during physics simulation
						lockRotations // Lock rotations to prevent unwanted rotations during physics simulation
						position={item.position} // Position of the wall in 3D space
						rotation={item.rotation} // Rotation of the wall in 3D space
					>
						<mesh>
							<planeGeometry args={[100, 5]} />
							<meshBasicMaterial
								transparent={true}
								opacity={0}
							/>
						</mesh>
					</RigidBody>
				))}

				<RigidBody
					colliders='cuboid' // Type of collider shape for the ground (a cuboid in this case)
					lockTranslations={true} // Lock translations to prevent movement during physics simulation
					lockRotations // Lock rotations to prevent unwanted rotations during physics simulation
					position={[0, 0, 0]} // Position of the ground in 3D space
					rotation={[angleToRadians(-90), 0, 0]} // Rotation of the ground in 3D space
				>
					<mesh>
						<planeGeometry args={[100, 100]} />
					</mesh>
				</RigidBody>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.smallRocks.geometry}
					material={nodes.smallRocks.material}
					position={[-28.062, -0.182, -9.787]}
					rotation={[-2.649, -0.897, 1.817]}
					scale={0.131}
				>
					<meshBasicMaterial
						map={bakedRocksTexture}
						map-flipY={false}
					/>
				</mesh>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.ground.geometry}
					material={nodes.ground.material}
					rotation={[0, 0, 0]}
					position={[0, -3, 0]}
				></mesh>
			</group>
		</>
	)
}

useGLTF.preload('models/map1.glb')
