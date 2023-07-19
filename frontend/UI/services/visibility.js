function render_level_1() {
    __clear_input_by_id('messageFormSend');

    __hide_elements_by_classname('level-2');
    __unhide_elements_by_classname('level-1')

    __alter_element_display_by_ids(
        {
            // top
            'box-1': 'flex',
            'welcome': 'flex',

            'box-2': 'none',
            'show-name': 'none',
            'logoutButton': 'none',

            'socket_status': 'none',
            'show-stat': 'none',
            'success_login_output_p': 'none',

            // mid
            'box-9': 'flex',
            'login-div-0': 'flex',
            'loginForm': 'block',
            'usernameInput': 'block',
            'passwordInput': 'block',
            'login-btn': 'block',
            'login-div-1': 'block',
            'login_output': 'block',
            'login_outup_p': 'block',

            // bot
            'knee-div': 'none',
            'chatBody': 'none',
            'messageDiv': 'none',
            'messageFormSend': 'none',
            'messageButtonSend': 'none',
        }
    );

}


function render_level_2(name) {
    __clear_input_by_id('usernameInput');
    __clear_input_by_id('passwordInput');

    __hide_elements_by_classname('level-1');
    __unhide_elements_by_classname('level-2')

    __alter_element_display_by_ids(
        {
            // top
            'box-1': 'none',
            'welcome': 'none',

            'box-2': 'flex',
            'show-name': 'flex',
            'logoutButton': 'block',

            'socket_status': 'flex',
            'show-stat': 'flex',
            'success_login_output_p': 'flex',


            // mid
            'box-9': 'none',
            'login-div-0': 'none',
            'loginForm': 'none',
            'usernameInput': 'none',
            'passwordInput': 'none',
            'login-btn': 'none',
            'login-div-1': 'none',
            'login_output': 'block',
            'login_outup_p': 'block',

            // bot
            'knee-div': 'block',
            'chatBody': 'flex',
            'messageDiv': 'flex',
            'messageFormSend': 'block',
            'messageButtonSend': 'block',
        }
    );

    var show_name = document.getElementById('show-name');
    show_name.textContent = name;

    var login_hint = document.getElementById('login-hint');
    login_hint.textContent = '';
}


function __alter_element_display_by_ids(styles) {
    for (const id in styles) {
        var elem = document.getElementById(id);
        if (elem) {
            elem.style.display = styles[id];
        }
    }
}


function __unhide_elements_by_classname(classname) {
    var elements = document.getElementsByClassName(classname);
    for (var i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('hidden');
    }
}


function __hide_elements_by_classname(classname) {
    var elements = document.getElementsByClassName(classname);
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('hidden', '');
    }
}


function __clear_input_by_id(id) {
    var element = document.getElementById(id);
    // @ts-ignore
    element.value = "";
}
