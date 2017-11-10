module.exports = {

    // EXTENDS OBJECTS
    extend: function (out) {
        out = out || {};

        for (let i = 1; i < arguments.length; i++) {
            if (!arguments[i]) continue;

            for (const key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    out[key] = arguments[i][key];
                }
            }
        }

        return out;
    },

};
