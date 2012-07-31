//     lib/hub.js v0.1.1
//     (c) 2012 Adriano Raiano (adrai); under MIT License

// The hub is the module that have to wire up the commands and events.
//
// __Example:__
//
//      var hub = require('nodeEventedCommand').hub;
//
//      // initialize the hub by passing the function that gets the command id from the event
//      hub.init(
//          function(evt) {
//              var idEndIndex = evt.id.indexOf('_event');
//              var id = evt.id.substring(0, idEndIndex);
//              return id;
//          }
//      );
//
//      // pass in events from your bus
//      bus.on('events', function(data){
//          hub.emit('events', data);
//      });
//
//      // pass commands to bus
//      hub.on('commands', function(data) {
//          bus.emit('commands', data);
//      });

var EventEmitter2 = require('eventemitter2').EventEmitter2
  , uuid = require('./uuid')
  , Observer = require('./observer')
  , Hub
  , hubInstance;


function getNewHub() {
    var hub = new EventEmitter2({
        wildcard: true, // should the event emitter use wildcards.
        delimiter: ':', // the delimiter used to segment namespaces, defaults to `.`.
        maxListeners: 1000 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    hub.observer = new Observer();

    // __init:__ initializes the hub.
    // 
    // `this.init(getCommandIdFunction)`
    //
    // - __getCommandIdFunction:__ `function(event){}`
    hub.init = function(getCommandIdFunction) {
        
        var self = this;

        // listen on events...
        this.on('event:*', function(evt) {

            var eventName = this.event.substr(6);
            
            var commandCallback = self.observer.getPendingCommand(getCommandIdFunction(evt), eventName);

            if (commandCallback) {
                commandCallback(evt);
            }

        });

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
    hub.sendCommand = function(cmd, callback) {

        if (!cmd.id) {
            // get id...
            cmd.id = uuid().toString();
        }

        if (typeof callback === 'function') {
            this.observer.observe(cmd.id, callback);
        } else {
            for(var m in callback) {
                this.observer.observe(cmd.id, m, callback[m]);
            }
        }

        this.emit('commands', cmd);

    };

    return hub;
}


if (!hubInstance) { // just to be shure...
    hubInstance = getNewHub();
}

hubInstance.create = function() {
    return getNewHub();
};

module.exports = hubInstance;