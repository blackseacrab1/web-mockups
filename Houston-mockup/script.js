// script.js

// Функция переключения темы
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');
    
    if (body.getAttribute('data-theme') === 'dark') {
        // Переключаем на светлую тему
        body.removeAttribute('data-theme');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Тёмная тема';
        localStorage.setItem('theme', 'light');
        
        // Добавляем анимацию перехода
        addThemeTransition();
    } else {
        // Переключаем на тёмную тему
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Светлая тема';
        localStorage.setItem('theme', 'dark');
        
        // Добавляем анимацию перехода
        addThemeTransition();
    }
}

// Функция для добавления плавного перехода при смене темы
function addThemeTransition() {
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    // Убираем transition через некоторое время
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
}

// Функция для автоматического определения предпочитаемой темы
function detectPreferredTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDarkScheme.matches && !localStorage.getItem('theme')) {
        return 'dark';
    }
    return localStorage.getItem('theme');
}

// Функция инициализации темы при загрузке страницы
function initTheme() {
    const savedTheme = detectPreferredTheme();
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('.theme-icon');
        const themeText = themeToggle.querySelector('.theme-text');
        
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Светлая тема';
        } else {
            document.body.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Тёмная тема';
        }
    }
}

// Функция для отслеживания изменений системной темы
function watchSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
        // Если пользователь не выбрал тему вручную
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.setAttribute('data-theme', 'dark');
                updateThemeButton('dark');
            } else {
                document.body.removeAttribute('data-theme');
                updateThemeButton('light');
            }
        }
    });
}

// Функция обновления текста кнопки темы
function updateThemeButton(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('.theme-icon');
        const themeText = themeToggle.querySelector('.theme-text');
        
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Светлая тема';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Тёмная тема';
        }
    }
}

// Функция для создания снеков (уведомлений)
function showThemeNotification(theme) {
    // Создаём элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.textContent = theme === 'dark' 
        ? 'Тёмная тема включена' 
        : 'Светлая тема включена';
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Убираем уведомление через 2 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Улучшенная функция переключения темы с уведомлением
function toggleThemeWithNotification() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    toggleTheme();
    showThemeNotification(newTheme);
}

// Инициализация при полной загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем тему
    initTheme();
    
    // Начинаем отслеживать изменения системной темы
    watchSystemTheme();
    
    // Назначаем обработчик клика на кнопку переключения темы
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleThemeWithNotification);
    }
    
    // Добавляем клавиатурное управление (Alt+T для переключения темы)
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleThemeWithNotification();
        }
    });
    
    // Показываем подсказку о горячей клавише (только один раз)
    if (!localStorage.getItem('hotkeyHintShown')) {
        setTimeout(() => {
            console.log('💡 Подсказка: Используйте Alt+T для быстрого переключения темы');
            localStorage.setItem('hotkeyHintShown', 'true');
        }, 3000);
    }
});

// Для старых браузеров - полифилл для matchMedia
if (!window.matchMedia) {
    window.matchMedia = function() {
        return {
            matches: false,
            addListener: function() {},
            removeListener: function() {}
        };
    };
}

// Экспорт функций для использования в консоли (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        initTheme,
        detectPreferredTheme
    };
}