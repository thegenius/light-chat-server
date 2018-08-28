import {Context} from '../index';
import {LOGIN_EVENT} from './event';

export default {
    [LOGIN_EVENT.S_LOGIN_STATUS]: (socket:SocketIO.Socket, context:Context) => {
        var loginInfo = context['login'];
        socket.emit('c-login-status', loginInfo);
    },

    [LOGIN_EVENT.S_LOGIN]: (userName:string, options:any, socket:SocketIO.Socket, context:Context) => {
        console.log(userName + " login with -------- " + socket.id);
        var loginInfo = context['login'];
        loginInfo['num'] ++;
        loginInfo['users'][userName] = options;
        var socketInfo = context['sockets'][socket.id];
        socketInfo['userName'] = userName;
        console.log("context :" + JSON.stringify(context));
        socket.emit('c-login', true); 
    },

    [LOGIN_EVENT.S_LOGOUT]: (userName:string, socket:SocketIO.Socket, context:Context) => {
        var loginInfo = context['login'];
        loginInfo['num'] --;
        delete loginInfo['users'][userName];
        console.log("content: " + JSON.stringify(context));
        socket.emit('c-logout', true);
    }
}