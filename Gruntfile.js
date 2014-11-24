module.exports = function(grunt) {
    grunt.initConfig({
        'nggettext_extract': {
            pot: {
                options: {
                    extensions: {
                        htm: 'html',
                        html: 'html',
                        js: 'js'
                    },
                },
                files: {
                    'locale-frontend/template.pot': [
                        'static/main/scripts/app/**/*.js',
                        'static/main/scripts/app/**/*.html',
                        'templates/**/*.html',
                    ]
                }
            },
        },
        'nggettext_compile': {
            all: {
                files: {
                    'static/main/scripts/app/translations.js': ['locale-frontend/*.po']
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-angular-gettext');

    grunt.registerTask('extract', ['nggettext_extract']);
    grunt.registerTask('compile', ['nggettext_compile']);
};
