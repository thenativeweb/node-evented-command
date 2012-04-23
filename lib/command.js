//     lib/command.js v0.1.1
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

// ## Command
var Command = function(data) {

	this.data = data;

};

Command.prototype = {

	// __emit:__ sends this command to the hub.
    // 
    // `this.emit(callback)`
    //
    // - __callback:__ `function(event){}` [optional]
	emit: function(callback) {

		this.hub.sendCommand(this.data, callback);

	}

};

Command.create = function(hub) {

	var NewCommand = function(data) {
		this.data = data;
	};

	for (var member in Command) {
		NewCommand[member] = Command[member];
	}

	for (var pmember in Command.prototype) {
		NewCommand.prototype[pmember] = Command.prototype[pmember];
	}

	NewCommand.prototype.hub = hub;
	return NewCommand;

};

module.exports = Command.create(require('./hub'));