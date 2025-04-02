import { describe, test, expect } from 'vitest'
import { getPerpendicularSegments } from '../utils/room-utils'

describe('getPerpendicularSegments', () => {
  test('returns two perpendicular segments from a square shape', () => {
    const coords = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 }
    ]

    const [seg1, seg2] = getPerpendicularSegments(coords)

    expect(seg1).toBeTruthy()
    expect(seg2).toBeTruthy()

    const dot = seg1.vector.x * seg2.vector.x + seg1.vector.y * seg2.vector.y
    expect(Math.abs(dot)).toBeLessThan(0.01)
  })

  test('returns fallback segments if no perpendicular pair is found', () => {
    const coords = [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 10, y: 1 } // not really forming 90 degrees
    ]

    const [seg1, seg2] = getPerpendicularSegments(coords)

    expect(seg1).toBeTruthy()
    expect(seg2).toBeTruthy()
  })
})