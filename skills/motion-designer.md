# skills/motion-designer.md

Стандарты дизайна, анимации и интерактива для всего проекта (сайт «УютDom»).
Источник вдохновения — референс `reference-siatra.md` (тёмный мебельный e-commerce).
Этот файл — единый источник правды: любой новый блок, компонент или правка анимации
обязаны соответствовать правилам ниже. Если правило нарушается осознанно — это фиксируется
в комментарии в коде рядом с исключением.

Референс — отправная точка по духу, но не по букве: у него нет scroll-reveal, у нас он есть
(раздел 4.2), и это единственное сознательное расширение.

---

## 1. Палитра (CSS-переменные)

Единый источник правды. Никаких «почти таких же» цветов в разметке — только эти токены.

```css
:root {
  --bg:         #131415;                  /* основной фон: почти чёрный, тёплый */
  --bg-deep:    #0E0F0F;                  /* тёмные полосы, чередующиеся секции */
  --bg-footer:  #050505;                  /* подвал и «дна» страницы */
  --text:       #CDD1C2;                  /* тёплый шалфейный, НЕ чистый белый */
  --heading:    #FFFFFF;                  /* только заголовки */
  --accent:     #758251;                  /* оливково-шалфейный: один акцент */
  --muted:      #898A87;                  /* подписи, второстепенный текст */
  --ghost:      rgba(205, 209, 194, 0.08);/* гигантские призрачные заголовки */
  --divider:    rgba(255, 255, 255, 0.35);/* разделители строк */
  --error:      #BA2525;                  /* ошибки формы */
}
```

Правила:

- Почти чёрный тёплый фон + **один** приглушённый оливковый акцент. Второго акцентного цвета нет.
- Тело текста — шалфейное `var(--text)`, не белое. Белый (`var(--heading)`) — только заголовки.
- Контраст держится на фотографиях и типографике, а не на цветах.
- Теней и градиентов почти нет. Блоки разделяются сменой фона (`--bg` / `--bg-deep` / `--bg-footer`)
  и воздухом (крупные вертикальные отступы).
- Радиусы: **0 по умолчанию** (прямые углы), `10-16px` у карточек и инпутов, круг (`border-radius: 100%`)
  у кнопок-стрелок. Пиллы — `30px` максимум, и только если элемент действительно «тег».
- Разделители — только `1px solid var(--divider)`.

## 2. Типографика

Шрифты подключаются через Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=Inter+Display:wght@300;400;500;600&display=swap" rel="stylesheet">
```

- **Inter Display** — заголовки.
- **Inter** — текст и интерфейс.
- **Bebas Neue** — логотип и крупный водяной знак в подвале.

Шкала заголовков:

| Роль | Размер | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| h1 | 120px | 500 | -0.06em | 0.9 |
| h2 | 72px | 500 | -0.06em | 0.9 |
| h3 | 48px | 500 | -0.05em | 1.0 |
| Гигантский призрачный заголовок | 140px | 600 | (как h1) | 0.9 |

Тело текста:

- основной: `16px / 400 / letter-spacing: -0.02em / line-height: 2.0` — очень воздушно;
- мелкие подписи: `14px`;
- бейджи: `12px`.

```css
:root {
  --font-display: "Inter Display", Inter, sans-serif;
  --font-body: Inter, sans-serif;
  --font-wordmark: "Bebas Neue", sans-serif;
}

h1 { font-family: var(--font-display); font-size: clamp(56px, 9vw, 120px); font-weight: 500; letter-spacing: -0.06em; line-height: 0.9; color: var(--heading); }
h2 { font-family: var(--font-display); font-size: clamp(40px, 6vw, 72px);  font-weight: 500; letter-spacing: -0.06em; line-height: 0.9; color: var(--heading); }
h3 { font-family: var(--font-display); font-size: clamp(28px, 4vw, 48px);  font-weight: 500; letter-spacing: -0.05em; line-height: 1.0; color: var(--heading); }
p, li, a, button, input, textarea { font-family: var(--font-body); font-size: 16px; font-weight: 400; letter-spacing: -0.02em; line-height: 2.0; color: var(--text); }

.ghost-title { font-family: var(--font-display); font-size: clamp(72px, 16vw, 140px); font-weight: 600; letter-spacing: -0.06em; line-height: 0.9; color: var(--ghost); }
.caption { font-size: 14px; color: var(--muted); line-height: 1.6; }
.badge   { font-size: 12px; line-height: 1; }
```

Правила:

- Капсом набраны **только** навигация и маркиза — мелкий размер + разрядка
  (`font-size: 12-14px; text-transform: uppercase; letter-spacing: 0.08em; line-height: 1`).
- Заголовки капсом **не** набирать.
- Контраст размеров большой: 120px заголовок против 12-14px подписей. Промежуточных «средних»
  размеров-компромиссов не заводить.

## 3. Easing и тайминги

```css
:root {
  --ease-panel: cubic-bezier(0.44, 0, 0.56, 1);  /* шапка, маркиза, верхние полосы */
  --ease-soft:  cubic-bezier(0.22, 1, 0.36, 1);  /* всё остальное (spring-аппроксимация, ease-out-quint) */
  --dur-hover:  0.3s;                            /* hover-переходы */
  --dur-reveal: 0.8s;                            /* scroll-reveal */
}
```

- Для шапки, маркизы и верхних полос: `cubic-bezier(0.44, 0, 0.56, 1)`, tween `0.6s`.
- Для всего остального: `cubic-bezier(0.22, 1, 0.36, 1)` — аппроксимация spring, ease-out-quint.
- **Никогда** не использовать `linear` и дефолтный `ease`.
- Стандартная длительность hover-переходов: `0.3s`.
- Стандартная длительность scroll-reveal: `0.8s`.

В JS/GSAP эквиваленты: `--ease-panel` → `"power1.inOut"`, `--ease-soft` → `"power4.out"`
(при точной необходимости — `CustomEase.create("soft", "M0,0 C0.22,1 0.36,1 1,1")`).

## 4. Анимации

### 4.1 Загрузочная хореография hero (один раз при загрузке)

| Элемент | Старт | Финал | Delay | Длительность | Easing |
|---|---|---|---|---|---|
| Маркиза + шапка | `opacity .001`, `y -150px` | `opacity 1`, `y 0` | 1.7s | 0.6s | `cubic-bezier(0.44, 0, 0.56, 1)` |
| Фото hero | `opacity .001` | `opacity 1` | 1.6s | 0.4s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Текст справа в hero | `opacity .001` | `opacity 1` | 1.8s | 1.0s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Кнопка hero | `opacity .001` | `opacity 1` | 2.0s | 1.0s | `cubic-bezier(0.22, 1, 0.36, 1)` |

- Общее время входа первого экрана **~2.6 секунды. Не быстрее.**
- Проявляется только прозрачностью; двигается только шапка с маркизой (`y -150px → 0`).
- Никаких масштабов фото, параллакса и «дыхания» на первом экране.

```css
.hero-bg      { animation: fade-in 0.4s var(--ease-soft) 1.6s both; }
.hero-text    { animation: fade-in 1s   var(--ease-soft) 1.8s both; }
.hero-cta     { animation: fade-in 1s   var(--ease-soft) 2.0s both; }
.marquee,
.site-header  { animation: drop-in 0.6s var(--ease-panel) 1.7s both; }

@keyframes fade-in { from { opacity: 0.001; } to { opacity: 1; } }
@keyframes drop-in { from { opacity: 0.001; transform: translateY(-150px); } to { opacity: 1; transform: translateY(0); } }
```

### 4.2 Scroll-reveal для секций ниже hero

Упрощённый вариант (референс его не использует, но нам нужен):

- `opacity 0 → 1`, `translateY(30px) → 0`;
- **Blur НЕ использовать**;
- stagger `0.08s` для карточек внутри секции;
- easing `cubic-bezier(0.22, 1, 0.36, 1)`, duration `0.8s`;
- ScrollTrigger со `start: "top 80%"`, `once: true` (проигрывается один раз);
- на мобильных (`max-width: 768px`) — отключить или оставить только `opacity`.

```js
// GSAP + ScrollTrigger
gsap.utils.toArray("[data-reveal]").forEach((section) => {
  const items = section.querySelectorAll("[data-reveal-item]");
  gsap.set(items, { opacity: 0, y: 30 });
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    once: true,
    onEnter: () => gsap.to(items, {
      opacity: 1, y: 0, duration: 0.8, ease: "power4.out", stagger: 0.08,
      clearProps: "transform"
    })
  });
});
```

```css
/* Резерв, если GSAP недоступен: чистый CSS + IntersectionObserver-класс */
@media (max-width: 768px) {
  [data-reveal-item] { transform: none !important; }       /* только opacity */
}
@media (prefers-reduced-motion: reduce) {
  [data-reveal-item] { opacity: 1 !important; transform: none !important; }
}
```

## 5. Hover и интерактив

- **Карточки товаров:** фото `scale(1.04)` внутри `overflow: hidden`; подпись становится ярче.
  Масштабируется **фото**, а не вся карточка.
- **Строки каталога:** текст `rgba(255,255,255,0.35)` → `rgba(255,255,255,1)`.
- **Круглые кнопки-стрелки:** рамка становится оливковой `var(--accent)`, `opacity: 1`.
- Все переходы: `transition: 0.3s cubic-bezier(0.22, 1, 0.36, 1)`.
- На мобильных (`@media (hover: none)`) hover-эффекты отключить.

```css
.card { overflow: hidden; }
.card img { transition: transform var(--dur-hover) var(--ease-soft); }
.card:hover img { transform: scale(1.04); }
.card:hover .card-title { color: var(--heading); }

.row { color: rgba(255, 255, 255, 0.35); transition: color var(--dur-hover) var(--ease-soft); }
.row:hover { color: rgba(255, 255, 255, 1); }

.arrow-btn { border: 1px solid var(--divider); border-radius: 100%; opacity: 0.7;
             transition: border-color var(--dur-hover) var(--ease-soft), opacity var(--dur-hover) var(--ease-soft); }
.arrow-btn:hover { border-color: var(--accent); opacity: 1; }

@media (hover: none) {
  .card:hover img { transform: none; }
  .card:hover .card-title,
  .row:hover { color: inherit; }
  .arrow-btn:hover { border-color: var(--divider); opacity: 0.7; }
}
```

## 6. Шапка

- Всегда `position: fixed; background: transparent;`.
- При скролле фон **не** меняется, blur **не** включается, шапка **не** прячется.
  Контент проезжает под ней.
- Это осознанное решение по референсу. Не делать «стеклянный остров», не делать смену фона,
  не добавлять `backdrop-filter`, не уменьшать высоту при скролле.

```css
.site-header {
  position: fixed; inset: 0 0 auto 0; z-index: 100;
  background: transparent; border: 0; backdrop-filter: none;
  height: 80px;
}
.marquee { position: fixed; top: 0; left: 0; right: 0; height: 56px; z-index: 101; background: transparent; }
.site-header { top: 56px; }
```

## 7. Общие правила

- **Никогда** не использовать дефолтные `linear` и `ease` переходы (только токены из раздела 3).
- Все анимации должны отключаться или упрощаться на мобильных (`max-width: 768px`).
- Уважать `prefers-reduced-motion`: если пользователь его включил — отключить все анимации и stagger.
- Никаких «дёрганых» и резких движений. Всё должно ощущаться как маслянистая, тягучая физика.
- Не добавлять параллакс, WebGL, 3D-эффекты — референс их не использует.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

```js
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches;
if (reduceMotion || isMobile) {
  gsap.globalTimeline.pause();          // или просто не инициализировать ScrollTrigger
  document.querySelectorAll("[data-reveal-item]").forEach((el) => {
    el.style.opacity = 1; el.style.transform = "none";
  });
}
```

---

## Чек-лист перед коммитом

- [ ] Новые цвета — только через токены из раздела 1, ни одного хардкода hex в разметке.
- [ ] Новый заголовок — из шкалы раздела 2 (размер/weight/трекинг/line-height), без «своих» значений.
- [ ] У каждой анимации указан easing-токен (`--ease-panel` или `--ease-soft`), нет `linear`/`ease`.
- [ ] Hover-переходы — `0.3s`, scroll-reveal — `0.8s`, stagger — `0.08s`.
- [ ] На ширине ≤768px анимации упрощены, hover отключён через `@media (hover: none)`.
- [ ] Проверено с включённым `prefers-reduced-motion`: сайт полностью статичен и читаем.
- [ ] Шапка осталась прозрачной при скролле (без blur и смены фона).
- [ ] Не добавлены тени, градиенты, параллакс, WebGL и 3D.
