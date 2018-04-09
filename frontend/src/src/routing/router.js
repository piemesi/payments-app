import Layout from '../layout'

// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

export default {
    component: Layout,
    childRoutes: [{
        childRoutes: [
            {
                path: '/',
                getComponent(location, callback) {
                    require.ensure([], (require) => {
                        console.log('sdddddddd')
                        callback(null, require("../containers/NotFound").default)
                    }, 'books-list.chunk')
                }
            },
            {
                path: '/author/:authorId',
                getComponent(location, callback) {
                    require.ensure([], (require) => {
                        console.log('sdddddddd')
                        callback(null, require("../containers/MobilePage").default)
                    }, 'author-page.chunk')
                }
            },
            {
                path: '/book/:bookId',
                getComponent(location, callback) {
                    require.ensure([], (require) => {
                        console.log('sdddddddd')
                        callback(null, require("../containers/NotFound").default)
                    }, 'book-page.chunk')
                }
            },
            {
                path: '/turn-on-json-server',
                getComponent(location, callback) {
                    require.ensure([], (require) => {
                        callback(null, require("../containers/NotFound").default)
                    }, 'server-error.chunk')
                }
            },
            {
                path: "*",
                getComponent: (location, callback) => {
                    require.ensure([], require => {
                        console.log('sdddddddd')
                        callback(null, require("../containers/NotFound").default)
                    }, '404.chunk')
                }
            }]
    }]
}