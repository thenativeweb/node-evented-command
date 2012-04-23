var index;

if (typeof module.exports !== 'undefined') {
    index = module.exports;
} else {
    index = root.index = {};
}

index.VERSION = '0.1.1';

index.hub = require('./lib/hub');
index.Command = require('./lib/command');