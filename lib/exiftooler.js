var execute = require('child_process').exec;
var exiftoolApi = require('./exiftoolApi');
var extend = require('./util.extend');


module.exports = {


    config: require('./config'),


    readFile: function (filePath, options) {

        if (typeof filePath !== 'string') throw new Error('TypeError: the first argument for the "read" method must be a string!');

        if (typeof filePath !== 'object') throw new Error('TypeError: the second argument for the "read" method must be an object!');

        var defaultOptions = {
            groupHeadings: true,
            json: true
        };

        // Set the options for the command
        // by merging default options with user options
        var ops = extend({}, defaultOptions, options);

        // Base command
        var command = this.config.command;

        // Loop through command options and call
        // the appropriate command from the api
        for (var prop in ops) {
            if (ops[prop] !== false) {
                var subcommand;

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

        console.log(command);

        // Execute command and return promise
        return new this.config.Promise(function (resolve, reject) {
            execute(command, function (err, stdout) {
                if (err) return reject(err);
                return resolve(stdout);
            });
        });

    },


    writeFile: function (filePath, options) {

        if (typeof filePath !== 'string') throw new Error('TypeError: the first argument for the "write" method must be a string!');


        var args = '';

        var command = this.config.command + ' ';

        for (var op in options) {
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


    removeFile: function (filePath, options) {

        if (typeof filePath !== 'string') throw new Error('TypeError: the first argument for the "remove" method must be a string!');

        if (options && options.constructor !== Array) throw new Error('TypeError: the second argument for the "remove" method must be an array!');

        var exceptions = options.join(' ');

        var command = this.config.command + ' -all= ' + exceptions;

        return new this.config.Promise(function (resolve, reject) {
            execute(command + '"' + filePath + '"', function (err) {
                if (err) return reject(err);

                return resolve(null);

            });
        });



    },


    rawCommand: function (options) {

        if (typeof options !== 'string') throw new Error('TypeError: the first argument for the "rawCommand" method must be a string!');

        var command = this.config.command + ' ' + options;

        return new this.config.Promise(function (resolve, reject) {
            execute(command, function (err, stdout) {
                if (err) return reject(err);

                return resolve(stdout);
            });
        });

    }

};