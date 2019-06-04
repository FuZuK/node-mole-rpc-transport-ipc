class TransportServer {
	constructor({ ipcServer, topicIn = 'ipc-data-in', topicOut = 'ipc-data-out' }) {
		this.ipcServer = ipcServer;
		this.topicIn = topicIn;
		this.topicOut = topicOut;
	}

	/*
	 Implements mole onData()
	 @return void
	*/
	onData(callback) {
		this.ipcServer.listen(this.topicOut);
		this.ipcServer.on(this.topicOut, async (data, socket) => {
			let result = await callback(data);
            if (!result) return;
			this.ipcServer.send(socket, this.topicIn, result);
		});
	}
}

module.exports = TransportServer;
