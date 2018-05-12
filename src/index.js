import React from 'react'
import createFarceRouter from 'found/lib/createFarceRouter'
import createRender from 'found/lib/createRender'
import MemoryProtocol from 'farce/lib/MemoryProtocol'
import resolver from 'found/lib/resolver'
import TransitionHooker from './TransitionHooker'

const storyRouterDecorator = (routes = [{}], initialLocation = '/') => {
  const decorator = story => {
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
          children: routes
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
