function render_level_2_mid() {
    document.getElementById('room_btn').addEventListener('click', function() {
        // Handle 'room_btn' click event
        // box2.innerHTML = `
        //     <p>Now inside the game room</p>
        //     <button id="game_start">Start Game</button>
        //     <div id="game_board"></div>
        // `;
    
        // Optionally, you can add event listeners to the newly created elements
        document.getElementById('game_start').addEventListener('click', function() {
            // Handle 'game_start' click event
            document.getElementById('game_board').innerHTML = "Game Started!";
        });
    });
};
