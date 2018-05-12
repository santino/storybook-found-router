# storybook-found-router
[Storybook](https://storybook.js.org/) decorator for [React](https://reactjs.org/) components using [Found](https://github.com/4Catalyzer/found) routing

This storybook decorator will allow you to render the React components of your application that use any of the Found router instances by adding a memory router wrapper to your stories.
You can customise the decorator using the two arguments `routeConfig` and `initialLocation` to navigate within the storybook, taking advantage of the built in [Story Links Addon](https://github.com/storybooks/storybook/tree/master/addons/links) functionality, and set the initial location; in addition to this your routing actions will also be logged by default using the [Storybook Addon Action](https://github.com/storybooks/storybook/tree/master/addons/actions)

## Guide
### Installation
```
npm install --save-dev storybook-found-router
```

### Basic usage
If you just want to be able to render your routing aware components you can add the decorator to your stories like this
```js
import React from 'react'
import Link from 'found/lib/Link'
import { storiesOf } from '@storybook/react'
import storyRouter from 'storybook-found-router'

const Navigation = () => (
  <div>
    <ul>
      <li><Link to='/blog'>Blog</Link></li>
    </ul>
  </div>
)

storiesOf('Navigation', module)
  .addDecorator(storyRouter())
  .add('default', () => <Navigation />)
```

This is useful when your hypothetical `Navigation` component is using some Found instances like the Link from `found/lib/Link`.
This basic implementation allows you to render the component and storybook-found-router will log the router action when you click on a link (e.g. `PUSH: ["/blog"]`) to let you know what the router would perform when running your application; however no real action will be performed unless you stat using the first argument: `routeConfig`.

### Custom usage
If you want your links to actually perform some navigation you can do so by using the first `routeConfig` argument.
Imagine that you have a story like this
```js
import React from 'react'
import Link from 'found/lib/Link'
import { storiesOf } from '@storybook/react'

const Blog = ({ user = 'Guest' }) => <div>Hey {user}, welcome to my blog</div>

storiesOf('Blog', module)
  .add('default', () => <Blog />)
  .add('user', () => <Blog user='Luke Skywalker' />)
```

If we take the example given above in the "Basic usage" and want to perform navigation when clicking on the `/blog` link we can do so by setting the first argument like this
```js
storiesOf('Navigation', module)
  .addDecorator(storyRouter([{ path: 'blog', story: 'Blog' }]))
  .add('default', () => <Navigation />)
```

With the above configuration when our Navigation sotry is rendered and we click the link to `/blog` we will be redirected to the `default` story of the `Blog` "kind", as defined with this line `storiesOf('Blog', module).add('default', () => <Blog />)`.

You might have noticed that our `Blog` "kind" has two stories defined, `default` and `user`; if we wanted our link to navigate to the `user` story we could do this by passing an array to the `story` property of our `routeConfig` argument like this
```js
storiesOf('Navigation', module)
  .addDecorator(storyRouter([{ path: 'blog', story: ['Blog', 'user'] }]))
  .add('default', () => <Navigation />)
```

### Advanced usage
The "Custom usage" seen above is handy when you want to render isolated components using router instances and with a few links that you want to direct to stories, but what about if you want to support multiple nested routes within your application?
Perhaps you might want to consider mimicking your Found route configuration and add the decorator globally to all stories
```js
import { configure, addDecorator } from '@storybook/react'

function loadStories() {
  // Import your stories here
}
const routeConfig = [
  {
    path: '/',
    story: 'HomePage',
    children: [
      {
        path: 'blog',
        story: 'BlogPage',
        children: [
          {
            path: ':post',
            story: 'PostPage',
            children: [
              {
                path: 'author',
                story: 'AuthorPage'
              }
            ]
          }
        ]
      }
    ]
  }
]

addDecorator(storyRouter(routeConfig))
configure(loadStories, module)
```

With this global configuration you will only have to define your `routeConfig` in one place and all your stories will automatically be decorated with the router instances; this configuration will also allow you to handle navigation on multiple links within one component matching nested routes like this
```js
const Navigation = () => (
  <div>
    <ul>
      <li><Link to='/blog'>Blog</Link></li>
      <li><Link to='/blog/123'>Blog Post</Link></li>
      <li><Link to='/blog/123/author'>Post Author</Link></li>
    </ul>
  </div>
)
```

## Arguments
The storybook-found-router function takes two optional arguments

### `routeConfig`
The first argument you can pass is `routeConfig` which is an array of objects containing the following three properties
- `path` a string containing the location path you want to match
- `story` a string containing the name of the "kind" ('HomePage') or an array containing both the "kind" and the story name (['HomePage', 'default'])
- `children` an array of objects containing additional nested routes

If you omit the `story` property the decorator will still provide the router instances to your story components but clicking on the matched link won't trigger any navigation action.
When passing a string to the `story` property the decorator will match the 'default' story of the specified "kind" so you need to use an array just when you want to match a specific story within a "kind" which is not the 'default'.

### `initialLocation`
A string that will be passed to the MemoryRouter as initial location; useful when your component need to be aware of the active route.

## Notes
Matching is performed using the default Found matching algorithm as this decorator is not meant to reinvent any matching logic.
Under the hood the Found matching algorithm is performed using [Path-to-RegExp](https://github.com/pillarjs/path-to-regexp) which allows you to use some patterns like the following
- `/path/subpath` => Matches `/path/subpath`
- `/path/:param` => Matches `/path/foo`
- `/path/:regexParam(\\d+)` => Matches `/path/123` - Does not match `/path/foo`
- `/path/:optionalParam?` => Matches `/path/foo` and `/path`
- `/path/*` => Matches `/path/foo/bar`