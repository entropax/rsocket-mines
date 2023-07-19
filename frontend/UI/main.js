var login_btn = document.getElementById('login-btn');
var logout_btn = document.getElementById('logoutButton');


login_btn.addEventListener('click', function(event) {
    event.preventDefault();

    var login_input = document.getElementById('usernameInput');
    var name = login_input && 'value' in login_input ? login_input.value : '';
    

    var randomNum = Math.random();
    var randomBool = randomNum < 0.5;

        if (true) {

            render_level_2(name);
            resize_level_2();
            
        } else {
            handle_wrong_credentials();
        }
    })


logout_btn.addEventListener('click', function() {

        render_level_1();
        resize_level_1();

    })
