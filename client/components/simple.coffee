types = require('client/types')

module.exports = types.checkModule
    header_: ['Html']
    header: ->
        m '.header.clearfix.mbl',
            m '.container',
                m '.row',
                    m '.col-sm-6.col-md-8.col-lg-6',
                        m 'h1', 'Tomatoes Together!'
                    m '.col-sm-6.col-md-4.col-lg-6',
                        m 'p', 'Working by yourself can lead to a lack of motivation. But working around others can be distracting.  So do 25 minutes of focused work, and then take a 5 minute break to tell everyone about how it went!  Work periods start on the hour and half past the hour.'

    footer_: ['Html']
    footer: ->
        m '#footer',
            m '.container.text-muted',
                'An experiment by'
                m 'a[href=https://twitter.com/davidscolgan]', '@davidscolgan'
