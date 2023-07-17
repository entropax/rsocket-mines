import json
import uuid
import logging
from dataclasses import dataclass, field
from datetime import timedelta
from typing import Optional, Awaitable, Dict
from weakref import WeakValueDictionary

from rsocket.extensions.authentication import Authentication, AuthenticationSimple
from rsocket.extensions.composite_metadata import CompositeMetadata
from rsocket.helpers import create_future, utf8_decode, create_response
from rsocket.frame_helpers import ensure_bytes
from rsocket.payload import Payload
from rsocket.routing.request_router import RequestRouter
from rsocket.routing.routing_request_handler import RoutingRequestHandler

from response_channel import response_stream_1, LoggingSubscriber
from response_stream import response_stream_2
from data_fixtures import large_data1


class SessionId(str):
    pass

@dataclass()
class UserSessionData:
    username: str
    password: str
    session_id: SessionId

@dataclass(frozen=True)
class AppData:
    user_session_by_id: Dict[SessionId, UserSessionData] = field(default_factory=WeakValueDictionary)

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
                    if username == self._session.username and password != self._session.password:
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
                if username and password:
                    logging.info('RUN LOGIN')
                    session_id = SessionId(uuid.uuid4())
                    self._session = UserSessionData(username, password, session_id)
                    app_data.user_session_by_id[session_id] = self._session
                    return create_response(ensure_bytes('{"message": "Welcome to chat, session_id=", "status": true}'))

            return create_response(ensure_bytes('{"message": "You not specify login with pass", "status": "error"}'))

        @router.response('echo')
        async def echo(payload: Payload) -> Awaitable[Payload]:
            username = self._session.username
            data = utf8_decode(payload.data)
            return create_response(ensure_bytes(f'Welcome to chat, {username} you send MSG: {data}'))


        @router.response('single_request')
        async def single_request_response(payload, composite_metadata):
            logging.info('Got single request')
            return create_future(Payload(b'single_response'))

        @router.response('last_fnf')
        async def get_last_fnf():
            logging.info('Got single request')
            return create_future(Payload(storage.last_fire_and_forget))

        @router.response('last_metadata_push')
        async def get_last_metadata_push():
            logging.info('Got single request')
            return create_future(Payload(storage.last_metadata_push))

        @router.response('large_data')
        async def get_large_data():
            return create_future(Payload(large_data1))

        @router.response('large_request')
        async def get_large_data_request(payload: Payload):
            return create_future(Payload(payload.data))

        @router.stream('stream')
        async def stream_response(payload, composite_metadata):
            logging.info('Got stream request')
            return response_stream_1()

        @router.fire_and_forget('no_response')
        async def no_response(payload: Payload, composite_metadata):
            storage.last_fire_and_forget = payload.data
            logging.info('No response sent to client')

        @router.metadata_push('metadata_push')
        async def metadata_push(payload: Payload, composite_metadata: CompositeMetadata):
            for item in composite_metadata.items:
                if item.encoding == b'text/plain':
                    storage.last_metadata_push = item.content

        @router.channel('channel')
        async def channel_response(payload, composite_metadata):
            logging.info('Got channel request')
            subscriber = LoggingSubscriber()
            channel = response_stream_1(local_subscriber=subscriber)
            return channel, subscriber

        @router.stream('slow_stream')
        async def stream_slow(**kwargs):
            logging.info('Got slow stream request')
            return response_stream_2(delay_between_messages=timedelta(seconds=2))

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