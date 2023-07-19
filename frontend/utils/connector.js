import { RSocketConnector, JsonSerializers} from "rsocket-core";
import { WebsocketClientTransport } from "rsocket-websocket-client";
import {
  encodeCompositeMetadata,
  encodeSimpleAuthMetadata,
  encodeRoute,
  WellKnownMimeType as KnownMimeType,
} from "rsocket-composite-metadata";

const COMPOSITE_METADATA = KnownMimeType.MESSAGE_RSOCKET_COMPOSITE_METADATA;
const dataMimeType = "application/octet-stream";

export function makeConnector(
  keepAlive,
  lifetime,
  url) {
  return new RSocketConnector({
    setup: {
      keepAlive: keepAlive,
      lifetime: lifetime,
      dataMimeType: dataMimeType,
      metadataMimeType: COMPOSITE_METADATA.string,
    },
    // transport: new TcpClientTransport({
    transport: new WebsocketClientTransport({
      // connectionOptions: connectorConnectionOptions,
      url: url,
      wsCreator: (url) => new WebSocket(url),
    }),
  });
};
