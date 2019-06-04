class TransportClient {
	constructor({ ipcClient, topicIn = 'ipc-data-in', topicOut = 'ipc-data-out' }) {
		this.ipcClient = ipcClient;
		this.topicIn = topicIn;
		this.topicOut = topicOut;
	}

	/*
	 Implements mole onData()
	 @return void
	*/
	onData(callback) {
		this.ipcClient.listen(this.topicIn);
		this.ipcClient.on(this.topicIn, data => {
			callback(data);
		});
	}

	/*
	 Implements mole sendData()
	 @return void
	*/
	async sendData(data) {
		return this.ipcClient.send(this.topicOut, data);
	}
}

module.exports = TransportClient;
