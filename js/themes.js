/**
 * 课堂助手 - 扩展主题系统
 * 处理多种主题切换和视觉效果应用
 */

// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化主题系统
  ThemeManager.init();
});

// 主题管理器
const ThemeManager = {
  // 可用的主题列表
  themes: [
    { id: 'light', name: '浅色模式' },
    { id: 'dark', name: '深色模式' },
    { id: 'pastel', name: '柔和粉彩' },
    { id: 'mint-purple', name: '薄荷紫' },
    { id: 'peach-coral', name: '蜜桃珊瑚' },
    { id: 'blue-green', name: '蓝绿主题' },
    { id: 'dark-pastel', name: '深色粉彩' }
  ],
  
  // 可用的背景效果
  effects: [
    { id: 'none', name: '无效果' },
    { id: 'overlay', name: '叠加效果' },
    { id: 'multi-layer', name: '多层渐变' },
    { id: 'radial-conic', name: '径向圆锥' },
    { id: 'mixed-directions', name: '多向渐变' }
  ],
  
  // 当前主题和效果
  currentTheme: 'light',
  currentEffect: 'none',
  
  // 初始化主题系统
  init: function() {
    // 从本地存储加载主题和效果设置
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.currentEffect = localStorage.getItem('effect') || 'none';
    
    // 应用主题和效果
    this.applyTheme(this.currentTheme);
    this.applyEffect(this.currentEffect);
    
    // 渲染主题选择界面（如果在设置页）
    if (document.querySelector('#theme-preview-container')) {
      this.renderThemeSelectors();
      this.renderEffectSelectors();
    }
  },
  
  // 渲染主题选择器
  renderThemeSelectors: function() {
    const container = document.getElementById('theme-preview-container');
    if (!container) return;
    
    let html = '';
    
    // 为每个主题创建预览卡片
    this.themes.forEach(theme => {
      const isActive = this.currentTheme === theme.id;
      html += `
        <div class="theme-preview ${isActive ? 'active' : ''}" data-theme="${theme.id}">
          <div class="theme-preview-top"></div>
          <div class="theme-preview-bottom">
            <span class="theme-preview-name">${theme.name}</span>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // 添加点击事件
    const themeCards = document.querySelectorAll('.theme-preview');
    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        const themeId = card.getAttribute('data-theme');
        this.setTheme(themeId);
        
        // 移除其他卡片的活动状态
        themeCards.forEach(c => c.classList.remove('active'));
        // 添加活动状态到当前卡片
        card.classList.add('active');
      });
    });
  },
  
  // 渲染效果选择器
  renderEffectSelectors: function() {
    const container = document.getElementById('effect-preview-container');
    if (!container) return;
    
    let html = '';
    
    // 为每个效果创建预览卡片
    this.effects.forEach(effect => {
      const isActive = this.currentEffect === effect.id;
      html += `
        <div class="effect-preview ${isActive ? 'active' : ''}" data-effect="${effect.id}">
          <div class="effect-preview-content effect-${effect.id}">
            <span class="effect-preview-name">${effect.name}</span>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // 添加点击事件
    const effectCards = document.querySelectorAll('.effect-preview');
    effectCards.forEach(card => {
      card.addEventListener('click', () => {
        const effectId = card.getAttribute('data-effect');
        this.setEffect(effectId);
        
        // 移除其他卡片的活动状态
        effectCards.forEach(c => c.classList.remove('active'));
        // 添加活动状态到当前卡片
        card.classList.add('active');
      });
    });
  },
  
  // 设置主题
  setTheme: function(themeId) {
    // 保存到本地存储
    localStorage.setItem('theme', themeId);
    this.currentTheme = themeId;
    
    // 应用主题
    this.applyTheme(themeId);
    
    // 修改主题开关状态（仅限设置页面）
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.checked = themeId === 'dark' || themeId === 'dark-pastel';
    }
    
    // 显示通知
    if (window.showNotification) {
      showNotification(`已切换到${this.getThemeName(themeId)}主题`, 'success');
    }
    
    // 触发主题改变事件
    window.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { theme: themeId } })
    );
  },
  
  // 设置视觉效果
  setEffect: function(effectId) {
    // 保存到本地存储
    localStorage.setItem('effect', effectId);
    this.currentEffect = effectId;
    
    // 应用效果
    this.applyEffect(effectId);
    
    // 显示通知
    if (window.showNotification) {
      showNotification(`已应用${this.getEffectName(effectId)}`, 'success');
    }
  },
  
  // 应用主题到DOM
  applyTheme: function(themeId) {
    document.body.setAttribute('data-theme', themeId);
    
    // 如果有主题边框元素，同时更新它
    const themeBorder = document.getElementById('theme-border');
    if (themeBorder) {
      themeBorder.className = `theme-border theme-${themeId}`;
    }
  },
  
  // 应用视觉效果
  applyEffect: function(effectId) {
    // 首先移除已有的效果容器
    const existingEffect = document.querySelector('.background-effect');
    if (existingEffect) {
      existingEffect.remove();
    }
    
    // 如果选择"无效果"，则不需要创建新容器
    if (effectId === 'none') return;
    
    // 创建新的效果容器
    const effectElement = document.createElement('div');
    effectElement.className = `background-effect effect-${effectId}`;
    document.body.appendChild(effectElement);
  },
  
  // 获取主题名称
  getThemeName: function(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme.name : '默认';
  },
  
  // 获取效果名称
  getEffectName: function(effectId) {
    const effect = this.effects.find(e => e.id === effectId);
    return effect ? effect.name : '无效果';
  }
};

// 暴露全局接口
window.ThemeManager = ThemeManager;