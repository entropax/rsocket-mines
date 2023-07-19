# from datetime import timedelta

from rsocket.payload import Payload
from rsocket.streams.stream_from_generator import StreamFromGenerator
from rsocket.streams.stream_from_async_generator import StreamFromAsyncGenerator


def response_stream_chat(response_count: float(inf), delay_between_messages=timedelta(0)):
    async def message_generator(
            response_count: int = float('inf'),
            delay_between_messages: timedelta = timedelta(0)):
        current_response = 0
        while True:
            try:
                message = await asyncio.wait_for(message_queue.get(), timeout=1.0)
            except asyncio.TimeoutError:
                message = ''
            except Exception as e:
                message = ''

            is_complete = (current_response + 1) == response_count
            yield create_message_payload(message, is_complete)

            if is_complete:
                break

            current_response += 1
            await asyncio.sleep(delay_between_messages.total_seconds())

    return StreamFromAsyncGenerator(message_generator, delay_between_messages)
