function handle_wrong_credentials() {
    var login_hint = document.getElementById('login_outup_p');

    // Максим здесь будет ошибки, что возвращает нажатие кнопки логин
    login_hint.textContent = `some error text...`;

    document.getElementById('login-btn').addEventListener('click', function() {
        
        login_hint.classList.add('shake-animation');
      
        setTimeout(function() { 
            login_hint.classList.remove('shake-animation'); 
        }, 180); 

        // Здесь 180 мс, это время должно соответствовать 
        // продолжительности анимации, умноженной на количество повторов.
        
      }); 
}
