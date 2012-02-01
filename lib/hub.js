//     lib/hub.js v0.0.1
//     (c) 2012 Adriano Raiano (adrai); under MIT License

// The hub is the module that have to wire up the commands and events.
//
// __Example:__
//
//      var hub = require('nodeEventedCommand').hub;
//
//		// initialize the hub by passing the function that gets the command id from the event
//		hub.init(
//			function(evt) {
//				var idEndIndex = evt.id.indexOf('_event');
//				var id = evt.id.substring(0, idEndIndex);
//				return id;
//			}
//		);
//
//      // pass in events from your bus
//		bus.on('events', function(data){
//			hub.emit('events', data);
//		});
//
//		// pass commands to bus
//		hub.on('commands', function(data) {
//			bus.emit('commands', data);
//		});

var EventEmitter = require('events').EventEmitter
  , uuid = require('./uuid')
  , Observer = require('./observer')
  , Hub
  , hubInstance;

// ## Hub
Hub = function() {

	this.observer = new Observer();

};

// Inherit prototyp and extend it.
(function(S) {

    var P = S.prototype = new EventEmitter();

    // __init:__ initializes the hub.
    // 
    // `this.init(getCommandIdFunction)`
    //
    // - __getCommandIdFunction:__ `function(event){}`
    P.init = function(getCommandIdFunction) {
		
		var self = this;

		// listen on events...
		this.on('events', function(evt) {
			
			var commandCallback = self.observer.getPendingCommand(getCommandIdFunction(evt));

			if (commandCallback) {
				commandCallback(evt);
			}

		});

    };

    // __sendCommand:__ sends a command.
    // 
    // `this.sendCommand(cmd, callback)`
    //
    // - __cmd:__ the command
    // - __callback:__ `function(event){}` [optional]
    P.sendCommand = function(cmd, callback) {

		if (!cmd.id) {
			// get id...
			cmd.id = uuid().toString();
		}

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