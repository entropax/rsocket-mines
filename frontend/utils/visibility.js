function hide_level_1_elements() {
    var level_1_elements = document.getElementsByClassName('level-1');
    for (var i = 0; i < level_1_elements.length; i++) {
        level_1_elements[i].setAttribute('hidden', '');
    }

    var hair_div = document.getElementById('hair-div');
    hair_div.style.display = 'none';

    var welcome = document.getElementById('welcome');
    welcome.setAttribute('hidden', '')
}


function unhide_level_2_elements() {
    var level_2_elements = document.getElementsByClassName('level-2');
    for (var i = 0; i < level_2_elements.length; i++) {
        level_2_elements[i].removeAttribute('hidden');
    }
    
    var eye_div = document.getElementById('eye-div');
    eye_div.style.display = 'flex';
}