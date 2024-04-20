import { describe, expect, test } from 'vitest'
import { InvalidRouteParamValueError } from '@/types'
import { path, query, createRoutes } from '@/utilities'
import { component } from '@/utilities/testHelpers'
import { assembleUrl } from '@/utilities/urlAssembly'

describe('path params', () => {
  test.each([
    ['/simple'],
    [path('/simple', {})],
  ])('given simple route with string path and without params, returns route path', (path) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path,
        component,
      },
    ])

    const url = assembleUrl(route)

    expect(url).toBe('/simple')
  })

  test.each([
    ['/simple/:?simple'],
    [path('/simple/:?simple', { simple: String })],
  ])('given route with optional string param NOT provided, returns route Path with string without values interpolated', (path) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path,
        component,
      },
    ])

    const url = assembleUrl(route)

    expect(url).toBe('/simple/')
  })

  test.each([
    ['/simple/:?simple'],
    [path('/simple/:?simple', { simple: String })],
  ])('given route with optional string param provided, returns route Path with string with values interpolated', (path) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path,
        component,
      },
    ])

    const url = assembleUrl(route, {
      params: { simple: 'ABC' },
    })

    expect(url).toBe('/simple/ABC')
  })

  test.each([
    ['/simple/:simple'],
    [path('/simple/:simple', { simple: String })],
  ])('given route with required string param NOT provided, throws error', (path) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path,
        component,
      },
    ])

    expect(() => assembleUrl(route, {})).toThrowError(InvalidRouteParamValueError)
  })

  test.each([
    ['/simple/:simple'],
    [path('/simple/:simple', { simple: String })],
  ])('given route with required string param provided, returns route Path with string with values interpolated', (path) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path,
        component,
      },
    ])

    const url = assembleUrl(route, {
      params: { simple: 'ABC' },
    })

    expect(url).toBe('/simple/ABC')
  })
})

describe('query params', () => {
  test.each([
    ['simple=abc'],
    [query('simple=abc', {})],
  ])('given simple route with string query and without params, returns route query', (query) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path: '/',
        query,
        component,
      },
    ])

    const url = assembleUrl(route)

    expect(url).toBe('/?simple=abc')
  })

  test.each([
    ['simple=:?simple'],
    [query('simple=:?simple', { simple: String })],
  ])('given route with optional string param NOT provided, returns route Query with string without values interpolated', (query) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path: '/',
        query,
        component,
      },
    ])

    const url = assembleUrl(route)

    expect(url).toBe('/?simple=')
  })

  test.each([
    ['simple=:?simple'],
    [query('simple=:?simple', { simple: String })],
  ])('given route with optional string param provided, returns route Query with string with values interpolated', (query) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path: '/',
        query,
        component,
      },
    ])

    const url = assembleUrl(route, {
      params: { simple: 'ABC' },
    })

    expect(url).toBe('/?simple=ABC')
  })

  test.each([
    ['simple=:simple'],
    [query('simple=:simple', { simple: String })],
  ])('given route with required string param NOT provided, throws error', (query) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path: '/',
        query,
        component,
      },
    ])

    expect(() => assembleUrl(route)).toThrowError(InvalidRouteParamValueError)
  })

  test.each([
    ['simple=:simple'],
    [query('simple=:simple', { simple: String })],
  ])('given route with required string param provided, returns route Query with string with values interpolated', (query) => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path: '/',
        query,
        component,
      },
    ])

    const url = assembleUrl(route, {
      params: { simple: 'ABC' },
    })

    expect(url).toBe('/?simple=ABC')
  })
})

describe('queries', () => {
  test('given a static query returns route with query values added', () => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path: '/',
        component,
      },
    ])

    const url = assembleUrl(route, {
      query: { simple: 'ABC' },
    })

    expect(url).toBe('/?simple=ABC')
  })

  test('given a route with a query and a static query returns route with query values added', () => {
    const [route] = createRoutes([
      {
        name: 'simple',
        path: '/',
        query: 'foo=foo',
        component,
      },
    ])

    const url = assembleUrl(route, {
      query: { simple: 'ABC' },
    })

    expect(url).toBe('/?foo=foo&simple=ABC')
  })
})