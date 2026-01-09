document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('toggle-btn').addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        document.getElementById('toggle-btn').textContent = type === 'text' ? 'visibility_off' : 'visibility';
    });
});