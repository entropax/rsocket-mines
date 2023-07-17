function render_level_1() {
    __unhide_elements_by_classname('level-1')
    __hide_elements_by_classname('level-2');
    __hide_elements_by_classname('level-3');
    __alter_element_display_by_ids(
        {
            'hair-div': 'flex',
            'welcome': 'flex',
            'eye-div': 'none',
            'show-name': 'none',
            'show-stat': 'none',
            'logoutButton': 'none',

            'login-div-0': 'flex',
            'loginForm': 'block',
            'usernameInput': 'block',
            'passwordInput': 'block',
            'login-btn': 'block',

            'knee-div': 'none',
            'foot-div': 'none',
            'message-field': 'none',
            'chat-btn': 'none',
        }
    )
}


function render_level_2(name) {
    __unhide_elements_by_classname('level-2')
    __hide_elements_by_classname('level-1');
    __hide_elements_by_classname('level-3');
    __alter_element_display_by_ids(
        {
            'hair-div': 'none',
            'welcome': 'none',
            'eye-div': 'flex',
            'show-name': 'block',
            'show-stat': 'block',
            'logoutButton': 'block',

            'login-div-0': 'none',
            'loginForm': 'none',
            'usernameInput': 'none',
            'passwordInput': 'none',
            'login-btn': 'none',

            'knee-div': 'block',
            'foot-div': 'flex',
            'message-field': 'block',
            'chat-btn': 'block',
        }
    );

    var show_name = document.getElementById('show-name');
    show_name.textContent = name;

    var show_stat = document.getElementById('show-stat');
    show_stat.textContent = 'Score: foo bar';
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
