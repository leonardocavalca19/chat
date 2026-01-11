document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    document.getElementById('btnregistrati').addEventListener('click', (e) => {
        e.preventDefault();
        const telefono = document.getElementById('telefono').value;
        if (!/^\+?[0-9]{8,15}$/.test(telefono)) {
            document.getElementById('error').textContent = 'Numero di telefono non valido.';
            return;
        }
        const password = document.getElementById('password').value;
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
            document.getElementById('error').textContent = 'Password non valida.';
            return;
        }
        socket.emit('register', { telefono, password });
    });
    document.getElementById('btnaccedi').addEventListener('click', (e) => {
        e.preventDefault();
        const telefono = document.getElementById('telefono').value; ;
        if (!/^\+?[0-9]{8,15}$/.test(telefono)) {
            document.getElementById('error').textContent = 'Numero di telefono non valido.';
            return;
        }
        const password = document.getElementById('password').value;
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
            document.getElementById('error').textContent = 'Password non valida.';
            return;
        }
        socket.emit('login', { telefono, password });
    });
    socket.on('register-success', () => {
        alert('Registrazione avvenuta con successo! Ora puoi effettuare il login.');
    });

    socket.on('login-success', (telefonoUtente) => {
        alert('Login effettuato con successo! Benvenuto, ' + telefonoUtente);
    });

    socket.on('auth-error', (messaggioErrore) => {
        document.getElementById('error').textContent = messaggioErrore;
    });

    document.getElementById('toggle-btn').addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        document.getElementById('toggle-btn').textContent = type === 'text' ? 'visibility_off' : 'visibility';
    });
});