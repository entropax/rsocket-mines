// formHandlers
import { requestResponse } from "./requestResponse.js";


export const handleLoginFormSubmit = async (event, rsocket) => {
  event.preventDefault();
  let pass = document.getElementById('passwordInput').value;
  let user = document.getElementById('usernameInput').value;
  let data = JSON.stringify({"username": user, "password": pass});
  let login_output = document.querySelector('#login_output p');
  let response = await requestResponse(rsocket, 'login', data, user, pass);
  login_output.innerText = response.data;

  // let stringData = new TextDecoder().decode(response.data);
  let jsonData = JSON.parse(response.data);
  let status = jsonData.status;

  if(status === true) {
    // сохранение значения в сессионном хранилище
    sessionStorage.setItem('user', user);
    sessionStorage.setItem('pass', pass);
  }
};

export const handleLogoutFormSubmit = async (event, rsocket) => {
  event.preventDefault();
  let user = sessionStorage.getItem('user');
  let pass = sessionStorage.getItem('pass');
  let response = await requestResponse(rsocket, 'logout', '', user, pass);

  // let stringData = new TextDecoder().decode(response.data);
  // let jsonData = JSON.parse(stringData);
  // let status = jsonData.status;
  let status = new TextDecoder().decode(response.data);

  if(status === 'success') {
    // сохранение значения в сессионном хранилище
    sessionStorage.setItem('user', undefined);
    sessionStorage.setItem('pass', undefined);
    // sessionStorage.removeItem('user');
    // sessionStorage.removeItem('pass');
    document.querySelector('#message').innerText = "User has logged out";
  }
};

export const handleMessageFormSubmit = async (event, rsocket) => {
  event.preventDefault();
  let user = sessionStorage.getItem('user');
  let pass = sessionStorage.getItem('pass');
  let messageInput = document.getElementById('messageInput').value;
  let message_output = document.querySelector('#message_output p');
  let response = await requestResponse(rsocket, 'echo', messageInput, user, pass);
  message_output.innerText = "Last response message:\n" + response.data;
};