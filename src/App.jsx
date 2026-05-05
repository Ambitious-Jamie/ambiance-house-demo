import { Suspense, useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Html, Bounds, Environment } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = '/new_york_townhouse__1.glb'

useGLTF.preload(MODEL_URL)

const STOPS = [
  {
    id: 'overview',
    label: 'Overview',
    category: null,
    title: 'Ambiance Townhouse',
    description: 'Click a product below to explore the windows and doors in context.',
    camera: { position: [-18.79, 7.74, 20.95], target: [0.24, 2.82, 1.22] },
  },
  {
    id: 'front-door',
    label: 'Entry Door',
    category: 'Entry door',
    title: 'Heritage Front Door',
    description:
      'Solid uPVC entry door with brushed hardware, multipoint locking and a weather-sealed threshold for year-round comfort.',
    camera: { position: [-4.21, 1.43, 5.54], target: [0.89, 1.4, 0.45] },
  },
  {
    id: 'french-doors',
    label: 'French Doors',
    category: 'French doors',
    title: 'French Doors',
    description:
      'Triple-glazed sash window with low-e coating and traditional muntin profile — designed to keep heat in and noise out.',
    camera: { position: [0.36, 1.5, 1.91], target: [-0.06, 1.46, 0.65] },
  },
  {
    id: 'upper-window',
    label: 'Bedroom Window',
    category: 'Sash window',
    title: 'Bedroom Sash Window',
    description:
      'Double-hung tilt-wash window with argon-filled IGU and custom interior trim, balancing classic looks with modern thermal performance.',
    camera: { position: [-0.77, 5.18, -1.85], target: [1.2, 4.9, 0] },
  },
  {
    id: 'tilt-turn',
    label: 'Tilt & Turn',
    category: 'Tilt & turn window',
    title: 'Tilt & Turn Window',
    description:
      'A European staple new to many NZ homeowners — opens inward from the top for ventilation, or fully inward like a door for cleaning. Exceptional draught sealing in both positions.',
    camera: { position: [0.3, 1.39, -0.38], target: [0.89, 1.4, 0.45] },
  },
]

function CameraRig({ targetPosition, targetLookAt }) {
  const { camera } = useThree()
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0))
  const targetPos = useRef(new THREE.Vector3(...targetPosition))
  const targetLook = useRef(new THREE.Vector3(...targetLookAt))

  targetPos.current.set(...targetPosition)
  targetLook.current.set(...targetLookAt)

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.05)
    currentLookAt.current.lerp(targetLook.current, 0.05)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

function House() {
  const { scene } = useGLTF(MODEL_URL)
  return <primitive object={scene} />
}

export default function App() {
  const [activeId, setActiveId] = useState('overview')
  const activeStop = STOPS.find((s) => s.id === activeId)

  return (
    <div className="app">
      <div className="header">
        <img src="/ambiance-logo.webp" alt="Ambiance uPVC Windows" />
        <div className="header-text">
          <h1>Ambiance Townhouse</h1>
          <p>Interactive product showcase</p>
        </div>
      </div>

      <nav className="sidenav">
        <p className="sidenav-label">Explore</p>
        {STOPS.map((stop) => (
          <button
            key={stop.id}
            type="button"
            className={`sidenav-item ${activeId === stop.id ? 'active' : ''}`}
            onClick={() => setActiveId(stop.id)}
          >
            <span className="sidenav-dot" />
            {stop.label}
          </button>
        ))}
      </nav>

      {activeStop && (
        <div className="infocard">
          {activeStop.category && (
            <p className="infocard-category">{activeStop.category}</p>
          )}
          <h2 className="infocard-title">{activeStop.title}</h2>
          <p className="infocard-desc">{activeStop.description}</p>
        </div>
      )}

      <Canvas camera={{ position: [-18.79, 7.74, 20.95], fov: 45 }}>
        <color attach="background" args={['#f1ece3']} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 4, -5]} intensity={0.5} />
        <hemisphereLight args={['#ffffff', '#d6cdb8', 0.4]} />

        <CameraRig
          targetPosition={activeStop.camera.position}
          targetLookAt={activeStop.camera.target}
        />

        <Suspense
          fallback={
            <Html center>
              <div className="loader">Loading model…</div>
            </Html>
          }
        >
          <Bounds fit clip observe margin={1.4}>
            <House />
          </Bounds>
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <div className="help">Click a product to explore</div>
    </div>
  )
}
