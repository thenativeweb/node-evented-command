'use strict';

var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    dotty = require('dotty'),
    uuid = require('node-uuid').v4,
    command = require('./command'),
    observer = require('./observer'),
    speakable = require('./speakable');

function Hub(observerTimeout) {
  EventEmitter.call(this);

  this.definitions = {
    command: {
      id: 'id',
      name: 'name',
      context: 'context.name',
      aggregate: 'aggregate.name',
      aggregateId: 'aggregate.id'
    },
    event: {
      correlationId: 'correlationId',
      id: 'id',
      name: 'name',
      context: 'context.name',
      aggregate: 'aggregate.name',
      aggregateId: 'aggregate.id'
    }
  };

  observerTimeout = observerTimeout || 10 * 60 * 1000;

  this.Command = command(this);

  this.observer = observer(observerTimeout);

  this.send = speakable(this).send;

  var self = this;

  this.on('event', function(evt) {
    var correlationId = dotty.get(evt, self.definitions.event.correlationId);

    var eventname = dotty.get(evt, self.definitions.event.name);

    var cmdCallback = self.observer.getPendingCommand(correlationId, eventname);

    if (cmdCallback) {
      cmdCallback(evt);
    }
  });
}

util.inherits(Hub, EventEmitter);

_.extend(Hub.prototype, {

  getNewId: function (callback) {
    callback(null, uuid().toString());
  },

  defineCommand: function (definition) {
    this.definitions.command = _.defaults(definition, this.definitions.command);
    return this;
  },

  defineEvent: function (definition) {
    this.definitions.event = _.defaults(definition, this.definitions.event);
    return this;
  },

  idGenerator: function (fn) {
    if (fn.length === 0) {
      fn = _.wrap(fn, function(func, callback) {
        callback(null, func());
      });
    }

    this.getNewId = fn;

    return this;
  },

  observe: function (cmd, callback) {
    var id = dotty.get(cmd, this.definitions.command.id);

    if (_.isFunction(callback)) {
      this.observer.observe(id, callback);
      return;
    }

    var self = this;

    if (_.isObject(callback)) {
      _.each(_.keys(callback), function (eventname) {
        self.observer.observe(id, eventname, callback[eventname]);
      });

      return;
    }

    this.emit(new Error('Error in command callback! Please pass a function or an object with keys as event name and value as function!'));
  },

  sendCommand: function(cmd, callback) {
    var self = this;

    if (!dotty.exists(cmd, this.definitions.command.id)) {
      this.getNewId(function (err, id) {
        if (err) {
          if (callback) callback(err);
          self.emit('error', err);
          return;
        }

        dotty.put(cmd, self.definitions.command.id, id);

        self.observe(cmd, callback);

        self.emit('command', cmd);
      });

      return;
    }

    this.observe(cmd, callback);

    this.emit('command', cmd);
  }

});

module.exports = Hub;
