exports.config =
    conventions:
        ignored: (path) ->
            not /bootstrap\.less/.test(path) and /vendor\/bootstrap\/less/.test(path)
    files:
        javascripts:
            defaultExtension: 'coffee'
            joinTo:
                'js/app.js': /^app/
                'js/vendor.js': /^vendor/
            order:
                before: [
                    'vendor/jquery-2.1.0.min.js'
                    'vendor/knockout-3.0.0.js'
                    'vendor/bootstrap/js/bootstrap.js'
                ]
        stylesheets:
            defaultExtension: 'less'
            joinTo:
                'css/style.css': /^app/
                'css/vendor.css': /^vendor/
            order:
                before: [
                    'vendor/bootstrap/less/bootstrap.less'
                ]
    plugins:
        autoReload:
            enabled:
                css: on
                js: on
                assets: off
            port: [1234, 2345, 3456]
            delay: 200 if require('os').platform() is 'win32'
