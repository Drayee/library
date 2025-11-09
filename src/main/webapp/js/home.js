// 个人主页交互功能 - 修复和优化版本
window.addEventListener('DOMContentLoaded', function() {
    console.log('个人主页交互功能开始加载...');
    
    // 获取用户数据（从sessionStorage获取）
    function getUserData() {
        // 从sessionStorage获取用户数据
        const storedData = sessionStorage.getItem('userData');
        if (storedData) {
            try {
                const userData = JSON.parse(storedData);
                console.log('从sessionStorage获取用户数据:', userData);
                return userData;
            } catch (e) {
                console.error('解析sessionStorage数据失败:', e);
            }
        }
        
        // 如果sessionStorage中没有，尝试从URL的GET参数获取（兼容性）
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        const uniquecode = urlParams.get('uniquecode');
        
        if (name && uniquecode) {
            const userData = {
                name: name,
                uniquecode: parseInt(uniquecode)
            };
            console.log('从URL参数获取用户数据:', userData);
            return userData;
        }
        
        console.log('使用默认用户数据');
        return { name: '用户', uniquecode: 0 }; // 默认值
    }
    
    // 获取用户名
    function getUsername() {
        const userData = getUserData();
        return userData.name || '用户';
    }
    
    // 发送POST请求获取借阅数据
    async function fetchBorrowedBooks() {
        const userData = getUserData();
        
        if (!userData.name || !userData.uniquecode) {
            console.error('缺少用户数据，无法获取借阅信息');
            return [];
        }
        
        // 使用URLSearchParams替代FormData
        const params = new URLSearchParams();
        params.append('username', userData.name);
        params.append('uniquecode', userData.uniquecode.toString());
        
        const response = await fetch('/Library/home', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('收到服务器响应:', result);
        
        if (result.message === 'OK' && result.books) {
            // 解析书籍数据
            try {
                // 检查books字段的类型
                let books;
                if (typeof result.books === 'string') {
                    // 如果是字符串，需要解析JSON
                    const booksJson = result.books.replace(/^"|"$/g, '');
                    books = JSON.parse(booksJson);
                } else if (Array.isArray(result.books)) {
                    // 如果已经是数组，直接使用
                    books = result.books;
                } else {
                    console.error('books字段格式不正确:', result.books);
                    return [];
                }
                
                console.log('解析后的书籍数据:', books);
                return Array.isArray(books) ? books : [];
            } catch (parseError) {
                console.error('解析书籍数据失败:', parseError);
                return [];
            }
        } else {
            console.error('服务器返回错误:', result);
            return [];
        }
    }
    
    // 计算还书日期（借书日期+30天）
    function calculateDueDate(lendDate) {
        if (!lendDate) return '未知日期';
        
        try {
            const lend = new Date(lendDate);
            lend.setDate(lend.getDate() + 30);
            return lend.toISOString().split('T')[0];
        } catch (e) {
            console.error('计算还书日期失败:', e);
            return '未知日期';
        }
    }
    
    // 更新借阅区域显示
    async function updateBorrowedBooksDisplay() {
        console.log('开始更新借阅区域显示...');
        const booksGrid = document.querySelector('#borrowed .books-grid');
        
        if (!booksGrid) {
            console.error('找不到借阅区域容器');
            return;
        }
        
        // 显示加载状态
        booksGrid.innerHTML = '<div class="loading">正在加载借阅数据...</div>';
        
        const books = await fetchBorrowedBooks();
        console.log('获取到的书籍数量:', books.length);
        
        // 更新欢迎横幅中的当前借阅数量
        updateBorrowedStats(books.length);
        
        if (books.length === 0) {
            booksGrid.innerHTML = '<div class="no-books">暂无借阅书籍</div>';
            return;
        }
        
        // 清空并重新填充书籍网格
        booksGrid.innerHTML = '';
        
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            // 根据书籍ID生成不同的封面颜色
            const coverColors = ['#2a7e3f', '#1e6ea7', '#8e44ad', '#e74c3c', '#f39c12', '#16a085'];
            const colorIndex = book.id % coverColors.length;
            
            const dueDate = calculateDueDate(book.lenddate);
            
            bookCard.innerHTML = `
                <div class="book-cover" style="background-color: ${coverColors[colorIndex]}">
                    <div class="book-placeholder">${book.id}</div>
                </div>
                <div class="book-info">
                    <h3>书籍 ${book.id}</h3>
                    <p class="book-author">图书馆藏书</p>
                    <p class="book-due">借书日期: ${book.lenddate || '未知'}</p>
                    <p class="book-due">归还日期: ${dueDate}</p>
                    <button class="action-btn renew-btn">续借</button>
                </div>
            `;
            
            booksGrid.appendChild(bookCard);
        });
        
        console.log('借阅区域更新完成');
        
        // 重新绑定续借按钮事件
        const renewBtns = document.querySelectorAll('#borrowed .renew-btn');
        renewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const bookCard = this.closest('.book-card');
                const bookTitle = bookCard.querySelector('h3')?.textContent || '未知书籍';
                alert(`续借操作: ${bookTitle}\n\n续借功能正在开发中...`);
            });
        });
    }
    
    // 更新欢迎横幅中的统计数字
    function updateBorrowedStats(borrowedCount) {
        console.log('更新借阅统计数字:', borrowedCount);
        
        // 找到当前借阅的统计数字元素
        const borrowedStat = document.querySelector('.stat-item:first-child .stat-number');
        if (borrowedStat) {
            // 移除之前的动画（如果有）
            borrowedStat.textContent = borrowedCount;
            
            // 添加数字动画效果
            animateNumber(borrowedStat, borrowedCount);
        }
        
        // 同时更新累计阅读数量（可以设置为当前借阅数量的2倍或其他逻辑）
        const totalReadStat = document.querySelector('.stat-item:nth-child(2) .stat-number');
        if (totalReadStat) {
            const totalReadCount = borrowedCount * 2; // 简单逻辑：累计阅读是当前借阅的2倍
            animateNumber(totalReadStat, totalReadCount);
        }
    }
    
    // 数字动画效果
    function animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        if (currentValue === targetValue) return;
        
        const duration = 1000; // 动画持续时间
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数使动画更自然
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(currentValue + (targetValue - currentValue) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
    
    // 更新页面用户名显示
    function updateUsernameDisplay() {
        const username = getUsername();
        
        // 更新导航栏用户名
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = username;
        }
        
        // 更新欢迎标题
        const welcomeTitle = document.getElementById('welcomeTitle');
        if (welcomeTitle) {
            welcomeTitle.textContent = `欢迎回来，${username}！`;
        }
        
        // 更新头像占位符（取第一个字符）
        const avatarInitial = document.getElementById('avatarInitial');
        if (avatarInitial) {
            avatarInitial.textContent = username.charAt(0);
        }
        
        console.log('用户名已更新为:', username);
    }
    
    // 页面加载时立即更新用户名和借阅数据
    updateUsernameDisplay();
    updateBorrowedBooksDisplay();
    
    // 修复选项卡切换功能
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有激活状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加当前激活状态
            this.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // 确保内容完全显示
                targetContent.style.display = 'block';
                targetContent.style.overflow = 'visible';
            }
            
            // 按钮点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // 修复搜索功能
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    function performSearch(term) {
        if (!term) {
            alert('请输入搜索关键词');
            return;
        }
        
        // 添加搜索按钮动画
        searchBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            searchBtn.style.transform = 'scale(1)';
        }, 150);
        
        // 模拟搜索RESULT的结果
        console.log('搜索关键词:', term);
        alert('正在搜索: "' + term + '"\n\n搜索功能正在开发中，即将为您展示相关书籍...');
        
        // 清空搜索框
        searchInput.value = '';
    }
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value.trim());
        });
        
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch(this.value.trim());
            }
        });
        
        // 搜索输入框动画
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.boxShadow = '0 4px 20px rgba(42, 126, 63, 0.3)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.parentElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        });
    }
    
    // 修复书籍操作按钮交互
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionType = this.classList.contains('renew-btn') ? '续借' : 
                              this.classList.contains('borrow-btn') ? '借阅' : '移除';
            
            // 按钮点击动画
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // 获取书籍标题
            const card = this.closest('.book-card, .recommend-card, .favorite-card');
            if (!card) return;
            
            const bookTitle = card.querySelector('h3')?.textContent || '未知书籍';
            
            if (actionType === '移除') {
                if (confirm(`确定要移除《${bookTitle}》吗？`)) {
                    card.style.opacity = '0.5';
                    card.style.pointerEvents = 'none';
                    setTimeout(() => {
                        alert(`《${bookTitle}》已从收藏中移除`);
                    }, 300);
                }
            } else {
                alert(`${actionType}操作: 《${bookTitle}》\n\n${actionType}功能正在开发中，即将为您处理...`);
            }
        });
    });
    
    // 修复用户头像悬停效果
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        userAvatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // 修复下拉菜单动画
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.addEventListener('mouseenter', function() {
            const dropdownMenu = this.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.transform = 'translateY(0)';
            }
        });
        
        userDropdown.addEventListener('mouseleave', function() {
            const dropdownMenu = this.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.transform = 'translateY(-10px)';
            }
        });
    }
    
    // 修复页面滚动时导航栏效果
    let lastScrollTop = 0;
    const topNav = document.querySelector('.top-nav');
    
    if (topNav) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // 向下滚动
                topNav.style.transform = 'translateY(-100%)';
            } else {
                // 向上滚动
                topNav.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            
            // 显示/隐藏滚动到顶部按钮
            toggleScrollToTopButton(scrollTop);
        });
    }

    
    // 修复卡片悬停效果
    const cards = document.querySelectorAll('.book-card, .recommend-card, .favorite-card, .history-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.zIndex = '1';
        });
    });
    
    // 修复滚动到顶部按钮功能
    function createScrollToTopButton() {
        let scrollToTopBtn = document.querySelector('.scroll-to-top');
        if (scrollToTopBtn) return scrollToTopBtn;
        
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.title = '回到顶部';
        scrollToTopBtn.setAttribute('aria-label', '回到页面顶部');
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(scrollToTopBtn);
        return scrollToTopBtn;
    }
    
    function toggleScrollToTopButton(scrollTop) {
        const scrollToTopBtn = createScrollToTopButton();
        const threshold = 300;
        
        if (scrollTop > threshold) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    // 修复移动端导航菜单
    function createMobileMenu() {
        if (window.innerWidth <= 768) {
            const navContainer = document.querySelector('.nav-container');
            if (!navContainer) return;
            
            let mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (!mobileMenuBtn) {
                mobileMenuBtn = document.createElement('button');
                mobileMenuBtn.className = 'mobile-menu-btn';
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.setAttribute('aria-label', '导航菜单');
                navContainer.insertBefore(mobileMenuBtn, navContainer.firstChild);
                
                mobileMenuBtn.addEventListener('click', function() {
                    const userInfo = document.querySelector('.user-info');
                    const searchContainer = document.querySelector('.search-container');
                    
                    [userInfo, searchContainer].forEach(el => {
                        if (el) {
                            const isVisible = el.classList.contains('show');
                            if (isVisible) {
                                el.classList.remove('show');
                                el.style.display = 'none';
                            } else {
                                el.classList.add('show');
                                el.style.display = 'flex';
                            }
                        }
                    });
                });
            }
            
            mobileMenuBtn.style.display = 'block';
        } else {
            // 桌面端显示所有元素
            const userInfo = document.querySelector('.user-info');
            const searchContainer = document.querySelector('.search-container');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (userInfo) userInfo.style.display = 'flex';
            if (searchContainer) searchContainer.style.display = 'flex';
            if (mobileMenuBtn) mobileMenuBtn.style.display = 'none';
        }
    }
    
    // 初始化和窗口大小变化监听
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);
    
    // 初始化滚动到顶部按钮
    createScrollToTopButton();
    
    console.log('个人主页交互功能加载完成');
});