document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = event.target.name.value.trim();
        const email = event.target.email.value.trim();
        const password = event.target.password.value.trim();

        if (!name || !email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Obtener usuarios registrados desde localStorage
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

        // Verificar si el correo ya está registrado
        if (users.some(u => u.email === email)) {
            alert('El correo ya está registrado. Intenta con otro.');
            return;
        }

        // Agregar el nuevo usuario
        users.push({ name, email, password });
        localStorage.setItem('registeredUsers', JSON.stringify(users));

        alert('Registro exitoso.');
        // Redirigir al login
        window.location.href = '/login.html';
    });
    document.getElementById('back-button').addEventListener('click', () => {
        // Navegar a la página anterior
        window.history.back();
    });

    const fakeRegister = async (name, email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email !== 'ya-registrado@correo.com') {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            }, 1000);
        });
    };
});
