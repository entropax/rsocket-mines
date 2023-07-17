var login_btn = document.getElementById('login-btn');
var logout_btn = document.getElementById('logoutButton');


login_btn.addEventListener('click', function(event) {
    event.preventDefault();

    var login_input = document.getElementById('usernameInput');
    var name = login_input && 'value' in login_input ? login_input.value : '';
    

    var randomNum = Math.random();
    var randomBool = randomNum < 0.5;

        if (randomBool) {

            resize_level_2();
            render_level_2(name);

            render_level_2_mid();
            
        } else {
            handle_wrong_credentials();
        }
    })


logout_btn.addEventListener('click', function() {
        resize_level_1();
        render_level_1();
    })
