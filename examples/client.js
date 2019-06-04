const MoleTransportClient = require('mole-rpc/MoleClient');
const TransportClient = require('../TransportClient');
const IPCClient = require('../IPCClient');

let socket = 'mole-ipc-server';

let ipcClient = new IPCClient(socket);
let cTransport = new TransportClient({ ipcClient });
let client = new MoleTransportClient({ transport : cTransport, requestTimeout : 1000 });

ipcClient.on('connect', async () => {
    console.log('Random number: ' + await client.callMethod('random'));
    console.log('Round: ' + await client.callMethod('round', [ 10.31 ]));

    let batchResults = await client.runBatch([
        [ 'random' ],
        [ 'round', [ 20.5 ] ],
        [ 'abs', [ -10 ] ]
    ]);

    console.log('Batch: ', batchResults);
    ipcClient.disconnect();
});

ipcClient.connect();
