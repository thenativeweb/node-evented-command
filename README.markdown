# Introduction

This project is inspirated by [jamuhl](https://github.com/jamuhl/backbone.CQRS).

Project goal is to provide a simple command/event handling for evented systems like cqrs.

# Installation

    $ npm install nodeEventedCommand

# Simple usage

	// get the hub
	var hub = require('nodeEventedCommand').hub;
	
	// initialize the hub by passing the function that gets the command id from the event
	hub.init(
		function(evt) {
			return evt.commandId;
		}
	);

	// and the command
	var Command = require('nodeEventedCommand').Command;

# Advanced usage with own instance

	// get the hub
	var hub = require('nodeEventedCommand').hub.create();
	
	// initialize the hub by passing the function that gets the command id from the event
	hub.init(
		function(evt) {
			var idEndIndex = evt.id.indexOf('_event');
			var id = evt.id.substring(0, idEndIndex);
			return id;
		}
	);

	// and the command
	var Command = require('nodeEventedCommand').Command.create(hub);

## Wire up commands and events

	// pass in events from your bus
	bus.on('events', function(data){
	    hub.emit('events', data);

	    // use it with wildcards for mulit callback
	    // hub.emit('event:' + data.event, data);
	});

	// pass commands to bus
	hub.on('commands', function(data) {
	    bus.emit('commands', data);
	});

## Send commands

	var cmd = new Command({
	    command: 'changePerson',
	    payload: {
	        id: 8,
	        name: 'my name'
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

# License

Copyright (c) 2012 Adriano Raiano

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