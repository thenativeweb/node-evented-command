var hub = require('./hub')
  , Command;

Command = function(cmd) {

	this.cmd = cmd;

};

Command.prototype = {

	emit: function(callback) {

		hub.sendCommand(this.cmd, callback);

	}

};

module.exports = Command;