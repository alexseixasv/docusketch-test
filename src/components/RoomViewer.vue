<template>
  <div class="w-full h-full relative flex items-center justify-center">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>

    <!-- Buttons container -->
    <div class="absolute top-6 right-6 flex flex-col sm:flex-row gap-2 sm:gap-4 items-end sm:items-center">
      <button
        @click="changeDimensions"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-lg transition"
      >
        Change Dimensions
      </button>
      <a
        href="https://github.com/alexseixasv/docusketch-test"
        target="_blank"
        rel="noopener noreferrer"
        class="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white shadow-lg transition text-center"
      >
        Access Code
      </a>
    </div>

    <!-- Room name -->
    <p
      v-if="currentRoomName"
      class="absolute top-6 left-6 text-sm sm:text-lg font-semibold text-white bg-gray-800 px-4 py-2 rounded-lg shadow"
    >
      Shape: {{ currentRoomName }}
    </p>

    <!-- Footer credit -->
    <p class="absolute bottom-4 text-xs text-white opacity-60">
      Developed by Alex Seixas for DocuSketch using Three.js and Vue.js
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import simple from '../data/simple.json'
import triangle from '../data/triangle.json'
import tShape from '../data/t_shape.json'
import { getPerpendicularSegments, parseRoomCornersToCoords } from '../utils/room-utils'

const rooms = [
  { data: simple, name: 'simple' },
  { data: triangle, name: 'triangle' },
  { data: tShape, name: 't-shape' }
]

const canvasRef = ref(null)
const currentRoom = ref(null)
const currentRoomName = ref('')

let scene, camera, renderer, controls

onMounted(() => {
  initThree()
  drawRandomRoom()
  animate()
  window.addEventListener('resize', onWindowResize)
})

function initThree() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 300)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x111827)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  controls.zoomSpeed = 0.5
}

function drawRandomRoom() {
  scene.clear()

  const roomObj = rooms[Math.floor(Math.random() * rooms.length)]
  currentRoom.value = roomObj.data
  currentRoomName.value = roomObj.name

  const coords = parseRoomCornersToCoords(currentRoom.value)

  console.log('Selected room:', currentRoom.value)
  console.log('Parsed coordinates:', coords)

  if (!coords || coords.length < 3) {
    console.warn('Not enough corners to draw a room.')
    return
  }

  const SCALE = 0.1
  const scaledCoords = coords.map(p => ({ x: p.x * SCALE, y: -p.y * SCALE }))

  const roomVertices = []
  scaledCoords.forEach(p => roomVertices.push(p.x, p.y, 0))
  roomVertices.push(scaledCoords[0].x, scaledCoords[0].y, 0)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(roomVertices), 3))
  geometry.computeBoundingBox()
  const center = new THREE.Vector3()
  geometry.boundingBox.getCenter(center)
  geometry.translate(-center.x, -center.y, 0)

  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 })
  const roomLine = new THREE.LineLoop(geometry, material)
  scene.add(roomLine)

  const size = new THREE.Vector3()
  geometry.boundingBox.getSize(size)
  const maxDim = Math.max(size.x, size.y)
  const distance = maxDim * 1.5

  camera.position.set(0, 0, distance)
  camera.lookAt(0, 0, 0)
  controls.target.set(0, 0, 0)

  const centeredCoords = scaledCoords.map(p => ({
    x: p.x - center.x,
    y: p.y - center.y
  }))
  drawDimensions(centeredCoords)
}

function drawDimensions(coords) {
  const [seg1, seg2] = getPerpendicularSegments(coords)
  if (!seg1 || !seg2) return

  const drawLine = (seg, color) => {
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(seg.p1.x, seg.p1.y, 1),
      new THREE.Vector3(seg.p2.x, seg.p2.y, 1)
    ])
    const line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color }))
    scene.add(line)

    const midX = (seg.p1.x + seg.p2.x) / 2
    const midY = (seg.p1.y + seg.p2.y) / 2
    const length = Math.hypot(seg.p2.x - seg.p1.x, seg.p2.y - seg.p1.y)
    addMeasurementText(length.toFixed(1), { x: midX, y: midY })
  }

  drawLine(seg1, 0xff0000)
  drawLine(seg2, 0x0000ff)
}

function addMeasurementText(text, midpoint) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  ctx.font = '48px Arial'
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'middle'

  const metrics = ctx.measureText(text)
  const textWidth = metrics.width
  ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter

  const material = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(material)

  sprite.scale.set(20, 10, 1)
  sprite.position.set(midpoint.x, midpoint.y, 2)

  scene.add(sprite)
}

function changeDimensions() {
  drawRandomRoom()
}

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
</script>

<style scoped>
canvas {
  display: block;
}
</style>
