document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    document.getElementById('btnregistrati').addEventListener('click', (e) => {
        e.preventDefault();
        const telefono = document.getElementById('telefono').value;
        if (!/^\+?[0-9]{8,15}$/.test(telefono)) {
            document.getElementById('error').textContent = 'Numero di telefono non valido.';
            return;
        }
        const nome = document.getElementById('nome').value;
        if (nome.trim() === '') {
            document.getElementById('error').textContent = 'Nome utente non valido.';
            return;
        }
        const password = document.getElementById('password').value;
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/.test(password)) {
            document.getElementById('error').textContent = 'Password non valida.';
            return;
        }
        socket.emit('register', { telefono, nome, password });
    });
    socket.on('register-success', () => {
        alert('Registrazione avvenuta con successo! Ora puoi effettuare il login.');
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
    document.getElementById('password').addEventListener('input', () => {
        const password = document.getElementById('password').value;
        if (/^.{8,}$/.test(password)) {
            document.getElementById('lunghezza').style.color = 'var(--md-sys-color-success)';
        }
        else {
            document.getElementById('lunghezza').style.color = 'var(--md-sys-color-on-surface-variant)';
        }
        if (/^(?=.*[A-Z]).{1,}$/.test(password)) {
            document.getElementById('maiuscola').style.color = 'var(--md-sys-color-success)';
        }
        else {
            document.getElementById('maiuscola').style.color = 'var(--md-sys-color-on-surface-variant)';
        }
        if (/^(?=.*[a-z]).{0,}$/.test(password)) {
            document.getElementById('minuscola').style.color = 'var(--md-sys-color-success)';
        }
        else {
            document.getElementById('minuscola').style.color = 'var(--md-sys-color-on-surface-variant)';
        }
        if (/^(?=.*\d).{0,}$/.test(password)) {
            document.getElementById('numero').style.color = 'var(--md-sys-color-success)';
        }
        else {
            document.getElementById('numero').style.color = 'var(--md-sys-color-on-surface-variant)';
        }
        if (/^(?=.*[^a-zA-Z0-9\s]).{0,}$/.test(password)) {
            document.getElementById('speciale').style.color = 'var(--md-sys-color-success)';
        }
        else {
            document.getElementById('speciale').style.color = 'var(--md-sys-color-on-surface-variant)';
        }
    });
});