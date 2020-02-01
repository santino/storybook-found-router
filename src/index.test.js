import React from 'react'
import { mount } from 'enzyme'
import storyRouterDecorator, { normaliseRouteChildren } from '.'

const storyFn = () => <div>my story</div>

describe('storyRouterDecorator', () => {
  const wrap = (routeConfig, initialLocation) => {
    const StoryRouter = storyRouterDecorator(routeConfig, initialLocation)
    return mount(StoryRouter(storyFn))
  }

  it('should render BaseRouter with expected resolvedMatch prop when called without arguments', () => {
    const wrapper = wrap()
    const resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch')

    expect(wrapper.find('FarceRouter')).toHaveLength(1)
    expect(wrapper.find('Provider')).toHaveLength(1)
    expect(wrapper.find('BaseRouter')).toHaveLength(1)
    expect(resolvedMatch.location.pathname).toBe('')
    expect(resolvedMatch.routeIndices).toBeDefined()
  })

  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig with "/" route', () => {
    const wrapper = wrap([
      {
        path: '/',
        story: 'HomePage'
      }
    ])
    const resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch')

    expect(wrapper.find('FarceRouter')).toHaveLength(1)
    expect(wrapper.find('Provider')).toHaveLength(1)
    expect(wrapper.find('BaseRouter')).toHaveLength(1)
    expect(resolvedMatch.location.pathname).toBe('')
    expect(resolvedMatch.routeIndices).toBeDefined()
  })

  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig without "/" route nor initialLocation', () => {
    const wrapper = wrap([
      {
        path: '/login',
        story: 'LoginPage'
      }
    ])
    const resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch')

    expect(wrapper.find('FarceRouter')).toHaveLength(1)
    expect(wrapper.find('Provider')).toHaveLength(1)
    expect(wrapper.find('BaseRouter')).toHaveLength(1)
    expect(resolvedMatch.location.pathname).toBe('')
    expect(resolvedMatch.routeIndices).toBeUndefined()
  })

  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig and initialLocation', () => {
    const wrapper = wrap(
      [
        {
          path: '/login',
          story: 'LoginPage'
        }
      ],
      '/login'
    )
    const resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch')

    expect(wrapper.find('FarceRouter')).toHaveLength(1)
    expect(wrapper.find('Provider')).toHaveLength(1)
    expect(wrapper.find('BaseRouter')).toHaveLength(1)
    expect(resolvedMatch.location.pathname).toBe('/login')
    expect(resolvedMatch.routeIndices).toBeDefined()
  })

  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig and inexistent initialLocation', () => {
    const wrapper = wrap(
      [
        {
          path: '/login',
          story: 'LoginPage'
        }
      ],
      '/foo'
    )
    const resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch')

    expect(wrapper.find('FarceRouter')).toHaveLength(1)
    expect(wrapper.find('Provider')).toHaveLength(1)
    expect(wrapper.find('BaseRouter')).toHaveLength(1)
    expect(resolvedMatch.location.pathname).toBe('/foo')
    expect(resolvedMatch.routeIndices).toBeUndefined()
  })
})

describe('normaliseRouteChildren', () => {
  const expectedRouteConfig = [
    {
      path: '/',
      story: 'RootStory',
      children: [
        {},
        {
          path: 'foo',
          story: 'FooStory'
        },
        {
          path: 'bar',
          story: 'BarStory',
          children: [
            {},
            {
              path: 'baz',
              story: 'BazStory',
              children: [
                {},
                {
                  path: 'quux',
                  story: 'QuuxStory'
                }
              ]
            }
          ]
        }
      ]
    }
  ]

  it('returns expected array of objects when no empty objects are included in children', () => {
    const initialRouteConfig = [
      {
        path: '/',
        story: 'RootStory',
        children: [
          {
            path: 'foo',
            story: 'FooStory'
          },
          {
            path: 'bar',
            story: 'BarStory',
            children: [
              {
                path: 'baz',
                story: 'BazStory',
                children: [
                  {
                    path: 'quux',
                    story: 'QuuxStory'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
    expect(initialRouteConfig.map(normaliseRouteChildren)).toEqual(
      expectedRouteConfig
    )
  })

  it('returns expected array of objects when some empty objects are included in children', () => {
    const initialRouteConfig = [
      {
        path: '/',
        story: 'RootStory',
        children: [
          {},
          {
            path: 'foo',
            story: 'FooStory'
          },
          {
            path: 'bar',
            story: 'BarStory',
            children: [
              {
                path: 'baz',
                story: 'BazStory',
                children: [
                  {},
                  {
                    path: 'quux',
                    story: 'QuuxStory'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
    expect(initialRouteConfig.map(normaliseRouteChildren)).toEqual(
      expectedRouteConfig
    )
  })
})
