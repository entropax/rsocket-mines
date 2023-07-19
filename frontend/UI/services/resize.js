function resize_level_1() {
    // top
    var box1 = document.getElementById('box-1');
    box1.style.height = '19dvh';
    var head_div = document.getElementById('head_div');
    head_div.style.height = '0dvh'; 
    var box2 = document.getElementById('box-2');
    box2.style.maxHeight = '0px';
    var socket_status = document.getElementById('socket_status');
    socket_status.style.maxHeight = '0px';
    var message_output = document.getElementById('message_output');
    message_output.style.maxHeight = '0px';
    var box3 = document.getElementById('box-3');
    box3.style.maxHeight = '0px';

    // mid
    var box9 = document.getElementById('box-9');
    box9.style.height = '79dvh'; 

    //bot
    var chatContainer = document.getElementById('chatContainer');
    chatContainer.style.height = '0dvh';
}


function resize_level_2() {

    // top
    var box1 = document.getElementById('box-1');
    box1.style.height = '0px';
    var head_div = document.getElementById('head_div');
    head_div.style.height = ''; 
    var box2 = document.getElementById('box-2');
    box2.style.maxHeight = '36px';
    var socket_status = document.getElementById('socket_status');
    socket_status.style.maxHeight = '40px';
    var message_output = document.getElementById('message_output');
    message_output.style.maxHeight = '26px';
    var box3 = document.getElementById('box-3');
    box3.style.maxHeight = '46px';

    // mid
    var box9 = document.getElementById('box-9');
    box9.style.height = '0dvh'; 

    // bot
    var chatContainer = document.getElementById('chatContainer');
    chatContainer.style.height = '80dvh';
    var chat_body = document.getElementById('chatBody');
    // chat_body.style.height = '70dvh';
    chat_body.style.height = '';
}
