// Плавная прокрутка по якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // compensate for header
                behavior: 'smooth'
            });
        }
    });
});

// Валидация формы заявки
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const statusEl = document.getElementById('formStatus');
    
    // Сброс предыдущих ошибок
    statusEl.textContent = '';
    statusEl.className = '';
    this.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    
    let valid = true;
    
    // Проверка имени
    if (name.length < 2) {
        setError(document.getElementById('name'), 'Введите корректное имя');
        valid = false;
    }
    
    // Проверка телефона (простая проверка на 11 цифр)
    const phonePattern = /^[0-9]{11}$/;
    if (!phonePattern.test(phone)) {
        setError(document.getElementById('phone'), 'Введите телефон в формате 7XXXXXXXXXX (11 цифр)');
        valid = false;
    }
    
    // Проверка email (если заполнен)
    if (email !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError(document.getElementById('email'), 'Введите корректный email');
            valid = false;
        }
    }
    
    if (valid) {
        // Здесь можно отправить данные на сервер (например, через fetch/AJAX)
        // Для демонстрации просто покажем сообщение об успехе
        statusEl.textContent = 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
        statusEl.style.color = 'var(--accent)';
        this.reset();
        
        // Анимация успеха
        setTimeout(() => {
            statusEl.textContent = '';
        }, 5000);
    }
});

function setError(inputElement, message) {
    const formGroup = inputElement.parentElement;
    formGroup.classList.add('error');
    const statusEl = document.getElementById('formStatus');
    statusEl.textContent = message;
    statusEl.style.color = 'var(--error)';
    // Прокрутка к первой ошибке
    if (!window.__errorScrolled) {
        window.__errorScrolled = true;
        formGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { window.__errorScrolled = false; }, 1000);
    }
}

// Добавление интерактивности карточек при наведении (дополнительный эффект)
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 10; // чувствительность по Y
        const angleY = (centerX - x) / 10; // чувствительность по X (инвертируем)
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animatedEls = document.querySelectorAll('.hero h2, .hero p, .btn-primary, .section-title, .card, .grid-item, .form-group, .info p');

// Показывает всё, что уже попало в зону видимости.
// Работает и как основной механизм (браузеры без IntersectionObserver),
// и как страховка: контент не должен оставаться невидимым никогда.
function revealVisible() {
    animatedEls.forEach(el => {
        if (el.classList.contains('animate-in')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50 && rect.bottom > 0) {
            el.classList.add('animate-in');
        }
    });
}

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Добавляем классы для анимации
    animatedEls.forEach(el => observer.observe(el));
} else {
    // Браузер без IntersectionObserver — показываем всё сразу
    animatedEls.forEach(el => el.classList.add('animate-in'));
}

// Страховка на случай, если observer не сработал (или страница открыта не в активной вкладке)
window.addEventListener('scroll', revealVisible, { passive: true });
window.addEventListener('resize', revealVisible);
window.addEventListener('load', () => setTimeout(revealVisible, 300));
setTimeout(revealVisible, 1000);

// Добавляем стили для анимации через JS (можно вынести в CSS, но так проще)
const style = document.createElement('style');
style.textContent = `
    /* Базовое (скрытое) состояние. :where() даёт нулевую специфичность, поэтому
       .animate-in ниже всегда его переопределяет — иначе элементы (в т.ч. .hero h2,
       .hero p, .info p со специфичностью выше) навсегда оставались бы opacity: 0.
       В старом браузере без :where() правило просто не применится и контент виден сразу. */
    :where(.hero h2, .hero p, .btn-primary, .section-title, .card, .grid-item, .form-group, .info p) {
        opacity: 0;
        transform: translateY(30px);
    }

    /* Видимое состояние */
    .animate-in {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .form-group.error input,
    .form-group.error textarea {
        border-color: var(--error) !important;
        box-shadow: 0 0 0 2px rgba(186, 37, 37, 0.2);
    }
`;
document.head.appendChild(style);