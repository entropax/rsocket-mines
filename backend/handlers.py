import asyncio
import json
import uuid
import logging
from datetime import timedelta, datetime
from typing import Optional, Awaitable

from rsocket.extensions.authentication import Authentication, AuthenticationSimple
from rsocket.extensions.composite_metadata import CompositeMetadata
from rsocket.helpers import create_future, utf8_decode, create_response
from rsocket.frame_helpers import ensure_bytes
from rsocket.payload import Payload
from rsocket.routing.request_router import RequestRouter
from rsocket.routing.routing_request_handler import RoutingRequestHandler
from rsocket.streams.stream_from_generator import StreamFromGenerator
from rsocket.streams.stream_from_async_generator import StreamFromAsyncGenerator

from utils.storage import AppData, UserSessionData, SessionId
from response_channel import response_stream_1, LoggingSubscriber
from response_stream import response_stream_2
from data_fixtures import large_data1


app_data = AppData()

class CustomAppHandler:
    def __init__(self):
        self._session: Optional[UserSessionData] = None

    @classmethod
    def handler_factory(self):
        return CustomRoutingRequestHandler(CustomAppHandler())

    async def simple_authenticator(self,  route: str, authentication: Authentication):
        if isinstance(authentication, AuthenticationSimple):
            logging.info('RUN AUTHENTICATION')

            if route != 'login':
                if self._session is None:
                    raise Exception('You need login for new session')  # error send to socket like response, it's okey
                else:
                    username = utf8_decode(authentication.username)
                    password = utf8_decode(authentication.password)
                    if username != self._session.username and password != self._session.password:
                        raise Exception('Authentication error')
            logging.info('AUTH ROUTE TO LOGIN')
        else:
            raise Exception('Unsupported authentication')

    def router_factory(self):
        router = RequestRouter()

        @router.response('login')
        async def login(payload: Payload) -> Awaitable[Payload]:
            if payload.data:
                data = json.loads(utf8_decode(payload.data))
                username = data.get('username')
                password = data.get('password')

                if self._session is not None:
                    if self._session.session_id is not None:
                        response = f'{{"message": "You are already logged in!", "status": error}}'.encode()
                        return create_future(Payload(response))

                if username and password:
                    try:
                        for _username, _password in app_data.sessions.items():
                            if _username == username and _password == password:
                                session_id = SessionId(uuid.uuid4())
                                self._session.session_id = session_id
                                app_data.user_session_by_id[session_id] = self._session
                                response = f'{{"message": "Welcome to chat, {session_id=}", "status": true}}'.encode()
                                return create_future(Payload(response))
                        if username in app_data.sessions:
                            response = f'{{"message": "Wrong password", "status": false}}'.encode()
                            return create_future(Payload(response))

                    except TypeError:
                        pass
                    logging.info('RUN LOGIN')
                    session_id = SessionId(uuid.uuid4())
                    self._session = UserSessionData(username, password, session_id, [])
                    app_data.sessions[username] = password
                    app_data.user_session_by_id[session_id] = self._session
                    response = f'{{"message": "Welcome to chat, {session_id=}", "status": true}}'.encode()
                    return create_future(Payload(response))
                else:
                    response = '{"message": "You not specify login with pass", "status": "error"}'.encode()
                    return create_future(Payload(response))

            response = '{"message": "You not specify login with pass", "status": "error"}'.encode()
            return create_future(Payload(response))

        @router.response('logout')
        async def logout(payload: Payload) -> Awaitable[Payload]:
            try:
                self._session.session_id = None
                return create_response(ensure_bytes('success'))

            except Exception as e:
                return create_response(ensure_bytes('{"message": "Login first", "status": "error"}'))

        @router.response('echo')
        async def echo(payload: Payload) -> Awaitable[Payload]:
            username = self._session.username
            data = utf8_decode(payload.data)
            response = f'Welcome to chat, {username} you send MSG: {data}'.encode()
            return create_future(Payload(response))

        @router.fire_and_forget('fnf')
        async def get_fnf_message(payload: Payload, composite_metadata):
            logging.info('Got single message from: user')
            message = json.loads(utf8_decode(payload.data))
            user_id = self._session.session_id
            username = app_data.user_session_by_id[user_id].username
            # кладем всем юзерам
            for session_data in app_data.user_session_by_id.values():
                print(session_data)
                session_data.new_messages.append([username, message['message'], message['time']])

            # storage.last_fire_and_forget = payload.data
            logging.info('No response sent to client')

        @router.stream('chat.messages')
        async def stream_chat(**kwargs):
            user_id = self._session.session_id
            def response_stream(response_count=4, delay_between_messages=timedelta(0), user_id=user_id):
                async def generator(user_id=user_id):
                    current_response = 0
                    # for i in range(response_count):
                    is_complete = False
                    while True:
                        try:
                            if not app_data.user_session_by_id[user_id].new_messages:
                                await asyncio.sleep(0.2)
                                # yield Payload('Empty'.encode('utf-8'), b'metadata'), is_complete
                        except KeyError:
                            await asyncio.sleep(0.2)
                        else:
                            try:
                                while app_data.user_session_by_id[user_id].new_messages:
                                    now = datetime.utcnow()
                                    data = app_data.user_session_by_id[user_id].new_messages.pop(0)
                                    user = data[0]
                                    message = data[1]
                                    time = data[2]
                                    date_object = datetime.strptime(time, "%Y-%m-%dT%H:%M:%S.%fZ")
                                    formatted_time = date_object.strftime("%M:%S.%f")[:-3]
                                    formatted_time_send = now.strftime("%M:%S.%f")[:-3]
                                    # message = app_data.user_session_by_id[user_id].new_messages.pop(0)  # извлекаем первое сообщение и удаляем его из списка
                                    message = f'{user} say: {message}\
                                        ((send:{formatted_time} || receive{formatted_time_send}))'
                                    yield Payload(message.encode('utf-8'), b'metadata'), is_complete
                            except KeyError:
                                await asyncio.sleep(0.2)
                return StreamFromAsyncGenerator(generator, delay_between_messages)

            logging.info('Got stream chat request')
            return response_stream(delay_between_messages=timedelta(seconds=0.25))

        # @router.response('room.create')
        # async def create_room(payload: Payload) -> Awaitable[Payload]:
        #     channel_name = payload.data.decode('utf-8')
        #     ensure_channel_exists(channel_name)
        #     chat_data.channel_users[channel_name].add(self._session.session_id)
        #     return create_response()
        #
        # @router.response('room.join')
        # async def join_room(payload: Payload) -> Awaitable[Payload]:
        #     channel_name = payload.data.decode('utf-8')
        #     ensure_channel_exists(channel_name)
        #     chat_data.channel_users[channel_name].add(self._session.session_id)
        #     return create_response()
        #
        # @router.response('room.leave')
        # async def leave_room(payload: Payload) -> Awaitable[Payload]:
        #     channel_name = payload.data.decode('utf-8')
        #     chat_data.channel_users[channel_name].discard(self._session.session_id)
        #     return create_response()
        #
        # @router.stream('room.users')
        # async def stream_room_users(payload: Payload) -> Publisher:
        #     channel_name = utf8_decode(payload.data)
        #
        #     if channel_name not in chat_data.channel_users:
        #         return EmptyStream()
        #
        #     count = len(chat_data.channel_users[channel_name])
        #     generator = ((Payload(ensure_bytes(find_username_by_session(session_id))), index == count) for
        #                  (index, session_id) in
        #                  enumerate(chat_data.channel_users[channel_name], 1))
        #
        #     return StreamFromGenerator(lambda: generator)
        #
        # @router.stream('room.messages')
        # async def stream_room_messages(payload: Payload) -> Publisher:
        #     channel_name = utf8_decode(payload.data)
        #
        #     if channel_name not in chat_data.channel_users:
        #         return EmptyStream()
        #
        #     count = len(chat_data.channel_users[channel_name])
        #     generator = ((Payload(ensure_bytes(find_username_by_session(session_id))), index == count) for
        #                  (index, session_id) in
        #                  enumerate(chat_data.channel_users[channel_name], 1))
        #
        #     return StreamFromGenerator(lambda: generator)
        #
        # @router.stream('rooms')
        # async def get_rooms() -> Publisher:
        #     count = len(chat_data.channel_messages)
        #     generator = ((Payload(ensure_bytes(channel)), index == count) for (index, channel) in
        #                  enumerate(chat_data.channel_messages.keys(), 1))
        #     return StreamFromGenerator(lambda: generator)



        @router.response('last_fnf')
        async def get_last_fnf():
            logging.info('Got single request')

        @router.response('last_metadata_push')
        async def get_last_metadata_push():
            logging.info('Got single request')
            return create_future(Payload(app_data.last_metadata_push))

        @router.response('large_data')
        async def get_large_data():
            return create_future(Payload(large_data1))

        @router.response('large_request')
        async def get_large_data_request(payload: Payload):
            return create_future(Payload(payload.data))

        @router.stream('stream')
        async def stream_response(payload, composite_metadata):
            print(utf8_decode(payload.data))
            print(composite_metadata.items)
            for i in (composite_metadata.items): print(i)
            logging.info('Got stream request')
            return response_stream_1()

        @router.fire_and_forget('no_response')
        async def no_response(payload: Payload, composite_metadata):
            app_data.last_fire_and_forget = payload.data
            logging.info('No response sent to client')

        @router.metadata_push('metadata_push')
        async def metadata_push(payload: Payload, composite_metadata: CompositeMetadata):
            for item in composite_metadata.items:
                if item.encoding == b'text/plain':
                    app_data.last_metadata_push = item.content

        @router.channel('channel')
        async def channel_response(payload, composite_metadata):
            logging.info('Got channel request')
            subscriber = LoggingSubscriber()
            channel = response_stream_1(local_subscriber=subscriber)
            return channel, subscriber

        @router.stream('slow_stream')
        async def stream_slow(**kwargs):
            logging.info('Got slow stream request')
            return response_stream_2(delay_between_messages=timedelta(seconds=1))

        return router


class CustomRoutingRequestHandler(RoutingRequestHandler):
    def __init__(self, session: CustomAppHandler):
        super().__init__(session.router_factory(), session.simple_authenticator)
        self._session = session

    async def on_setup(self,
                       data_encoding: bytes,
                       metadata_encoding: bytes,
                       payload: Payload):
        await super().on_setup(data_encoding, metadata_encoding, payload)
