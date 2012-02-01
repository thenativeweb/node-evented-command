var EventEmitter = require('events').EventEmitter
  , uuid = require('./uuid')
  , Observer = require('./observer')
  , Hub
  , hubInstance;

Hub = function() {

	this.observer = new Observer();

	var self = this;

	this.on('events', function(evt) {
		
		var getCommandId = function(e) {
			var idEndIndex = e.id.indexOf('_event');
			var id = e.id.substring(0, idEndIndex);
			return id;
		};

		var commandCallback = self.observer.getPendingCommand(getCommandId(evt));

		if (commandCallback) {
			commandCallback(evt);
		}

	});

};

// Inherit prototyp and extend it.
(function(S) {

    var P = S.prototype = new EventEmitter();

    P.sendCommand = function(cmd, callback) {

		// get id...
		cmd.id = uuid().toString();

		if (callback) {
			this.observer.observe(cmd.id, callback);
		}

		this.emit('commands', cmd);

    };
    
})(Hub);

if (!hubInstance) { // just to be shure...
	hubInstance = new Hub();
}

module.exports = hubInstance;