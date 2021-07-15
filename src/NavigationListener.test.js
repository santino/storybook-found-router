import React from 'react'
import { mount } from 'enzyme'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import NavigationListener from './NavigationListener'

const mockActionAddon = jest.fn()
const mockLinkAddon = jest.fn()
jest.mock('@storybook/addon-actions', () => ({
  action: jest.fn(() => mockActionAddon)
}))
jest.mock('@storybook/addon-links', () => ({
  linkTo: jest.fn(() => mockLinkAddon)
}))

global.console = {
  info: jest.fn(),
  warn: jest.fn()
}

const storyFn = () => <div>my story</div>

describe('NavigationListener', () => {
  const routerProp = {
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      createHref: jest.fn(),
      createLocation: jest.fn(),
      isActive: jest.fn(),
      matcher: {
        match: jest.fn(),
        getRoutes: jest.fn(),
        isActive: jest.fn(),
        format: jest.fn()
      },
      addNavigationListener: jest.fn()
    }
  }
  const wrap = () =>
    mount(<NavigationListener {...routerProp}>{storyFn()}</NavigationListener>)

  describe('React Component', () => {
    afterEach(() => {
      routerProp.router.addNavigationListener.mockClear()
    })

    it('renders children component (story) correctly', () => {
      const wrapper = wrap()

      expect(wrapper.find('NavigationListener')).toHaveLength(1)
      expect(wrapper.children().equals(storyFn())).toBe(true)
    })

    it('adds the internal onNavigation method as a NavigationListener', () => {
      const wrapper = wrap()
      wrapper.instance().removeNavigationListener = jest.fn()

      expect(routerProp.router.addNavigationListener).toHaveBeenCalledTimes(1)
      expect(routerProp.router.addNavigationListener).toHaveBeenCalledWith(
        wrapper.instance().onNavigation
      )
    })

    it('sets and execute removeNavigationListener method on componentWillUnmount', () => {
      const wrapper = wrap()
      const mockRemoveNavigationListener = jest.fn()

      wrapper.instance().removeNavigationListener = mockRemoveNavigationListener

      expect(wrapper.instance().componentWillUnmount).toBeDefined()
      wrapper.unmount()
      expect(mockRemoveNavigationListener).toHaveBeenCalled()
    })
  })

  describe('onNavigation method', () => {
    afterEach(() => {
      mockActionAddon.mockClear()
      action.mockClear()
      routerProp.router.matcher.match.mockClear()
      routerProp.router.matcher.getRoutes.mockClear()
    })

    it('calls handleMatchingSuccess when matching route with story string', () => {
      const wrapper = wrap()
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      })
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([
        { story: 'HomePage' }
      ])
      wrapper.instance().handleMatchingFailure = jest.fn()
      wrapper.instance().handleMatchingSuccess = jest.fn()
      wrapper.instance().onNavigation({ action: 'PUSH', pathname: '/' })

      expect(action).toHaveBeenCalledWith('PUSH')
      expect(mockActionAddon).toHaveBeenCalledWith('/')
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled()
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith(
        'HomePage',
        'default'
      )
    })

    it('calls handleMatchingSuccess when matching route with story array of 2 elements', () => {
      const wrapper = wrap()
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      })
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([
        { story: ['LoginForm', 'invalid'] }
      ])
      wrapper.instance().handleMatchingFailure = jest.fn()
      wrapper.instance().handleMatchingSuccess = jest.fn()
      wrapper.instance().onNavigation({ action: 'PUSH', pathname: '/login' })

      expect(action).toHaveBeenCalledWith('PUSH')
      expect(mockActionAddon).toHaveBeenCalledWith('/login')
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled()
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith(
        'LoginForm',
        'invalid'
      )
    })

    it('calls handleMatchingSuccess when matching route with story array ignoring extra elements', () => {
      const wrapper = wrap()
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      })
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([
        { story: ['LoginForm', 'invalid', 'foo', 'bar'] }
      ])
      wrapper.instance().handleMatchingFailure = jest.fn()
      wrapper.instance().handleMatchingSuccess = jest.fn()
      wrapper.instance().onNavigation({ action: 'PUSH', pathname: '/login' })

      expect(action).toHaveBeenCalledWith('PUSH')
      expect(mockActionAddon).toHaveBeenCalledWith('/login')
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled()
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith(
        'LoginForm',
        'invalid'
      )
    })

    it('calls handleMatchingFailure when matching route without story', () => {
      const wrapper = wrap()
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      })
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([{}])
      wrapper.instance().handleMatchingFailure = jest.fn()
      wrapper.instance().handleMatchingSuccess = jest.fn()
      wrapper.instance().onNavigation({ action: 'PUSH', pathname: '/' })

      expect(action).toHaveBeenCalledWith('PUSH')
      expect(mockActionAddon).toHaveBeenCalledWith('/')
      expect(wrapper.instance().handleMatchingFailure).toHaveBeenCalledWith()
      expect(wrapper.instance().handleMatchingSuccess).not.toHaveBeenCalled()
    })

    it('calls handleMatchingFailure when not matching route', () => {
      const wrapper = wrap()
      routerProp.router.matcher.match.mockReturnValueOnce(null)
      wrapper.instance().handleMatchingFailure = jest.fn()
      wrapper.instance().handleMatchingSuccess = jest.fn()
      wrapper.instance().onNavigation({ action: 'PUSH', pathname: '/' })

      expect(action).toHaveBeenCalledWith('PUSH')
      expect(mockActionAddon).toHaveBeenCalledWith('/')
      expect(routerProp.router.matcher.getRoutes).not.toHaveBeenCalled()
      expect(wrapper.instance().handleMatchingFailure).toHaveBeenCalledWith()
      expect(wrapper.instance().handleMatchingSuccess).not.toHaveBeenCalled()
    })

    it('traverses single empty object when present in routes array', () => {
      const wrapper = wrap()
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      })
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([
        { story: 'foo' },
        {}
      ])
      wrapper.instance().handleMatchingFailure = jest.fn()
      wrapper.instance().handleMatchingSuccess = jest.fn()
      wrapper.instance().onNavigation({ action: 'PUSH', pathname: '/' })

      expect(action).toHaveBeenCalledWith('PUSH')
      expect(mockActionAddon).toHaveBeenCalledWith('/')
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled()
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith(
        'foo',
        'default'
      )
    })

    it('traverses multiple empty objects when present in routes array', () => {
      const wrapper = wrap()
      routerProp.router.matcher.match.mockReturnValueOnce({
        routeIndices: [0]
      })
      routerProp.router.matcher.getRoutes.mockReturnValueOnce([
        { story: 'foo' },
        {},
        {},
        {}
      ])
      wrapper.instance().handleMatchingFailure = jest.fn()
      wrapper.instance().handleMatchingSuccess = jest.fn()
      wrapper.instance().onNavigation({ action: 'PUSH', pathname: '/' })

      expect(action).toHaveBeenCalledWith('PUSH')
      expect(mockActionAddon).toHaveBeenCalledWith('/')
      expect(wrapper.instance().handleMatchingFailure).not.toHaveBeenCalled()
      expect(wrapper.instance().handleMatchingSuccess).toHaveBeenCalledWith(
        'foo',
        'default'
      )
    })
  })

  describe('handleMatchingFailure method', () => {
    afterEach(() => {
      console.warn.mockClear()
      mockLinkAddon.mockClear()
      linkTo.mockClear()
    })

    it('should log a warn message to notify that no route has been matched and return false', () => {
      const wrapper = wrap()
      const handleMatchingFailure = wrapper.instance().handleMatchingFailure()

      expect(console.warn).toHaveBeenCalledWith(
        'storybook-found-router:',
        expect.stringContaining('No route matched')
      )
      expect(handleMatchingFailure).toBeFalsy()
      expect(linkTo).not.toHaveBeenCalled()
      expect(mockLinkAddon).not.toHaveBeenCalled()
    })
  })

  describe('handleMatchingSuccess method', () => {
    afterEach(() => {
      console.info.mockClear()
      mockLinkAddon.mockClear()
      linkTo.mockClear()
    })

    it('should log an info message with Kind and Story and call addon linkTo', () => {
      const wrapper = wrap()
      const kind = 'HomePage'
      const story = 'default'
      wrapper.instance().handleMatchingSuccess(kind, story)

      expect(console.info).toHaveBeenCalledWith(
        'storybook-found-router:',
        expect.stringContaining(`'${kind}', '${story}'`)
      )
      expect(linkTo).toHaveBeenCalledWith(kind, story)
      expect(mockLinkAddon).toHaveBeenCalledWith()
    })
  })
})
