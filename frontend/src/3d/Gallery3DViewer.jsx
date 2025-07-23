import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Html } from '@react-three/drei'
import './Gallery3DViewer.css'

const cards = [
  { title: 'The Rising Sun', description: 'A bold sunrise over the mountains.' },
  { title: 'Silent Waters', description: 'A peaceful lake in the forest.' },
  { title: 'Urban Dreams', description: 'A night scene in a neon city.' }
]

function CameraController() {
  const { camera, gl } = useThree()
  const pitch = useRef(0)
  const yaw = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (document.pointerLockElement === gl.domElement) {
        yaw.current -= e.movementX * 0.002
        pitch.current -= e.movementY * 0.002
      }
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [gl])

  return <PointerLockControls />
}

export default function Gallery3DViewer() {
  return (
    <div className="gallery-container" onClick={() => document.body.requestPointerLock()}>
      <Canvas camera={{ position: [0, 1.6, 5], fov: 100 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Cards as 2D HTML elements in 3D */}
        {cards.map((card, index) => (
          <mesh key={index} position={[index * 3 - 3, 1.6, 0]}>
            <planeGeometry args={[2.2, 1.5]} />
            <meshBasicMaterial visible={false} />
            <Html center>
              <div className="card">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </div>
            </Html>
          </mesh>
        ))}

        <CameraController />
      </Canvas>
    </div>
  )
}
