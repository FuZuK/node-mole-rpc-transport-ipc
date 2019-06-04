const RawIPC = require('node-ipc').IPC;
const EventsEmitter = require('events');

class IPCClient extends EventsEmitter {
	constructor(serverId) {
		super();

		this.serverId = serverId;
		this.connection = null;

		this.initIPC();
	}

	/*
	 Initialize the IPC
	 @return void
	*/
	initIPC() {
		this.ipc = new RawIPC;
		this.ipc.config.silent = true;
		this.ipc.config.stopRetrying = 1;
	}

	/*
	 Connect to the IPC server via socket
	 @return void
	*/
	connect() {
		this.ipc.connectTo(this.serverId, () => {
			this.connection = this.ipc.of[this.serverId];
			this.connection.on('connect', () => {
				this.emit('connect');
			});
		});
	}

	/*
	 Emit event with data to the IPC server
	 @return Promise
	*/
	send(event, data) {
		this.connection.emit(event, data);
	}

	/*
	 Listen for the event
	 @return void
	*/
	listen(event) {
		this.connection.on(event, data => {
			this.emit(event, data);
		});
	}

	/*
	 Disconnect from the connected IPC server
	*/
	disconnect() {
		this.ipc.disconnect(this.serverId);
	}
}

module.exports = IPCClient;
