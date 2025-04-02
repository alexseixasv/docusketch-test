export function getPerpendicularSegments(coords) {
  const vectors = []

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i]
    const p2 = coords[(i + 1) % coords.length]
    const vector = { x: p2.x - p1.x, y: p2.y - p1.y }
    vectors.push({ p1, p2, vector })
  }

  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      const v1 = vectors[i].vector
      const v2 = vectors[j].vector
      const dot = v1.x * v2.x + v1.y * v2.y
      if (Math.abs(dot) < 0.01) {
        return [vectors[i], vectors[j]]
      }
    }
  }

  return [vectors[0], vectors[1]]
}

export function parseRoomCornersToCoords(room) {
  const wallMap = new Map()
  for (const wall of room.walls) {
    wallMap.set(wall.id, wall)
  }

  const cornerMap = new Map()
  for (const corner of room.corners) {
    cornerMap.set(corner.id, corner)
  }

  const wallConnections = room.corners.reduce((acc, corner) => {
    const wallIds = [
      ...(corner.wallStarts || []).map(w => w.id),
      ...(corner.wallEnds || []).map(w => w.id)
    ]
    for (const wallId of wallIds) {
      if (!acc.has(wallId)) acc.set(wallId, [])
      acc.get(wallId).push(corner.id)
    }
    return acc
  }, new Map())

  const visitedCorners = new Set()
  const path = []

  let currentCorner = room.corners[0]
  while (currentCorner && !visitedCorners.has(currentCorner.id)) {
    path.push({ x: currentCorner.x, y: currentCorner.y })
    visitedCorners.add(currentCorner.id)

    const connectedWalls = [
      ...(currentCorner.wallStarts || []),
      ...(currentCorner.wallEnds || [])
    ]

    let nextCorner = null
    for (const { id: wallId } of connectedWalls) {
      const connected = wallConnections.get(wallId) || []
      for (const cid of connected) {
        if (cid !== currentCorner.id && !visitedCorners.has(cid)) {
          nextCorner = cornerMap.get(cid)
          break
        }
      }
      if (nextCorner) break
    }

    currentCorner = nextCorner
  }

  return path
}
