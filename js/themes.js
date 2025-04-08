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
    
    // 设置页面初始化小球主题切换器
    this.initThemeBalls();
  },
  
  // 初始化小球主题切换器
  initThemeBalls: function() {
    const themeBalls = document.querySelectorAll('.theme-ball');
    const currentThemeDisplay = document.getElementById('current-theme');
    
    if (!themeBalls.length) return;
    
    // 更新活动小球状态
    this.updateActiveBall(this.currentTheme);
    
    // 为每个主题小球添加点击事件
    themeBalls.forEach(ball => {
      ball.addEventListener('click', () => {
        const themeId = ball.getAttribute('data-theme');
        this.setTheme(themeId);
        this.updateActiveBall(themeId);
      });
    });
    
    // 初始更新当前主题显示
    if (currentThemeDisplay) {
      currentThemeDisplay.textContent = `当前主题: ${this.getThemeName(this.currentTheme)}`;
    }
  },
  
  // 更新主题小球的活动状态
  updateActiveBall: function(themeId) {
    const themeBalls = document.querySelectorAll('.theme-ball');
    const currentThemeDisplay = document.getElementById('current-theme');
    
    themeBalls.forEach(ball => {
      if (ball.getAttribute('data-theme') === themeId) {
        ball.classList.add('active');
      } else {
        ball.classList.remove('active');
      }
    });
    
    // 更新当前主题显示
    if (currentThemeDisplay) {
      currentThemeDisplay.textContent = `当前主题: ${this.getThemeName(themeId)}`;
    }
  },
  
  // 设置主题
  setTheme: function(themeId) {
    // 保存到本地存储
    localStorage.setItem('theme', themeId);
    this.currentTheme = themeId;
    
    // 应用主题
    this.applyTheme(themeId);
    
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
    
    // 触发主题改变事件
    window.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { theme: themeId } })
    );
  },
  
  // 获取主题名称
  getThemeName: function(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme.name : '默认';
  }
};

// 暴露全局接口
window.ThemeManager = ThemeManager;