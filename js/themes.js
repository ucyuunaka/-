/**
 * 课堂助手 - 扩展主题系统
 * 处理多种渐变主题切换
 */

// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化主题系统
  ThemeManager.init();
});

// 主题管理器
const ThemeManager = {
  // 可用的主题列表（渐变组合）
  themes: [
    { id: 'classic-blue-pink', name: '经典蓝粉' },
    { id: 'mint-purple', name: '薄荷紫' },
    { id: 'peach-coral', name: '蜜桃珊瑚' },
    { id: 'green-blue', name: '绿蓝渐变' },
    { id: 'lavender-cream', name: '薰衣草奶油' },
    { id: 'blue-violet', name: '蓝紫渐变' },
    { id: 'coral-mint', name: '珊瑚薄荷' },
    { id: 'sunset', name: '夕阳渐变' },
    { id: 'dark', name: '深色模式' }
  ],
  
  // 当前主题
  currentTheme: 'classic-blue-pink',
  
  // 初始化主题系统
  init: function() {
    // 从本地存储加载主题设置
    this.currentTheme = localStorage.getItem('theme') || 'classic-blue-pink';
    
    // 应用主题
    this.applyTheme(this.currentTheme);
    
    // 渲染主题选择界面（如果在设置页）
    if (document.querySelector('#theme-preview-container')) {
      this.renderThemeSelectors();
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
      themeToggle.checked = themeId === 'dark';
    }
    
    // 显示通知
    if (window.showNotification) {
      showNotification(`已切换到${this.getThemeName(themeId)}`, 'success');
    }
    
    // 触发主题改变事件
    window.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { theme: themeId } })
    );
  },
  
  // 应用主题到DOM
  applyTheme: function(themeId) {
    document.body.setAttribute('data-theme', themeId);
  },
  
  // 获取主题名称
  getThemeName: function(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme.name : '默认';
  }
};

// 暴露全局接口
window.ThemeManager = ThemeManager;