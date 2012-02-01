//     lib/command.js v0.0.1
//     (c) 2012 Adriano Raiano (adrai); under MIT License

// This is the wrapper object for the commands.
//
// __Example:__
//
//      var cmd = new Command({
//			command: 'changePerson',
//			payload: {
//				id: 8,
//				name: 'my name'
//			}
//		});
//
//		// emit it
//		cmd.emit();
//
//
//		// if you want to observe the command pass a callback
//		cmd.emit(function(evt) {
//
//		});

var hub = require('./hub')
  , Command;

// ## Command
Command = function(cmd) {

	this.cmd = cmd;

};

Command.prototype = {

	// __emit:__ sends this command to the hub.
    // 
    // `this.emit(callback)`
    //
    // - __callback:__ `function(event){}` [optional]
	emit: function(callback) {

		hub.sendCommand(this.cmd, callback);

	}

};

module.exports = Command;