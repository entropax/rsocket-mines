var login_btn = document.getElementById('login-btn');


login_btn.addEventListener('click', function() {
    var login_input = document.getElementById('login-input');
    var name = login_input && 'value' in login_input ? login_input.value : '';
    
    // fetch('https://httpbin.org/post', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({nickname: name})
    // })
    // .then(response => {
        // if (response.ok) {
        if (true) {

            resize_level_2_elements();
            hide_level_1_elements();
            unhide_level_2_elements();

            redner_level_2_top(name);
            render_level_2_mid();
            redner_level_2_bot();
            
        } else {
            handle_wrong_pwd();
        }
    })


    // .catch(error => console.error('Error:', error));
// });
