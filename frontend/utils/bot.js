export function redner_level_2_bot() {
    var chat_elements = document.getElementsByClassName('bottom');
    for (var i = 0; i < chat_elements.length; i++) {
        chat_elements[i].removeAttribute('hidden');
    }

    document.getElementById('chat-btn').addEventListener('click', function() {
        // Handle 'chat_btn' click event
    });;
}
