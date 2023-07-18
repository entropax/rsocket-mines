import asyncio

# import asyncclick as click
from server import Server
from utils.storage import AppData


class MinesweepersBackend:
    def __init__(self, storage: AppData, server: Server) -> None:
        self.storage = storage
        self.server = server

    # @click.command()
    # @click.option('--port', help='Port to listen on', default=9090, type=int)
    # @click.option('--with-ssl', is_flag=True, help='Enable SSL mode', default=False, type=bool)
    # @click.option('--transport', is_flag=False, default='ws', type=str)
    async def start(self):
        await self.server.start()


if __name__ == '__main__':
    app = MinesweepersBackend(
        AppData(),
        Server()
    )
    asyncio.run(app.start())
