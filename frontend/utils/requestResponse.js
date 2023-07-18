import {
  encodeCompositeMetadata,
  encodeSimpleAuthMetadata,
  encodeRoute,
  WellKnownMimeType as KnownMimeType,
} from "rsocket-composite-metadata";

import { Logger } from "./logger.js";

const MESSAGE_RSOCKET_ROUTING = KnownMimeType.MESSAGE_RSOCKET_ROUTING;
const MESSAGE_RSOCKET_AUTH = KnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION;

export async function requestResponse(rsocket, route, data, user, pass) {
  return new Promise((resolve, reject) => {
    return rsocket.requestResponse(
      {
        data: Buffer.from(data),
        metadata: encodeCompositeMetadata([
                 // [TEXT_PLAIN, Buffer.from('TEST Hello World')],
                 [MESSAGE_RSOCKET_ROUTING, encodeRoute(route)],
                 [MESSAGE_RSOCKET_AUTH, encodeSimpleAuthMetadata(user, pass)],
          ]),
      },
      {
        onError: (e) => {
          // reject(e);
          // console.log(e);
          resolve({"data": e});
          // resolve(null);
        },
        onNext: (payload, isComplete) => {
          Logger.info(
            `requestResponse onNext payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`
          );
          resolve(payload);
        },
        onComplete: () => {
          Logger.info(`requestResponse onComplete`);
          resolve(null);
        },
        onExtension: () => {},
      }
    );
  });
}
