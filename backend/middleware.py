from aiohttp import web


@web.middleware
async def session_middleware(request, handler):
    """ Middleware for all income connection TODO """
    # Create the session here
    # This would run before each request is handled
    # session(*request.connection)
    return await handler(request)
