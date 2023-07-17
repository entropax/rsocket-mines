import { RSocketConnector, JsonSerializers} from "rsocket-core";
import { WebsocketClientTransport } from "rsocket-websocket-client";
import {
  encodeCompositeMetadata,
  encodeSimpleAuthMetadata,
  encodeRoute,
  WellKnownMimeType as KnownMimeType,
} from "rsocket-composite-metadata";


// CONSTANTS TODO move to separate file or settings.file like backend
const MESSAGE_RSOCKET_ROUTING = KnownMimeType.MESSAGE_RSOCKET_ROUTING;
const MESSAGE_RSOCKET_AUTH = KnownMimeType.MESSAGE_RSOCKET_AUTHENTICATION;
const COMPOSITE_METADATA = KnownMimeType.MESSAGE_RSOCKET_COMPOSITE_METADATA;
const TEXT_PLAIN = KnownMimeType.TEXT_PLAIN;

const url = "ws://localhost:9000";
const keepAlive = 60000;
const lifetime = 180000;
const dataMimeType = "application/octet-stream";
// const metadataMimeType = MESSAGE_RSOCKET_COMPOSITE_METADATA.string


// set dummpy creds
sessionStorage.setItem('user', undefined);
sessionStorage.setItem('pass', undefined);

// Logger class for console.log() in browser
// TODO separate from app.js
class Logger {
  static info(message, ...rest) {
    const date = new Date()
      .toISOString()
      .replace(/T/, " ") // replace T with a space
      .replace(/\..+/, ""); // delete the dot and everything after;
    return console.log(`[${date}] ${message}`, ...rest);
  }

  static error(message, ...rest) {
    const date = new Date()
      .toISOString()
      .replace(/T/, " ") // replace T with a space
      .replace(/\..+/, ""); // delete the dot and everything after;
    return console.error(`[${date}] ${message}`, ...rest);
  }
}


// create main websocket transport for Rsocket protocol
function makeConnector() {
  console.log(`Creating connector to rsocket`);
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

// function createRoute(route) {
//   let compositeMetaData = undefined;
//   if (route) {
//     const encodedRoute = encodeRoute(route);

//     const map = new Map();
//     map.set(MESSAGE_RSOCKET_ROUTING, encodedRoute);
//     compositeMetaData = encodeCompositeMetadata(map);
//   }
//   console.log("COMPOSITE METADATA:", compositeMetaData)
//   return compositeMetaData;
// };

// Select the <p> element from socket status field
const socketStatus = document.querySelector('#socket_status p');
socketStatus.innerText = "Create a websocket and rsocket connection:";

const connector = makeConnector();
const rsocket = await connector.connect();

// only for DEBUG
await new Promise(r => setTimeout(r, 1000));
socketStatus.innerText = socketStatus.innerText + " work";
await new Promise(r => setTimeout(r, 500));
socketStatus.innerText = socketStatus.innerText + " work";
await new Promise(r => setTimeout(r, 500));
socketStatus.innerText = socketStatus.innerText + " work";
await new Promise(r => setTimeout(r, 500));
socketStatus.innerText = "Rsocket established on: " + url;



async function requestResponse(rsocket, route, data, user, pass) {
  return new Promise((resolve, reject) => {
    return rsocket.requestResponse(
      {
        data: Buffer.from(data),
        metadata: encodeCompositeMetadata([
                 [TEXT_PLAIN, Buffer.from('TEST Hello World')],
                 [MESSAGE_RSOCKET_ROUTING, encodeRoute(route)],
                 [MESSAGE_RSOCKET_AUTH, encodeSimpleAuthMetadata(user, pass)],
          ]),
      },
      {
        onError: (e) => {
          // reject(e);
          console.log(e);
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


// Form event handlers
document.querySelector('#loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  let pass = document.getElementById('passwordInput').value;
  let user = document.getElementById('usernameInput').value;
  let data = JSON.stringify({"username": user, "password": pass});
  let login_output = document.querySelector('#login_output p');
  let response = await requestResponse(rsocket, 'login', data, user, pass);
  login_output.innerText = response.data;

  let stringData = new TextDecoder().decode(response.data);
  let jsonData = JSON.parse(stringData);
  let status = jsonData.status;

  if(status === true) {
    // сохранение значения в сессионном хранилище
    sessionStorage.setItem('user', user);
    sessionStorage.setItem('pass', pass);
}

});

document.querySelector('#messageForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  let user = sessionStorage.getItem('user');
  let pass = sessionStorage.getItem('pass');
  console.log('jeroifjreoifj_____________*')
  console.log(user)
  console.log(pass)
  console.log('jeroifjreoifj_____________*')
  let messageInput = document.getElementById('messageInput').value;
  let message_output = document.querySelector('#message_output p');
  let response = await requestResponse(rsocket, 'echo', messageInput, user, pass);
  message_output.innerText = "Last response message:\n" + response.data;
});

document.querySelector('#logoutButton').
  addEventListener('click', async (event) => {
  let user = sessionStorage.getItem('user');
  let pass = sessionStorage.getItem('pass');
  let response = await requestResponse(rsocket, 'logout', '', user, pass);

  // let stringData = new TextDecoder().decode(response.data);
  // let jsonData = JSON.parse(stringData);
  // let status = jsonData.status;
  let status = new TextDecoder().decode(response.data);
  console.log('jeroifjreoifj_____________*')
  console.log(status)
  console.log('jeroifjreoifj_____________*')

  if(status === 'success') {
    // сохранение значения в сессионном хранилище
    console.log('jeroifjreoifj_____________*')
    console.log('HUEEYY')
    console.log('jeroifjreoifj_____________*')
    sessionStorage.setItem('user', undefined);
    sessionStorage.setItem('pass', undefined);
    // sessionStorage.removeItem('user');
    // sessionStorage.removeItem('pass');
    document.querySelector('#message').innerText = "User has logged out";
  }


});
// OLD PROTOTYPE
// await main()
//   // .then(() => exit())
//   .catch((error) => {
//     console.error(error);
//     // exit(1); process.exit work only for NodeJS
//   });
