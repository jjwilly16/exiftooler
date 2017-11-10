<<<<<<< HEAD
var execute = require('child_process').exec;
var exiftoolApi = require('./exiftoolApi');
var extend = require('./util').extend;
=======
const execute = require('child_process').exec;
const exiftoolApi = require('./exiftoolApi');
const extend = require('./util').extend;
>>>>>>> 6930afba1643b3df7d1a4a09c007dbe706bc291b


module.exports = {


    config: require('./config'),


    read: function (filePath, options) {

        if (typeof filePath !== 'string') throw new Error('TypeError: the first argument for the "read" method must be a string!');

        if (typeof filePath !== 'object') throw new Error('TypeError: the second argument for the "read" method must be an object!');

        const defaultOptions = {
            groupHeadings: true,
            json: true,
        };

        // Set the options for the command
        // by merging default options with user options
        const ops = extend({}, defaultOptions, options);

        // Base command
        let command = this.config.command;

        // Loop through command options and call
        // the appropriate command from the api
        for (const prop in ops) {
            if (ops[prop] !== false) {
                let subcommand;

                // Build the subcommand
                switch (ops[prop].constructor) {
                case Number:
                    subcommand = exiftoolApi[prop] + ops[prop];
                    break;
                case String:
                    subcommand = exiftoolApi[prop] + ' ' + ops[prop];
                    break;
                case Array:
                    subcommand = exiftoolApi[prop] + ' ' + ops[prop].join().replace(/,/g, ' ');
                    break;
                case Boolean:
                    subcommand = exiftoolApi[prop];
                    break;
                default:
                    subcommand = exiftoolApi[prop];
                }

                // Concatenate the subcommand onto the command
                command += subcommand;
            }
        }

        // Concatenate the filepath onto the command
        command += ' "' + filePath + '"';

        // Execute command and return promise
        return new this.config.Promise(function (resolve, reject) {
            execute(command, function (err, stdout) {
                if (err) return reject(err);
                return resolve(stdout);
            });
        });

    },


    write: function (filePath, options) {

        if (typeof filePath !== 'string') throw new Error('TypeError: the first argument for the "write" method must be a string!');


        let args = '';

        let command = this.config.command + ' ';

        for (const op in options) {
            args += '-' + op + '=';
            args += '"' + options[op] + '" ';
        }

        command += args + '"' + filePath + '"';

        return new this.config.Promise(function (resolve, reject) {
            execute(command, function (err, stdout) {
                if (err) return reject(err);

                return resolve(stdout);
            });
        });

    },


    remove: function (filePath, options) {

        if (typeof filePath !== 'string') throw new Error('TypeError: the first argument for the "remove" method must be a string!');

        if (options && options.constructor !== Array) throw new Error('TypeError: the second argument for the "remove" method must be an array!');

        const exceptions = options.join(' ');

        const command = this.config.command + ' -all= ' + exceptions;

        return new this.config.Promise(function (resolve, reject) {
            execute(command + '"' + filePath + '"', function (err) {
                if (err) return reject(err);

                return resolve(null);

            });
        });


    },


    rawCommand: function (options) {

        if (typeof options !== 'string') throw new Error('TypeError: the first argument for the "rawCommand" method must be a string!');

        const command = this.config.command + ' ' + options;

        return new this.config.Promise(function (resolve, reject) {
            execute(command, function (err, stdout) {
                if (err) return reject(err);

                return resolve(stdout);
            });
        });

    },

};
