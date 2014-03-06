exports.config = {
    files: {
        javascripts: {
            joinTo: {
                'js/app.js': /^app/,
                'js/vendor.js': /^vendor/
            },
            order: {
                before: [
                    'vendor/jquery-2.1.0.min.js',
                    'vendor/knockout-3.0.0.js',
                    'vendor/bootstrap/js/bootstrap.js'
                ]
            }
        },
        stylesheets: {
            defaultExtension: 'less',
            joinTo: {
                'css/style.css': /^app/,
                'css/vendor.css': /^vendor/
            }
        }
    },
    plugins: {
        autoReload: {
            enabled: {
                css: true,
                js: true,
                assets: false
            },
            port: [1234, 2345, 3456],
            delay: require('os').platform() === 'win32' ? 200 : null
        },
        jshint: {
            pattern: /^app\/*\.js$/
        }
    }
};
