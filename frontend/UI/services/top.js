function redner_level_2_top(name) {
    var show_name = document.getElementById('show-name');
    show_name.textContent = name;

    var show_stat = document.getElementById('show-stat');
    var show_stat = document.getElementById('show-stat');
    var welcome = document.getElementById('welcome');

    welcome.setAttribute('hidden', '')

    show_name.textContent = name;
    var show_stat = document.getElementById('show-stat');            

    show_name.textContent = name;
    show_stat.textContent = 'stat: foo bar';
}