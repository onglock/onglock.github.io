// ===== Lenis — плавный скролл =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;

let lenis = null;
// window.Lenis проверяем на случай, если CDN не отдал библиотеку —
// без этой проверки весь файл упал бы вместе с валидацией формы
if (window.Lenis) {
    lenis = new Lenis({
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: !reduceMotion,   // при prefers-reduced-motion оставляем нативный скролл
        smoothTouch: false,           // на тач-устройствах (в т.ч. iOS) — нативный скролл
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// Высота fixed-шапки, чтобы якорь не уезжал под неё
function headerOffset() {
    const header = document.querySelector('header');
    return header ? header.offsetHeight : 0;
}

function scrollToTarget(el) {
    const offset = -headerOffset();
    if (lenis) {
        lenis.scrollTo(el, { offset: offset, immediate: reduceMotion });
        return;
    }
    window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY + offset,
        behavior: reduceMotion ? 'auto' : 'smooth'
    });
}

// Плавная прокрутка по якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) scrollToTarget(targetElement);
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
    // Прокрутка к первой ошибке (через Lenis, если он есть)
    if (!window.__errorScrolled) {
        window.__errorScrolled = true;
        if (lenis) {
            lenis.scrollTo(formGroup, { offset: -headerOffset() - 20, immediate: reduceMotion });
        } else {
            formGroup.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
        setTimeout(() => { window.__errorScrolled = false; }, 1000);
    }
}

// ===== Scroll-reveal: блоки секций выезжают снизу с blur, карточки — каскадом =====
const REVEAL_SECTIONS = ['#advantages', '#catalog', '#products', '#about', '#contacts'];
const REVEAL_STEP = 0.08;   // stagger между блоками внутри секции, s
const revealItems = [];

REVEAL_SECTIONS.forEach(selector => {
    const scope = document.querySelector(selector);
    if (!scope) return;
    // Блоки секции: заголовок, карточки/категории, поля формы, панель контактов
    scope.querySelectorAll('h2, .card, .grid-item, .form-group, .info').forEach((el, i) => {
        revealItems.push({ el: el, delay: Math.min(i, 7) * REVEAL_STEP });
    });
});

function showAllReveal() {
    revealItems.forEach(({ el }) => el.classList.add('reveal', 'revealed'));
}

if (reduceMotion) {
    // Анимаций нет — контент виден сразу
    showAllReveal();
} else if ('IntersectionObserver' in window) {
    revealItems.forEach(({ el, delay }) => {
        el.classList.add('reveal');
        el.style.transitionDelay = delay + 's';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('revealed');
            // Снимаем stagger-задержку, иначе она тормозила бы hover-переходы карточки
            setTimeout(() => { el.style.transitionDelay = ''; }, (parseFloat(el.style.transitionDelay) + 0.9) * 1000);
            observer.unobserve(el);   // проигрывается один раз
        });
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });   // срабатывание, когда верх блока доходит до 80% экрана

    revealItems.forEach(({ el }) => observer.observe(el));

    // Страховка: контент не должен оставаться невидимым никогда.
    // Условие — «блок дошёл до линии 80% или уже выше неё»: так подхватываются
    // и секции, которые проскроллили прыжком (иначе они остались бы скрытыми).
    function revealVisible() {
        revealItems.forEach(({ el }) => {
            if (el.classList.contains('revealed')) return;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                el.classList.add('revealed');
            }
        });
    }
    window.addEventListener('scroll', revealVisible, { passive: true });
    window.addEventListener('resize', revealVisible);
    window.addEventListener('load', () => setTimeout(revealVisible, 300));
    setTimeout(revealVisible, 1000);
} else {
    // Браузер без IntersectionObserver — показываем всё сразу
    showAllReveal();
}

// Стили состояния ошибки формы (палитра — из :root)
const style = document.createElement('style');
style.textContent = `
    .form-group.error input,
    .form-group.error textarea {
        border-color: var(--error) !important;
        box-shadow: 0 0 0 2px rgba(186, 37, 37, 0.2);
    }
`;
document.head.appendChild(style);
