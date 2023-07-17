import { RSocketConnector, JsonSerializers} from "rsocket-core";
import { WebsocketClientTransport } from "rsocket-websocket-client";
import {
  encodeCompositeMetadata,
  encodeSimpleAuthMetadata,
  encodeRoute,
  WellKnownMimeType as KnownMimeType,
} from "rsocket-composite-metadata";
import { Logger } from "./utils/logger.js";
import { makeConnector } from "./utils/connector.js";
import { requestResponse } from "./utils/requestResponse.js";
import {
    handleLoginFormSubmit,
    handleLogoutFormSubmit,
    handleMessageFormSubmit
} from './utils/handlers.js';
import { setSessionStorage } from './utils/sessionStorage.js';

// CONSTANTS supstitute from ENV with webpack builder
const URL = process.env.URL;
const KEEPALIVE = process.env.KEEPALIVE;
const LIFETIME = process.env.LIFETIME;


async function main() {
    // set dummpy creds
    setSessionStorage()

    const connector = makeConnector(
        KEEPALIVE,
        LIFETIME,
        URL);

    const rsocket = await connector.connect();

    // only for DEBUG
    const socketStatus = document.querySelector('#socket_status p');
    socketStatus.innerText = "Rsocket established on: " + URL;

    // Form event handlers
    document.querySelector('#loginForm').addEventListener(
        'submit', async (event) => handleLoginFormSubmit(event, rsocket));
    document.querySelector('#logoutButton').addEventListener(
        'click', async (event) => handleLogoutFormSubmit(event, rsocket));
    document.querySelector('#messageForm').addEventListener(
        'submit', async (event) => handleMessageFormSubmit(event, rsocket));
}

main().catch(error => {
  console.error('We have some error: ', error);
});
