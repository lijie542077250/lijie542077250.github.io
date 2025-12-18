// ===== 主要功能 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌿 Зелёный учебный портал загружен');
    
    // 1. 更新当前时间和日期
    updateDateTime();
    setInterval(updateDateTime, 60000); // 每分钟更新
    
    // 2. 初始化笔记功能
    initNotes();
    
    // 3. 初始化页面统计
    initPageStats();
    
    // 4. 添加课程进度交互
    initProgressBars();
    
    // 5. 模拟数据加载
    loadMockData();
});

// ===== 时间和日期 =====
function updateDateTime() {
    const now = new Date();
    
    // 格式化日期
    const optionsDate = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('ru-RU', optionsDate);
    
    // 格式化时间
    const optionsTime = { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    };
    const timeStr = now.toLocaleTimeString('ru-RU', optionsTime);
    
    // 更新页面元素
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('today-date');
    const currentDateElement = document.getElementById('current-date');
    
    if (timeElement) timeElement.textContent = timeStr;
    if (dateElement) dateElement.textContent = dateStr;
    if (currentDateElement) currentDateElement.textContent = dateStr;
    
    // 更新页面加载时间
    const loadTimeElement = document.getElementById('page-load-time');
    if (loadTimeElement) {
        const loadTime = Math.floor((Date.now() - performance.timing.navigationStart) / 1000);
        loadTimeElement.textContent = `Загружено за ${loadTime} сек`;
    }
}

// ===== 笔记功能 =====
function initNotes() {
    const textarea = document.getElementById('quickNote');
    const saveBtn = document.getElementById('saveNote');
    const clearBtn = document.getElementById('clearNote');
    const formatBtn = document.getElementById('formatNote');
    const charCount = document.getElementById('charCount');
    const lastSaved = document.getElementById('lastSaved');
    
    if (!textarea) return;
    
    // 加载保存的笔记
    const savedNote = localStorage.getItem('portalNote');
    if (savedNote) {
        textarea.value = savedNote;
        updateCharCount();
        if (lastSaved) lastSaved.textContent = 'Автосохранено';
    }
    
    // 实时字符计数
    textarea.addEventListener('input', function() {
        updateCharCount();
        autoSaveNote();
    });
    
    // 保存按钮
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveNoteToStorage();
            showNotification('✅ Заметка сохранена!', 'success');
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Сохранено';
            saveBtn.classList.add('saved');
            
            setTimeout(() => {
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
                saveBtn.classList.remove('saved');
            }, 2000);
        });
    }
    
    // 格式化按钮
    if (formatBtn) {
        formatBtn.addEventListener('click', function() {
            formatNote();
            showNotification('📝 Заметка отформатирована', 'info');
        });
    }
    
    // 清除按钮
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (textarea.value.trim() && confirm('Удалить эту заметку?')) {
                textarea.value = '';
                localStorage.removeItem('portalNote');
                updateCharCount();
                showNotification('🗑️ Заметка удалена', 'warning');
            }
        });
    }
}

function updateCharCount() {
    const textarea = document.getElementById('quickNote');
    const charCount = document.getElementById('charCount');
    if (textarea && charCount) {
        const count = textarea.value.length;
        charCount.textContent = `${count} символов`;
        
        // 颜色提示
        if (count > 1000) charCount.style.color = '#f44336';
        else if (count > 500) charCount.style.color = '#ff9800';
        else charCount.style.color = '#4caf50';
    }
}

function autoSaveNote() {
    const textarea = document.getElementById('quickNote');
    const lastSaved = document.getElementById('lastSaved');
    
    if (textarea.value.trim()) {
        localStorage.setItem('portalNote', textarea.value);
        if (lastSaved) {
            const now = new Date();
            lastSaved.textContent = `Сохранено: ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        }
    }
}

function saveNoteToStorage() {
    const textarea = document.getElementById('quickNote');
    if (textarea.value.trim()) {
        localStorage.setItem('portalNote', textarea.value);
        localStorage.setItem('portalNoteDate', new Date().toISOString());
    }
}

function formatNote() {
    const textarea = document.getElementById('quickNote');
    let text = textarea.value;
    
    // 简单的格式化规则
    text = text
        .replace(/\n\s*\n/g, '\n\n')  // 移除多余空行
        .replace(/^# (.+)$/gm, '## $1') // 添加标题格式
        .replace(/^- (.+)$/gm, '• $1')  // 列表格式
        .trim();
    
    textarea.value = text;
    updateCharCount();
    autoSaveNote();
}

// ===== 页面统计 =====
function initPageStats() {
    // 更新统计数字（可以连接真实数据）
    const stats = {
        credits: 30,
        attendance: 85,
        subjects: 6,
        daysToExam: 14
    };
    
    // 动画效果显示数字
    animateNumbers(stats);
}

function animateNumbers(stats) {
    const elements = {
        credits: document.querySelector('.stat-item:nth-child(1) .stat-value'),
        attendance: document.querySelector('.stat-item:nth-child(2) .stat-value'),
        subjects: document.querySelector('.stat-item:nth-child(3) .stat-value'),
        daysToExam: document.querySelector('.stat-item:nth-child(4) .stat-value')
    };
    
    Object.keys(elements).forEach((key, index) => {
        const element = elements[key];
        if (!element) return;
        
        const target = stats[key];
        let current = 0;
        const increment = target / 50; // 50帧动画
        const duration = 1000; // 1秒
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (key === 'attendance') {
                element.textContent = Math.round(current) + '%';
            } else {
                element.textContent = Math.round(current);
            }
        }, duration / 50);
    });
}

// ===== 进度条功能 =====
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 300);
    });
}

// ===== 模拟数据 =====
function loadMockData() {
    // 模拟课程数据
    const courses = [
        { name: 'Администрирование компьютерных систем', progress: 45 },
        { name: 'Программное обеспечение для разработки ЭОР', progress: 30 },
        { name: 'Применение веб-систем дистанционного образования', progress: 60 },
        { name: 'Методика обучения информатике в высшей школе', progress: 25 }
    ];
    
    // 更新进度条
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
        if (courses[index]) {
            setTimeout(() => {
                bar.style.width = courses[index].progress + '%';
                bar.nextElementSibling.textContent = `${courses[index].progress}% завершено`;
            }, 500 * (index + 1));
        }
    });
    
    // 模拟活动数据
    const activities = [
        { text: 'Новое задание добавлено в "Программное обеспечение ЭОР"', time: '10 минут назад' },
        { text: 'Обновлён материал по веб-системам', time: '1 час назад' },
        { text: 'Назначена консультация по проекту', time: 'Вчера' }
    ];
}

// ===== 工具函数 =====
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => notification.classList.add('show'), 10);
    
    // 自动消失
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== 键盘快捷键 =====
document.addEventListener('keydown', function(e) {
    // Ctrl+S 保存笔记
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const saveBtn = document.getElementById('saveNote');
        if (saveBtn) saveBtn.click();
    }
    
    // Ctrl+E 清除笔记
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        const clearBtn = document.getElementById('clearNote');
        if (clearBtn) clearBtn.click();
    }
});

// ===== 页面性能监控 =====
window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    console.log(`🚀 Страница загружена за ${loadTime} мс`);
    
    // 如果加载慢，显示提示
    if (loadTime > 3000) {
        console.warn('⚠️ Загрузка страницы заняла более 3 секунд');
    }
});// ===== 照片上传功能 =====
function initPhotoUpload() {
    const photoInput = document.getElementById('photo-input');
    const userPhoto = document.getElementById('user-photo');
    
    if (!photoInput || !userPhoto) return;
    
    // 点击照片预览
    userPhoto.addEventListener('click', function() {
        showPhotoPreview(this.src);
    });
    
    // 上传照片
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showNotification('Пожалуйста, выберите файл изображения', 'warning');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB限制
                showNotification('Файл слишком большой (максимум 5MB)', 'warning');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                userPhoto.src = e.target.result;
                // 保存到本地存储
                localStorage.setItem('userPhoto', e.target.result);
                showNotification('Фото успешно обновлено!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 加载保存的照片
    const savedPhoto = localStorage.getItem('userPhoto');
    if (savedPhoto) {
        userPhoto.src = savedPhoto;
    }
}

function showPhotoPreview(src) {
    // 创建预览层
    const preview = document.createElement('div');
    preview.className = 'photo-preview';
    preview.innerHTML = `
        <span class="close-preview">&times;</span>
        <img src="${src}" alt="Предпросмотр фото">
    `;
    
    document.body.appendChild(preview);
    preview.style.display = 'flex';
    
    // 关闭预览
    preview.querySelector('.close-preview').addEventListener('click', function() {
        document.body.removeChild(preview);
    });
    
    // 点击背景关闭
    preview.addEventListener('click', function(e) {
        if (e.target === this) {
            document.body.removeChild(preview);
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(preview);
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

// 在主函数中添加照片初始化
// 在 document.addEventListener('DOMContentLoaded') 中添加：
initPhotoUpload();