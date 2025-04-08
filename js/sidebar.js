/**
 * 课堂助手 - 侧边栏导航功能
 * 处理侧边栏的交互效果，包括点击切换页面、响应式显示隐藏等
 */

// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 加载侧边栏HTML内容
  loadSidebarContent();
});

/**
 * 加载侧边栏HTML内容
 */
function loadSidebarContent() {
  // 查找侧边栏元素
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebar) {
    // 加载侧边栏内容
    fetch('pages/sidebar.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('无法加载侧边栏模板');
        }
        return response.text();
      })
      .then(html => {
        // 插入侧边栏内容
        sidebar.innerHTML = html;
        
        // 初始化侧边栏功能
        initSidebar();
        
        // 监听主题变化事件
        listenForThemeChanges();
        
        // 初始化侧边栏悬停功能
        initSidebarHover();
      })
      .catch(error => {
        console.error('侧边栏加载失败:', error);
      });
  }
}

/**
 * 初始化侧边栏功能
 */
function initSidebar() {
  // 获取当前页面路径，用于高亮当前页对应的菜单项
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop();
  
  // 初始化菜单项高亮
  highlightCurrentMenuItem(pageName);
  
  // 为所有菜单项添加点击事件
  const menuItems = document.querySelectorAll('.sidebar-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      // 获取链接地址
      const link = this.getAttribute('data-href');
      if (link) {
        // 页面跳转
        window.location.href = link;
      }
    });
  });
  
  // 移动端侧边栏切换
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      toggleSidebar();
    });
  }
  
  if (overlay) {
    overlay.addEventListener('click', function() {
      toggleSidebar(false);
    });
  }
  
  // 窗口大小改变时处理
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      toggleSidebar(false);
    }
  });
}

/**
 * 初始化侧边栏悬停效果，确保页脚位置正确
 */
function initSidebarHover() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        updateFooterPosition(true);
      }
    });
    
    sidebar.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        updateFooterPosition(false);
      }
    });
  }
}

/**
 * 更新页脚位置以匹配侧边栏状态
 * @param {boolean} expanded - 侧边栏是否展开
 */
function updateFooterPosition(expanded) {
  const footers = document.querySelectorAll('.footer');
  footers.forEach(footer => {
    if (expanded) {
      footer.style.marginLeft = '280px';
      footer.style.width = 'calc(100% - 280px)';
    } else {
      footer.style.marginLeft = '110px';
      footer.style.width = 'calc(100% - 110px)';
    }
    
    // 在移动视图中确保页脚宽度正确
    if (window.innerWidth <= 768) {
      footer.style.marginLeft = '0';
      footer.style.width = '100%';
    }
  });
}

/**
 * 监听主题变化事件
 * 当网站主题发生变化时，确保侧边栏也随之适配
 */
function listenForThemeChanges() {
  // 监听主题变化自定义事件
  window.addEventListener('themeChanged', function(e) {
    // 侧边栏不需要特殊处理，因为我们使用了 [data-theme="dark"] 选择器
    // CSS 会自动应用相应的样式
    
    // 可以在这里添加额外的侧边栏主题相关处理
    console.log('主题已变更为: ' + e.detail.theme);
  });
}

/**
 * 高亮当前页面对应的菜单项
 * @param {string} pageName - 当前页面文件名
 */
function highlightCurrentMenuItem(pageName) {
  // 默认高亮首页
  let itemToHighlight = 'index.html';
  
  // 如果有特定的页面名
  if (pageName && pageName !== '') {
    itemToHighlight = pageName;
  }
  
  // 寻找并高亮对应的菜单项
  const menuItems = document.querySelectorAll('.sidebar-item');
  menuItems.forEach(item => {
    const itemLink = item.getAttribute('data-href');
    
    // 移除所有高亮
    item.classList.remove('active');
    
    // 如果匹配当前页面，添加高亮
    if (itemLink && itemLink.includes(itemToHighlight)) {
      item.classList.add('active');
    }
  });
}

/**
 * 移动端切换侧边栏显示/隐藏
 * @param {boolean|null} show - 是否显示，null表示切换状态
 */
function toggleSidebar(show = null) {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (!sidebar) return;
  
  // 确定最终状态
  const shouldShow = show === null ? !sidebar.classList.contains('active') : show;
  
  // 更新侧边栏和遮罩层状态
  if (shouldShow) {
    sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
  } else {
    sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }
}