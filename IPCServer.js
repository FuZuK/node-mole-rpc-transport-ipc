const RawIPC = require('node-ipc').IPC;
const EventsEmitter = require('events');

class IPCServer extends EventsEmitter {
	constructor(serverId) {
		super();

		this.serverId = serverId;

		this.initIPC();
	}

	/*
	 Initialize the IPC
	 @return void
	*/
	initIPC() {
		this.ipc = new RawIPC;
		this.ipc.config.id = this.serverId;
		this.ipc.config.silent = true;
	}

	/*
	 Emit event to the socket
	 @return void
	*/
	send(socket, event, data) {
		this.ipc.server.emit(socket, event, data);
	}

	/*
	 Start the IPC server
	 @return void
	*/
	start() {
		this.ipc.serve(() => {
			this.emit('start');
		});
		this.ipc.server.start();
	}

	/*
	 Listen for the event
	 @return void
	*/
	listen(event) {
		this.ipc.server.on(event, (data, socket) => {
			this.emit(event, data, socket);
		});
	}

	/*
	 Stop the IPC server
	*/
	stop() {
		this.ipc.server.stop();
	}
}

module.exports = IPCServer;
