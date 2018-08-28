import {Context} from '../index';
import {MESSAGE_EVENT} from './event';

export default {
    [MESSAGE_EVENT.S_MESSAGE]: (data:string, socket:SocketIO.Socket, context:Context) => {
        console.log('chat message: ' + data);
        var userName = context['sockets'][socket.id]['userName'];
        var roomName = context['sockets'][socket.id]['roomName'];
        var reply = {
            userName: userName,
            message: data
        };
        socket.emit('c-chat-message', reply);
        if (roomName != undefined) {
            console.log("server reply in " + roomName + JSON.stringify(reply))
            socket.broadcast.to(roomName).broadcast.emit('c-chat-message', reply);
        } else {
            console.log("server reply " + JSON.stringify(reply))
            socket.broadcast.emit('c-chat-message', reply);
        }
    },
}