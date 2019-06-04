const MoleTransportServer = require('mole-rpc/MoleServer');
const TransportServer = require('../TransportServer');
const IPCServer = require('../IPCServer');

let socket = 'mole-ipc-server';

let ipcServer = new IPCServer(socket);
let sTransport = new TransportServer({ ipcServer });
let server = new MoleTransportServer({ transports : [ sTransport ] });

ipcServer.start();
server.expose(Math);
server.run();

ipcServer.on('start', () => {
    console.log('IPC server started');
});
