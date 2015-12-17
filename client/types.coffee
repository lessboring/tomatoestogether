Deodorant = require('deodorant')

typecheck = new Deodorant('debug')

typecheck.addAlias 'Socket',
    on: 'Function'
    emit: 'Function'

typecheck.addAlias 'Date',
    getDay: 'Function'
    getMonth: 'Function'
    getFullYear: 'Function'

typecheck.addAlias 'User',
    nickname: 'String'
    color: 'String'

typecheck.addAlias 'Message',
    nickname: 'String'
    body: 'String'
    color: 'String'

typecheck.addAlias 'Html',
    tag: 'String'
    attrs: {'*', 'Any'}
    children: ['Html']

module.exports = typecheck
