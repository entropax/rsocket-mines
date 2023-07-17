function handle_wrong_credentials() {
    var login_hint = document.getElementById('login-hint');
    login_hint.textContent = `* This nick-name has already occupied 
    please provide another one :3`;

    document.getElementById('login-btn').addEventListener('click', function() {
        var login_hint = document.getElementById('login-hint');
        login_hint.classList.add('shake-animation');
      
        setTimeout(function() { 
            login_hint.classList.remove('shake-animation'); 
        }, 180); 

        // Здесь 180 мс, это время должно соответствовать 
        // продолжительности анимации, умноженной на количество повторов.
        
      }); 
}
