function resize_level_1() {
    var box1 = document.getElementById('box-1');
    var box2 = document.getElementById('box-2');
    var box3 = document.getElementById('box-3');

    box1.style.height = '19dvh';
    box2.style.height = '79dvh'; 
    box3.style.height = '0dvh';
}


function resize_level_2() {
    var box1 = document.getElementById('box-1');
    var box2 = document.getElementById('box-2');
    var box3 = document.getElementById('box-3');

    box1.style.height = '38px';
    box2.style.height = '65dvh'; 
    box3.style.height = '35dvh';
}


function resize_level_3() {
    resize_level_2();
}
