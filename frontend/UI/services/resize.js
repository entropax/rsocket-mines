function resize_level_1() {
    var box1 = document.getElementById('box-1');
    var box2 = document.getElementById('box-2');
    var box9 = document.getElementById('box-9');
    var chatContainer = document.getElementById('chatContainer');

    box1.style.height = '19dvh';
    box2.style.height = '0px';
    box9.style.height = '79dvh'; 

    chatContainer.style.height = '0dvh';

}


function resize_level_2() {
    var box1 = document.getElementById('box-1');
    var box2 = document.getElementById('box-2');
    var box9 = document.getElementById('box-9');
    var chatContainer = document.getElementById('chatContainer');
    var chat_body = document.getElementById('chatBody');

    box1.style.height = '0px';
    box2.style.height = '36px';
    box9.style.height = '0dvh'; 

    chatContainer.style.height = '80dvh';
    chat_body.style.height = '75dvh';
}
