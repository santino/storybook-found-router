import React from 'react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { routerShape } from 'found/PropTypes'

class NavigationListener extends React.Component {
  constructor (props) {
    super(props)

    this.onNavigation = this.onNavigation.bind(this)
    this.removeNavigationListener = props.router.addNavigationListener(
      this.onNavigation
    )
  }

  componentWillUnmount () {
    this.removeNavigationListener()
  }

  handleMatchingFailure () {
    console.warn(
      'storybook-found-router:',
      'No route matched; forgot to add or mispelled something?'
    )
    return false
  }

  handleMatchingSuccess (kind, story) {
    console.info(
      'storybook-found-router:',
      `Pushing matched route to story '${kind}', '${story}'`
    )
    return linkTo(kind, story)()
  }

  onNavigation (location) {
    const link = location.pathname
    const { router: { matcher } } = this.props

    action(location.action)(link)

    const match = matcher.match({ pathname: link })
    if (!match) return this.handleMatchingFailure()

    const routes = matcher.getRoutes({ routeIndices: match.routeIndices })

    // Due to a breaking change introduced in found 4.0 we need to traverse empty objects.
    // As discussed in https://github.com/4Catalyzer/found/issues/657
    let route = routes.pop()
    while (!Object.keys(route).length && routes.length) {
      route = routes.pop()
    }

    const isRouteStoryArray = Array.isArray(route.story)
    const kind = isRouteStoryArray ? route.story[0] : route.story
    const story = isRouteStoryArray ? route.story[1] : 'default'

    return kind
      ? this.handleMatchingSuccess(kind, story)
      : this.handleMatchingFailure()
  }

  render () {
    return <>{this.props.children}</>
  }
}

NavigationListener.propTypes = {
  router: routerShape.isRequired
}

export default NavigationListener
