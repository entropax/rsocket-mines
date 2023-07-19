import {
  encodeCompositeMetadata,
  encodeSimpleAuthMetadata,
  encodeRoute,
  WellKnownMimeType as KnownMimeType,
  // TEXT_PLAIN,
} from "rsocket-composite-metadata";

import { Logger } from "./logger.js";

const MESSAGE_RSOCKET_ROUTING = KnownMimeType.MESSAGE_RSOCKET_ROUTING;
const MESSAGE_RSOCKET_AUTH = KnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION;

export async function requestStream(rsocket, route, user, pass) {
  return new Promise((resolve, reject) => {
    let chatBody = document.querySelector('#chatBody');
    let payloadsReceived = 0;
    const maxPayloads = 10;
    const requester = rsocket.requestStream(
      {
        data: Buffer.from("Give me all!"),
        metadata: encodeCompositeMetadata([
            [MESSAGE_RSOCKET_ROUTING, encodeRoute(route)],
            [MESSAGE_RSOCKET_AUTH, encodeSimpleAuthMetadata(user, pass)],
        ]),

      },
      10, // request(N)
      {
        onError: (e) => reject(e),
        onNext: (payload, isComplete) => {
          Logger.info(
            `[client] payload[data: ${payload.data}; metadata: ${payload.metadata}]|isComplete: ${isComplete}`
          );
          if (payload.data != 'Empty') {
          const messageElement = document.createElement('p');
          messageElement.innerText = payload.data;
          chatBody.appendChild(messageElement);
          chatBody.scrollTop = chatBody.scrollHeight;}

          payloadsReceived++;

          // request 5 more payloads every 5th payload, until a max total payloads received
          // if (payloadsReceived % 2 == 0 && payloadsReceived < maxPayloads) {
            // requester.request(2);
          if (payloadsReceived > 9){
          requester.request(10);
          payloadsReceived = 0;}
          // } else if (payloadsReceived >= maxPayloads) {
          //   requester.cancel();
          //   setTimeout(() => {
          //     resolve(null);
          //   });
          // }

          if (isComplete) {
            resolve(null);
          }
        },
        oncomplete: () => {
          resolve(null);
        },
        onExtension: () => {},
      }
    );
  });
}
