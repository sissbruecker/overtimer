/**
 * Created by Sascha on 14.12.14.
 */
module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Clean build folders
        clean: ['build'],

        // Copy resources
        copy: {
            compile: {
                files: [

                    // App
                    {
                        expand: true,
                        src: [
                            '**/*.*'
                        ],
                        cwd: 'src/',
                        dest: 'build/temp/',
                        filter: 'isFile'
                    },

                    // External libs
                    {
                        expand: true,
                        src: [
                            'requirejs/require.js',

                            'jquery/dist/jquery.min.js',

                            'moment/min/moment.min.js',

                            'ramda/ramda.min.js',

                            'lokijs/build/lokijs.min.js'
                        ],
                        cwd: 'bower_components/',
                        dest: 'build/temp/lib',
                        filter: 'isFile'
                    }
                ]
            }
        },

        'string-replace': {

            // Modify require config to replace bower folder with lib folder
            index: {
                src: ['build/temp/app/main.js', 'build/temp/index.html'],
                dest: 'build/temp/',
                options: {
                    replacements: [
                        {
                            pattern: /\.\.\/bower_components/ig,
                            replacement: 'lib'
                        }
                    ]
                }
            }
        },

        // Build node-webkit app
        nwjs: {
            options: {
                platforms: ['osx64', 'win32', 'win64'],
                buildDir: './build',
                version: '0.12.3',
                flavor: 'normal'
            },
            src: ['build/temp/**/*']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('default', [
        'clean',
        'copy',
        'string-replace',
        'nwjs'
    ]);
};
