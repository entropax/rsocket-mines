import ssl
import asyncio
import logging

from aiohttp import web

from rsocket.rsocket_server import RSocketServer
from rsocket.transports.aiohttp_websocket import TransportAioHttpWebsocket, websocket_handler_factory
from rsocket.transports.tcp import TransportTCP

from settings import FRAGMENT_SIZE_BYTES
from handlers import CustomAppHandler
from middleware import session_middleware
from cert_generator import generate_certificate_and_key


class Server:
    handler_factory = CustomAppHandler.handler_factory

    def handle_client(self, reader, writer):
        RSocketServer(TransportTCP(reader, writer), handler_factory=self.handler_factory)


    def websocket_handler_factory(self, on_server_create=None, **kwargs):
        async def websocket_handler(request):
            ws = web.WebSocketResponse()
            await ws.prepare(request)
            transport = TransportAioHttpWebsocket(ws)
            server = RSocketServer(transport, **kwargs)

            # May not - ?
            if on_server_create is not None:
                on_server_create(server)

            await transport.handle_incoming_ws_messages()
            return ws
        return websocket_handler

    async def start(self, with_ssl: bool = False, port: int = 9090, transport: str = 'ws'):
        logging.basicConfig(level=logging.DEBUG)

        logging.info(f'Starting {transport} server at localhost:{port}')

        if transport in ['ws', 'wss']:
            app = web.Application()
            app.middlewares.append(session_middleware)
            app.add_routes([
                web.get('/',
                        self.websocket_handler_factory(handler_factory=self.handler_factory,
                                                       fragment_size_bytes=FRAGMENT_SIZE_BYTES))])

            with generate_certificate_and_key() as (certificate_path, key_path):
                if with_ssl:
                    ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)

                    logging.info('Certificate %s', certificate_path)
                    logging.info('Private-key %s', key_path)

                    ssl_context.load_cert_chain(certificate_path, key_path)
                else:
                    ssl_context = None

                await web._run_app(app, port=port, ssl_context=ssl_context)
        elif transport == 'tcp':

            server = await asyncio.start_server(self.handle_client, 'localhost', port)

            async with server:
                await server.serve_forever()
        else:
            raise Exception(f'Unsupported transport {transport}')
