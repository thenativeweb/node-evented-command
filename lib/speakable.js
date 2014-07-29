'use strict';

var dotty = require('dotty');

module.exports = function(hub) {


  function Speakable (commandname) {
    this.commandname = commandname;
    this.data = {};
  }

  Speakable.prototype = {
    with: function(data) {
      this.data = data;

      return this;
    },

    for: function (aggregatename) {
      this.aggregatename = aggregatename;

      return this;
    },

    instance: function (aggregateId) {
      this.aggregateId = aggregateId;

      return this;
    },

    in: function (contextname) {
      this.contextname = contextname;

      return this;
    },

    go: function (callback) {
      dotty.put(this.data, hub.definitions.command.name, this.commandname);
      
      if (this.aggregatename) {
        dotty.put(this.data, hub.definitions.command.aggregate, this.aggregatename);
      }

      if (this.aggregateId) {
        dotty.put(this.data, hub.definitions.command.aggregateId, this.aggregateId);
      }

      if (this.contextname) {
        dotty.put(this.data, hub.definitions.command.context, this.contextname);
      }

      (new hub.Command(this.data)).emit(callback);
    }
  };


  return {
    send: function (commandname) {
      return new Speakable(commandname);
    }
  };
};