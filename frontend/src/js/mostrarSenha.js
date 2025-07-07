const pwdInput = document.getElementById('password');
const toggleBtn = document.getElementById('togglePwd');
const icon = document.getElementById('iconPwd');

toggleBtn.addEventListener('click', () => {
    const isHidden = pwdInput.type === 'password';
    pwdInput.type = isHidden ? 'text' : 'password';
    icon.src = isHidden ? '../../assets/icons/eye-off.svg' : '../../assets/icons/eye.svg';
    toggleBtn.setAttribute('aria-label',
        isHidden ? "Ocultar senha" : "Mostrar senha"
    );
});