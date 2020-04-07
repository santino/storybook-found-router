import React from 'react'
import createFarceRouter from 'found/createFarceRouter'
import createRender from 'found/createRender'
import MemoryProtocol from 'farce/MemoryProtocol'
import resolver from 'found/resolver'
import TransitionHooker from './TransitionHooker'

// Due to a breaking change introduced in found 4.0 we need to
// add empty objects to route children array, if not present.
// As discussed in https://github.com/4Catalyzer/found/issues/657
export const normaliseRouteChildren = (input) => {
  let childrenHasEmptyArray = false
  const children =
    !!input.children &&
    input.children.map((current) => {
      childrenHasEmptyArray =
        childrenHasEmptyArray || Object.keys(current).length === 0

      return normaliseRouteChildren(current)
    })

  if (children && !childrenHasEmptyArray) {
    children.unshift({})
  }
  return { ...input, ...(children && { children }) }
}

const storyRouterDecorator = (routes = [{}], initialLocation = '') => {
  const decorator = (story) => {
    const rootPath = routes[0].path === '/' ? '' : '/'
    const StoryRouter = createFarceRouter({
      historyProtocol: new MemoryProtocol(initialLocation),
      routeConfig: [
        {
          path: rootPath,
          Component: TransitionHooker,
          render: ({ Component, props }) => (
            <Component {...props} story={story} />
          ),
          children: routes.map(normaliseRouteChildren)
        }
      ],
      render: createRender({})
    })
    return <StoryRouter resolver={resolver} />
  }
  decorator.displayName = 'StoryRouter'
  return decorator
}

export default storyRouterDecorator
