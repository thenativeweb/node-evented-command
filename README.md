# Introduction

[![travis](https://img.shields.io/travis/adrai/node-evented-command.svg)](https://travis-ci.org/adrai/node-evented-command) [![npm](https://img.shields.io/npm/v/evented-command.svg)](https://npmjs.org/package/evented-command)

Project goal is to provide a simple command/event handling for evented systems like cqrs.

# Installation

  $ npm install evented-command

# Usage

	var evtCmd = require('evented-command')();

## Define the command structure [optional] 
The values describes the path to that property in the command message.

	evtCmd.defineCommand({
	  id: 'id',                       // optional
	  name: 'name',                   // optional
	  context: 'context.name',        // optional
	  aggregate: 'aggregate.name',    // optional
	  aggregateId: 'aggregate.id'     // optional
	});

## Define the event structure [optional]
The values describes the path to that property in the event message.

	evtCmd.defineEvent({
	  correlationId: 'correlationId', // optional
	  id: 'id',                       // optional
	  name: 'name',                   // optional
	  context: 'context.name',        // optional
	  aggregate: 'aggregate.name',    // optional
	  aggregateId: 'aggregate.id'     // optional
	});

## Define the id generator function [optional]
### you can define a synchronous function

	evtCmd.idGenerator(function() {
	  var id = require('node-uuid').v4().toString();
	  return id;
	});

### or you can define an asynchronous function

	evtCmd.idGenerator(function(callback) {
	  setTimeout(function() {
	    var id = require('node-uuid').v4().toString();
	    callback(null, id);
	  }, 50);
	});

## Wire up commands and events

	// pass in events from your bus
	bus.on('event', function(data){
	  evtCmd.emit('event', data);
	});

	// pass commands to bus
	evtCmd.on('command', function(data) {
	  bus.emit('command', data);
	});

## Send commands

	var cmd = new Command({
		// id: 'my onwn command id', // if you don't pass an id it will generate one, when emitting the command...
    name: 'changePerson',
    payload: {
      name: 'my name'
    },
    aggregate: {
      id: 8,
      name: 'jack'
    },
    context: {
    	name: 'hr'
    }
	});

	// emit it
	cmd.emit();



	// if you want to observe the command pass a callback
	cmd.emit(function(evt) {
		
	});


	// if you want to observe the command that generates any events pass an object like this:
	cmd.emit({

		event1: function(evt) {
			
		},

		event2: function(evt) {
			
		}
		
	});

### Send commands with the speakable api

	evtCmd.send('changePerson')
        .for('person') // aggregate name
        .instance('8') // aggregate id
        .in('hr')			 // context name
        .with({
        	// id: 'my onwn command id', // if you don't pass an id it will generate one, when emitting the command...
          revision: '12',
          payload: {
          	name: 'jack'
          }
        })
        .go(function(evt) {
          console.log('speakable', evt);
        });

  evtCmd.send('multi')
        .for('aggregate')
        .instance('instanceId')
        .in('context')
        .with({
          revision: '43',
          payload: 'data2'
        })
        .go({
          event1: function(evt) {
            console.log('speakable', evt);
          },
          event2: function(evt) {
            console.log('speakable', evt);
          }
        });

# License

Copyright (c) 2014 Adriano Raiano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.