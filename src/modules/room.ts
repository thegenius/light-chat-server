import {Context} from '../index';
import {ROOM_EVENT} from './event';

export default {
    [ROOM_EVENT.S_CREATE_ROOM]: (roomName:string, socket:SocketIO.Socket, context:Context) => {
        console.log("create room: " + roomName);
        var roomInfo = context['rooms'];
        roomInfo[roomName] = {};
        socket.emit('c-create-room', true);
    },

    [ROOM_EVENT.S_DELETE_ROOM]: (roomName:string, socket:SocketIO.Socket, context:Context) => {
        console.log('delete room: ' + roomName);
        var roomInfo = context['rooms'];
        delete roomInfo[roomName];
        socket.emit('c-delete-room', true);
    },

    [ROOM_EVENT.S_JOIN_ROOM]: (userName:string, roomName:string, socket:SocketIO.Socket, context:Context) => {
        console.log("join room: " + JSON.stringify(roomName));
        var roomInfo = context['rooms'];
        if (roomInfo.hasOwnProperty(roomName)) {
            var joinRoom = roomInfo[roomName];
            joinRoom[userName] = {};
            console.log("room info: " + JSON.stringify(joinRoom));
            console.log("room size: " + Object.keys(joinRoom).length);
            var socketInfo = context['sockets'][socket.id];
            // if (socketInfo['roomName'] != undefined) {
            //     socket.leave(socketInfo['roomName'])
            // }
            socketInfo['roomName'] = roomName;
            socket.join(roomName);
            socket.emit('c-join-room', true);
        } else {
            socket.emit('c-join-room', false);
        }
    },

    [ROOM_EVENT.S_LEAVE_ROOM]: (userName:string, roomName:string, socket:SocketIO.Socket, context:Context) => {
        console.log("leave room: " + roomName);
        var roomInfo = context['rooms'];
        if (roomInfo.hasOwnProperty(roomName)) {
            var joinRoom = roomInfo[roomName];
            delete joinRoom[userName];
            console.log("room info: " + JSON.stringify(joinRoom));
            socket.leave(roomName);
            socket.emit('c-leave-room', true);
        } else {
            socket.emit('c-leave-room', true);
        }
    },

}