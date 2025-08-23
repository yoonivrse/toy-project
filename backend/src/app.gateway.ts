import { WebSocketServer, WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";


@WebSocketGateway({ 
    namespace: 'chat',
    cors: {
        origin:'http://localhost:3000',
        credentials: 'true',
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    
    handleDisconnect(client: any) {
        console.log("client disconnect");
        console.log(client.id);
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('client connected');
        console.log(client.id);
    }

    afterInit() {
        console.log("server initialized");
    }
    
    @WebSocketServer() server: Server;

    @SubscribeMessage('message')
    handleMessage(socket: Socket, data: any): void {
        const { message, nickname } = data;
        socket.broadcast.emit('message', { message: `${nickname}: ${message}`});
    }
}

@WebSocketGateway({ 
    namespace: 'room',
    cors: {
        origin:'http://localhost:3000',
        credentials: 'true',
    }
})
export class RoomGateway{
    constructor(private readonly chatGateway: ChatGateway){}

    rooms = [];

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('getRooms')
    getRooms(@ConnectedSocket() socket: Socket)
    {
        this.server.emit('rooms', this.rooms);0
    }

    @SubscribeMessage('createRoom')
    handleMessage(@MessageBody() data){
        const { nickname, room } = data;
        this.chatGateway.server.emit('notice', { message: `${nickname}님이 ${room}방을 만들었습니다. `,});
        this.rooms.push(room);
        this.server.emit('rooms', this.rooms);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(socket: Socket, data){
        const { nickname, room, toLeaveRoom } = data;
        console.log(data);
        socket.leave(toLeaveRoom);
        this.chatGateway.server.emit('notice',{ message: `${nickname}님이 ${room}방에 입장했습니다.`})
        socket.join(room);
    }

    @SubscribeMessage('message')
    handleMessageToRoom(socket:Socket, data){
        const { nickname, room, message } = data;
        console.log(data);
        socket.broadcast.to(room).emit('message',{
            message:`${nickname}: ${message}`,
        });
    }
}