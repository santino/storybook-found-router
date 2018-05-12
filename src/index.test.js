import React from 'react'
import { mount } from 'enzyme'
import storyRouterDecorator from '.'

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
    expect(resolvedMatch.location.pathname).toBe('/')
    expect(resolvedMatch.routeIndices).toBeDefined()
    expect(resolvedMatch.routeParams).toBeDefined()
    expect(resolvedMatch.params).toBeDefined()
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
    expect(resolvedMatch.location.pathname).toBe('/')
    expect(resolvedMatch.routeIndices).toBeDefined()
    expect(resolvedMatch.routeParams).toBeDefined()
    expect(resolvedMatch.params).toBeDefined()
  })

  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig without "/" route', () => {
    const wrapper = wrap([
      {
        path: 'login',
        story: 'LoginPage'
      }
    ])
    const resolvedMatch = wrapper.find('BaseRouter').prop('resolvedMatch')

    expect(wrapper.find('FarceRouter')).toHaveLength(1)
    expect(wrapper.find('Provider')).toHaveLength(1)
    expect(wrapper.find('BaseRouter')).toHaveLength(1)
    expect(resolvedMatch.location.pathname).toBe('/')
    expect(resolvedMatch.routeIndices).toBeDefined()
    expect(resolvedMatch.routeParams).toBeDefined()
    expect(resolvedMatch.params).toBeDefined()
  })

  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig and initialLocation', () => {
    const wrapper = wrap(
      [
        {
          path: 'login',
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
    expect(resolvedMatch.routeParams).toBeDefined()
    expect(resolvedMatch.params).toBeDefined()
  })

  it('should render BaseRouter with expected resolvedMatch prop when called with routeConfig and inexistent initialLocation', () => {
    const wrapper = wrap(
      [
        {
          path: 'login',
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
    expect(resolvedMatch.routeParams).toBeUndefined()
    expect(resolvedMatch.params).toBeUndefined()
  })
})
