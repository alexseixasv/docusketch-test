import { describe, test, expect } from 'vitest'
import { getPerpendicularSegments } from '../utils/room-utils'

describe('getPerpendicularSegments', () => {
  test('retorna dois segmentos perpendiculares corretamente para um quadrado', () => {
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

  test('retorna fallback se não houver pares perpendiculares', () => {
    const coords = [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 10, y: 1 } // ângulo irregular
    ]

    const [seg1, seg2] = getPerpendicularSegments(coords)

    expect(seg1).toBeTruthy()
    expect(seg2).toBeTruthy()

    // fallback retorna os dois primeiros segmentos, que podem não ser perpendiculares
    const dot = seg1.vector.x * seg2.vector.x + seg1.vector.y * seg2.vector.y
    expect(dot).not.toBeNaN()
  })
})
