import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

export function addChat() {
    // Получаем ссылку на элемент, в котором будет находиться наш чат
    const chatContainer = document.getElementById('chatContainer');

    // Создаем и настраиваем верхнюю панель
    const chatHeader = document.createElement('div');
    chatHeader.className = 'd-flex justify-content-between align-items-center p-3 bg-light';

    const joinButton = document.createElement('button');
    joinButton.className = 'btn btn-success';
    joinButton.innerText = 'Join';

    const closeButton = document.createElement('button');
    closeButton.className = 'btn btn-danger';
    closeButton.innerText = 'Close';

    chatHeader.appendChild(joinButton);
    chatHeader.appendChild(closeButton);

    // Создаем и настраиваем область чата
    const chatBody = document.createElement('div');
    chatBody.className = 'p-3 bg-white border';
    chatBody.style.height = '300px';
    chatBody.style.overflowY = 'auto';
    chatBody.id = 'chatBody'

    // Добавляем верхнюю панель и область чата в контейнер
    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatBody);

    // Создаем поле для ввода сообщения
    const chatInput = document.createElement('input');
    chatInput.className = 'form-control';
    chatInput.placeholder = 'Type your message here...';
    chatInput.id = 'messageFormSend';

    // Создаем кнопку отправки сообщения
    const sendButton = document.createElement('button');
    sendButton.className = 'btn btn-primary';
    sendButton.innerText = 'Send';
    sendButton.id = 'messageButtonSend';

    // Добавляем поле ввода и кнопку отправки под областью чата
    chatContainer.appendChild(chatInput);
    chatContainer.appendChild(sendButton);
}
