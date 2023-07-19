import {
  encodeCompositeMetadata,
  encodeSimpleAuthMetadata,
  encodeRoute,
  WellKnownMimeType as KnownMimeType,
} from "rsocket-composite-metadata";

import { Logger } from "./logger.js";

const MESSAGE_RSOCKET_ROUTING = KnownMimeType.MESSAGE_RSOCKET_ROUTING;
const MESSAGE_RSOCKET_AUTH = KnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION;

export async function requestFnf(rsocket, route, data, user, pass) {
  return new Promise((resolve, reject) => {
    return rsocket.fireAndForget(
      {
        data: Buffer.from(data),
        metadata: encodeCompositeMetadata([
                 [MESSAGE_RSOCKET_ROUTING, encodeRoute(route)],
                 [MESSAGE_RSOCKET_AUTH, encodeSimpleAuthMetadata(user, pass)],
          ]),

      },
      {
        onError: (e) => {
          reject(e);
        },
        onComplete: () => {
          Logger.info(`requestResponse onComplete`);
          resolve(null);
        },
      }
    );
  });
}
