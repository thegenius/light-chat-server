import * as http from 'http';
import SocketIO from 'socket.io';
import room from './modules/room';
import login from './modules/login';
import message from './modules/message';
import {ROOM_EVENT, LOGIN_EVENT, CONNECTION_EVENT} from './modules/event';

interface LoginInfo {
    num: number;
    users: any;
};

export interface Context {
    sockets: any;
    login: LoginInfo;
    rooms: any;
}

class ChatServer {
    server: http.Server;
    io: SocketIO.Server;
    context: Context;
    constructor() {
        this.server = http.createServer();
        this.io = SocketIO(this.server);
        this.context = {
            sockets: {},
            login: {
                num: 0,
                users: {},
            },
            rooms: {},
        }
        const self = this;
        this.io.on(CONNECTION_EVENT.S_CONNECTION, function (socket: SocketIO.Socket) {

            console.log('new connection ...')
            socket.emit('news', 'hello this is socket.io');
            console.log("context: " + JSON.stringify(self.context));
            self.context.sockets[socket.id] = {};
            console.log("context: " + JSON.stringify(self.context));

            self.useModule(socket, room);
            self.useModule(socket, login);
            self.useModule(socket, message);

            socket.on(CONNECTION_EVENT.S_DISCONNECT, () => {
                console.log(socket.id + " disconnect ...");
                var socketInfo = self.context.sockets[socket.id];
                var userName = socketInfo['userName'];
                var roomName = socketInfo['roomName'];
                const roomHandler: any = room;
                const loginHandler: any = login;
                roomHandler[ROOM_EVENT.S_LEAVE_ROOM](userName, roomName, socket, self.context);
                loginHandler[LOGIN_EVENT.S_LOGOUT](userName, socket, self.context);
                delete self.context.sockets[socket.id];
                console.log("context: " + JSON.stringify(self.context));
            });

        });
        this.server.listen(3000);
    }

    useModule(socket:SocketIO.Socket, funcMap: any) {
        for (var key in funcMap) {
            socket.on(key, this.useFunction(funcMap[key], socket, this.context));
        }
    }

    useFunction(func: Function, socket:SocketIO.Socket, context:Context) {
        return function(...args: any[]) {
            return func(...args, socket, context);
        }
    };
}

const app = new ChatServer();