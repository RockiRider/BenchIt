const express = require('express');
const path = require('path');
const http = require("http");
const WebSocket = require('ws');
const event = require('events');
const store = require('../comp/storeMethods');

// @ts-ignore
const ee = new event.EventEmitter();

let latestData = null;

class LocalServer {
    constructor(htmlPage) {
        this.currentServer = null;
        this.port = 52999;
        this._isDestroyed = false;
        this._wss = null;
        this.html = htmlPage;
        //this.extensionUri = extensionUri;
    }
    async createServer() {

        if (this.isDestroyed() || this.isReady()) {
            return;
        }

        const app = express();

        const server = http.createServer(app);
        this.currentServer = server;
        const wss = new WebSocket.Server({ server });
        this._wss = wss;
        app.use(express.static(path.join(__dirname,'../../out/compiled')));
        
        
        app.get('/', (req, res) => {
            res.send(this.html);
        });

        wss.on('connection', (ws) => {
            //connection is up, let's add a simple simple event
            ws.on('message', (message) => {
                if(message == 'requesting'){
                    console.log("Requested Full DB");
                    ws.send(JSON.stringify({type:'load-save',data: store.getStore()}));
                }
            });
            ee.on('message', function(){
                ws.send(JSON.stringify(latestData));
                console.log("Event - Sent Message");
            });
        });
        
        server.listen(this.port,()=>{
            console.log(`Server app listening at http://localhost:${this.port}`)
        })
    }
    destroy() {
        if (this.isDestroyed()) {
            return;
        }
        if (this.currentServer && this.isReady()) {
            this.currentServer.close();
        }
        this.currentServer = null;
        this._wss = null;
        this.port = null;
        this._isDestroyed = true;
    }
    isReady() {
        return !!this.currentServer && this.currentServer.listening;
    }
    isDestroyed() {
        return this._isDestroyed;
    }
    handleMsg(msg){
        latestData = msg;
        ee.emit('message');
    }


}
//TODO: Function to send DB via websockets onMount!!!
//TODO: Integrate Headless Chrome Inside VSCode
//TODO: Run Web Worker inside Svelte


LocalServer.port = 52999;

module.exports = {
    // @ts-ignore
    LocalServer
}