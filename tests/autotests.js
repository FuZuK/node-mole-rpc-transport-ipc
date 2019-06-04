const MoleClient = require('mole-rpc/MoleClient');
const MoleClientProxified = require('mole-rpc/MoleClientProxified');
const MoleServer = require('mole-rpc/MoleServer');
const AutoTester = require('mole-rpc/AutoTester');

const TransportClient = require('../TransportClient');
const TransportServer = require('../TransportServer');

const IPCServer = require('../IPCServer');
const IPCClient = require('../IPCClient');

async function main() {
    const socketName = 'node-mole-rpc-transport-ipc';

    const server = await prepareServer(socketName);
    const clients = await prepareClients(socketName);

    const autoTester = new AutoTester({
        server,
        simpleClient: clients.simpleClient,
        proxifiedClient: clients.proxifiedClient
    });

    await autoTester.runAllTests();
}

async function prepareServer(socketName) {
    const ipcServer = new IPCServer(socketName);

    ipcServer.start();

    await waitForEvent(ipcServer, 'start');

    return new MoleServer({
        transports: [
            new TransportServer({
                ipcServer,
                inTopic: 'fromClient1',
                outTopic: 'toClient1'
            }),
            new TransportServer({
                ipcServer,
                inTopic: 'fromClient2',
                outTopic: 'toClient2'
            })
        ]
    });
}

async function prepareClients(socketName) {
    const ipcClient = new IPCClient(socketName);

    ipcClient.connect();

    await waitForEvent(ipcClient, 'connect');

    const simpleClient = new MoleClient({
        requestTimeout: 1000,
        transport: new TransportClient({
            ipcClient,
            inTopic: 'toClient1',
            outTopic: 'fromClient1'
        })
    });

    const proxifiedClient = new MoleClientProxified({
        requestTimeout: 1000,
        transport: new TransportClient({
            ipcClient,
            inTopic: 'toClient2',
            outTopic: 'fromClient2'
        })
    });

    return { simpleClient, proxifiedClient };
}

function waitForEvent(emitter, eventName) {
    return new Promise((resolve, reject) => {
        emitter.on(eventName, resolve);
    });
}

main().then(() => {
    process.exit();
}, console.error);
