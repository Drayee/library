// 管理员系统JavaScript功能 - 优化版本

// 全局变量
let currentUser = null;
let usersData = [];
let booksData = [];
let borrowData = [];

// 配置常量
const CONFIG = {
    API_BASE: '/Library/Administer',
    MESSAGE_TIMEOUT: 3000,
    SCROLL_THRESHOLD: 50,
    EVENT_DELAY: 100
};

// 页面初始化 - 单一入口点
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 管理员系统初始化开始 ===');
    initializeApplication();
});

/**
* 应用程序初始化
 */
async function initializeApplication() {
    try {
        initializePage();
        setupEventListeners();
        await checkLoginStatus();
        console.log('=== 管理员系统初始化完成 ===');
    } catch (error) {
        console.error('初始化失败:', error);
        showMessage('系统初始化失败', 'error');
    }
}

/**
 * 初始化页面基本状态
 */
function initializePage() {
    // 设置初始界面状态
    document.getElementById('adminInterface').style.display = 'none';
    document.getElementById('loginModal').style.display = 'block';

    // 初始化选项卡
    setupTabEvents();
}

/**
 * 设置所有事件监听器
 */
function setupEventListeners() {
    // 登录相关事件
    setupLoginEvents();

    // 选项卡和导航事件
    setupTabEvents();

    // 模态框和表单事件
    setupModalEvents();

    // 页面交互事件
    setupInteractionEvents();
}

/**
 * 设置登录相关事件
 */
function setupLoginEvents() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * 设置选项卡事件
 */
function setupTabEvents() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

/**
 * 设置模态框和表单事件
 */
function setupModalEvents() {
    // 关闭按钮
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // 模态框外部点击关闭
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });

    // 表单提交事件
    setupFormEvents();
    
    // 图书类别选择事件
    setupCategoryEvents();
}

/**
 * 设置图书类别选择事件
 */
function setupCategoryEvents() {
    const selectCategoryBtn = document.getElementById('selectCategoryBtn');
    const confirmCategoryBtn = document.getElementById('confirmCategoryBtn');
    const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
    const categoryModal = document.getElementById('categoryModal');

    if (selectCategoryBtn) {
        selectCategoryBtn.addEventListener('click', showCategoryModal);
    }

    if (confirmCategoryBtn) {
        confirmCategoryBtn.addEventListener('click', confirmCategorySelection);
    }

    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', closeCategoryModal);
    }
    
    // 加载类别数据
    loadCategoryData();
}

/**
 * 加载图书类别数据
 */
function loadCategoryData() {
    const categoryCheckboxes = document.getElementById('categoryCheckboxes');
    if (!categoryCheckboxes) return;

    // 从type_transform.json获取类别数据（这里使用硬编码，实际应该从服务器获取）
    const categories = {
        "FICTION": "科幻",
        "NON_FICTION": "非-fiction",
"SCIENCE": "科学",
        "HISTORY": "历史",
        "FOREIGN_LANGUAGE": "外语",
        "MATH": "数学",
"BIOLOGY": "生物",
        "GEARTH_SCIENCE": "地球科学",
        "COMPUTER_SCIENCE": "计算机科学",
        "PHYSICS": "物理",
        "CHEMISTRY": "化学",
        "ENGLISH": "英语",
        "SPORTS": "运动",
        "MUSIC": "音乐",
        "DIRTY_BOOK": "成人书籍",
        "OTHER": "其他"
    };

    categoryCheckboxes.innerHTML = Object.entries(categories).map(([key, value]) => `
        <label class="checkbox-label-modal">
            <input type="checkbox" name="bookType" value="${key}" data-chinese="${value}">
            ${value}
        </label>
`).join('');
}

/**
 * 显示图书类别选择模态框
 */
function showCategoryModal() {
    const categoryModal = document.getElementById('categoryModal');
    if (categoryModal) {
        categoryModal.style.display = 'block';
        
        // 恢复之前的选择状态
        const selectedTypes = document.getElementById('bookTypes').value;
        if (selectedTypes) {
            const selectedArray = selectedTypes.split(',');
            document.querySelectorAll('#categoryCheckboxes input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = selectedArray.includes(checkbox.value);
            });
        }
    }
}

/**
 * 确认类别选择
 */
function confirmCategorySelection() {
    const selectedCheckboxes = document.querySelectorAll('#categoryCheckboxes input[type="checkbox"]:checked');
    const selectedTypes = Array.from(selectedCheckboxes).map(cb => cb.value);
    const selectedChineseNames = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-chinese'));
    
    // 更新隐藏字段
    document.getElementById('bookTypes').value = selectedTypes.join(',');
    
    // 更新显示文本
    const selectedText = selectedChineseNames.length > 0 ? 
        selectedChineseNames.join('、') : '请选择图书类别';
    document.getElementById('selectedCategoriesText').textContent = selectedText;
    
    closeCategoryModal();
}

/**
 * 关闭类别选择模态框
 */
function closeCategoryModal() {
    const categoryModal = document.getElementById('categoryModal');
    if (categoryModal) {
        categoryModal.style.display = 'none';
    }
}

/**
 * 关闭所有模态框
 */
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

/**
 * 设置表单事件
 */
function setupFormEvents() {
    // 使用事件委托处理所有表单提交
    document.addEventListener('submit', function(event) {
        const formId = event.target.id;

        switch (formId) {
            case 'loginForm':
                event.preventDefault();
                handleLogin(event);
                break;
            case 'addUserForm':
                event.preventDefault();
                addUser(event);
                break;
            case 'addBookForm':
                event.preventDefault();
                addBook(event);
                break;
            case 'editForm':
                event.preventDefault();
                handleEdit(event);
                break;
        }
    });
}

/**
 * 设置页面交互事件
 */
function setupInteractionEvents() {
    // 页面滚动
    window.addEventListener('scroll', handleScroll);

    // 修复输入框状态
    setTimeout(fixInputElements, CONFIG.EVENT_DELAY);
}

/**
 * 切换选项卡
 */
function switchTab(tabId) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // 移除所有激活状态
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // 激活当前选项卡
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);

    if (activeBtn && activeContent) {
        activeBtn.classList.add('active');
        activeContent.classList.add('active');

        // 滚动到选项卡区域
        document.querySelector('.tab-section')?.scrollIntoView({ behavior: 'smooth' });

        // 加载对应数据
        setTimeout(() => loadTabData(tabId), 50);
    }
}

/**
 * 检查登录状态
 */
async function checkLoginStatus() {
    const savedUser = localStorage.getItem('adminUser');

    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            await showAdminInterface();
        } catch (error) {
            console.error('解析用户数据失败:', error);
            localStorage.removeItem('adminUser');
        }
    }
}

/**
 * 处理登录
 */
async function handleLogin(event) {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (!username || !password) {
        showMessage('请输入用户名和密码', 'error');
        return;
    }

    try {
        const response = await fetch(CONFIG.API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', username, password })
        });

        if (response.ok) {
            const result = await response.json();

            if (result.success) {
                currentUser = { username };
                localStorage.setItem('adminUser', JSON.stringify(currentUser));
                await showAdminInterface();
                showMessage('登录成功！', 'success');
            } else {
                handleLoginFailure(result.message);
            }
        } else {
            handleLoginFailure('服务器错误');
        }
    } catch (error) {
        handleLoginFailure('网络错误');
    }
}

/**
 * 处理登录失败
 */
function handleLoginFailure(message) {
    showMessage(`登录失败：${message}`, 'error');
    setTimeout(() => {
        window.location.href = '/Library';
    }, 2000);
}

/**
 * 显示管理员界面
 */
async function showAdminInterface() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminInterface').style.display = 'block';

    // 更新用户信息显示
    document.getElementById('adminName').textContent = currentUser.username;
    document.getElementById('welcomeTitle').textContent = `欢迎回来，${currentUser.username}！`;

    // 加载数据
    await loadAllData();

    // 修复界面元素状态
    setTimeout(fixInputElements, CONFIG.EVENT_DELAY);
}

/**
 * 处理退出登录
 */
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('adminUser');
    showLoginInterface();
    clearAllData();
    showMessage('已退出登录', 'success');
}

/**
 * 显示登录界面
 */
function showLoginInterface() {
    document.getElementById('adminInterface').style.display = 'none';
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('loginForm').reset();
}

/**
 * 加载所有数据
 */
async function loadAllData() {
    try {
        await Promise.all([
            loadUsers(),
            loadBooks(),
            loadBorrowRecords()
        ]);
        updateStatistics();
    } catch (error) {
        console.error('加载数据失败:', error);
        showMessage('加载数据失败', 'error');
    }
}

/**
 * 加载用户数据
 */
async function loadUsers() {
    try {
        const response = await apiRequest('getUsers');
        
        // 处理各种可能的响应格式
        if (response && response.success) {
            // 确保data是数组
            if (Array.isArray(response.data)) {
                usersData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                // 如果data是对象，尝试转换为数组
                usersData = Object.values(response.data);
            } else {
                usersData = [];
                console.warn('getUsers API返回的数据格式不正确，使用空数组');
            }
        } else {
            usersData = [];
            console.warn('getUsers API返回失败响应，使用空数组');
        }
        
        displayUsers(usersData);
    } catch (error) {
        console.error('加载用户数据失败:', error);
        
        // 显示具体的错误信息
        if (error.message.includes('网络连接失败')) {
            showMessage('网络连接失败，请检查网络连接', 'error');
        } else if (error.message.includes('服务器错误')) {
            showMessage('服务器暂时不可用，请稍后重试', 'error');
        } else {
            showMessage('加载用户数据失败: ' + error.message, 'error');
        }
        
        // 设置空数据以避免界面显示问题
        usersData = [];
        displayUsers(usersData);
    }
}

/**
 * 加载图书数据
 */
async function loadBooks() {
    try {
        const response = await apiRequest('getBooks');
        
        // 处理各种可能的响应格式
        if (response && response.success) {
            // 确保data是数组
            if (Array.isArray(response.data)) {
                booksData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                // 如果data是对象，尝试转换为数组
                booksData = Object.values(response.data);
            } else {
                booksData = [];
                console.warn('getBooks API返回的数据格式不正确，使用空数组');
            }
        } else {
            booksData = [];
            console.warn('getBooks API返回失败响应，使用空数组');
        }
        
        displayBooks(booksData);
    } catch (error) {
        console.error('加载图书数据失败:', error);
        
        // 显示具体的错误信息
        if (error.message.includes('网络连接失败')) {
            showMessage('网络连接失败，请检查网络连接', 'error');
        } else if (error.message.includes('服务器错误')) {
            showMessage('服务器暂时不可用，请稍后重试', 'error');
        } else {
            showMessage('加载图书数据失败: ' + error.message, 'error');
        }
        
        // 设置空数据以避免界面显示问题
        booksData = [];
        displayBooks(booksData);
    }
}

/**
 * 加载借阅记录
 */
async function loadBorrowRecords() {
    try {
        const response = await apiRequest('getBorrowRecords');
        
        // 处理各种可能的响应格式
        if (response && response.success) {
            // 确保data是数组
            if (Array.isArray(response.data)) {
                borrowData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                // 如果data是对象，尝试转换为数组
                borrowData = Object.values(response.data);
            } else {
                borrowData = [];
                console.warn('getBorrowRecords API返回的数据格式不正确，使用空数组');
            }
        } else {
            borrowData = [];
            console.warn('getBorrowRecords API返回失败响应，使用空数组');
        }
        
        displayBorrowRecords(borrowData);
    } catch (error) {
        console.error('加载借阅记录失败:', error);
        
        // 显示具体的错误信息
        if (error.message.includes('网络连接失败')) {
            showMessage('网络连接失败，请检查网络连接', 'error');
        } else if (error.message.includes('服务器错误')) {
            showMessage('服务器暂时不可用，请稍后重试', 'error');
        } else {
            showMessage('加载借阅记录失败: ' + error.message, 'error');
        }
        
        // 设置空数据以避免界面显示问题
        borrowData = [];
        displayBorrowRecords(borrowData);
    }
}

/**
 * 通用API请求函数
 */
async function apiRequest(action, data = null) {
    try {
        const requestBody = { action };
        if (data) requestBody.data = data;

        const response = await fetch(CONFIG.API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
            // 检查响应内容类型和内容长度
            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');
            
            // 如果响应为空或不是JSON格式，返回默认的成功响应
            if (!contentType || !contentType.includes('application/json') || 
                (contentLength && parseInt(contentLength) === 0)) {
                console.warn(`API响应不是有效的JSON格式 (${action})，返回默认成功响应`);
                return { success: true, data: [] };
            }
            
            // 尝试解析JSON响应
            const responseText = await response.text();
            
            // 如果响应文本为空，返回默认成功响应
            if (!responseText.trim()) {
                console.warn(`API响应为空 (${action})，返回默认成功响应`);
                return { success: true, data: [] };
            }
            
try {
                return JSON.parse(responseText);
            } catch (parseError) {
                console.error(`JSON解析失败 (${action}):`, parseError, '响应文本:', responseText);
                throw new Error(`服务器返回了无效的JSON格式: ${parseError.message}`);
            }
        } else {
            // 服务器返回错误状态码
            const errorText = await response.text();
            console.error(`服务器错误 (${action}):`, response.status, errorText);
            throw new Error(`服务器错误: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`API请求失败 (${action}):`, error);
        
        // 如果是网络错误，提供更友好的错误信息
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('网络连接失败，请检查网络连接');
        }
        
        throw error;
    }
}

/**
 * 显示用户数据
 */
function displayUsers(users) {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id || 'N/A'}</td>
            <td>${user.name || 'N/A'}</td>
            <td>${user.number || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td class="status-${user.status === 'active' ? 'active' : 'inactive'}">
                ${user.status === 'active' ? '活跃' : '禁用'}
            </td>
            <td>
                <button class="action-btn edit" onclick="editUser(${user.id})">编辑</button>
                <button class="action-btn delete" onclick="deleteUser(${user.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

/**
 * 显示图书数据
 */
function displayBooks(books) {
    const tbody = document.getElementById('bookTableBody');
    if (!tbody) return;

    tbody.innerHTML = books.map(book => `
        <tr>
            <td>${book.id || 'N/A'}</td>
            <td>${book.title || 'N/A'}</td>
            <td>${book.author || 'N/A'}</td>
            <td>${book.isbn || 'N/A'}</td>
            <td>${book.stock || 0}</td>
            <td class="status-${book.status === 'available' ? 'available' : 'borrowed'}">
                ${book.status === 'available' ? '可借' : '已借出'}
            </td>
            <td>
                <button class="action-btn edit" onclick="editBook(${book.id})">编辑</button>
<button class="action-btn delete" onclick="deleteBook(${book.id})">删除</button>
</td>
        </tr>
    `).join('');
}

/**
 * 显示借阅记录
 */
function displayBorrowRecords(records) {
    const tbody = document.getElementById('borrowTableBody');
    if (!tbody) return;

    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.id || 'N/A'}</td>
            <td>${record.userId || 'N/A'}</td>
            <td>${record.bookId || 'N/A'}</td>
            <td>${record.borrowDate || 'N/A'}</td>
            <td>${record.dueDate || 'N/A'}</td>
            <td class="status-${record.status === 'returned' ? 'active' : 'borrowed'}">
                ${record.status === 'returned' ? '已归还' : '借阅中'}
            </td>
            <td>
                <button class="action-btn" onclick="returnBook(${record.id})">归还</button>
            </td>
        </tr>
    `).join('');
}

/**
 * 更新统计信息
 */
function updateStatistics() {
    const totalUsersElem = document.getElementById('totalUsers');
    const totalBooksElem = document.getElementById('totalBooks');
    const borrowedBooksElem = document.getElementById('borrowedBooks');

    if (totalUsersElem) totalUsersElem.textContent = usersData.length;
    if (totalBooksElem) totalBooksElem.textContent = booksData.length;
    if (borrowedBooksElem) {
        borrowedBooksElem.textContent = borrowData.filter(r => r.status !== 'returned').length;
    }
}

/**
 * 处理页面滚动
 */
function handleScroll() {
    const nav = document.querySelector('.top-nav');
    if (!nav) return;

    if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

/**
 * 关闭模态框
 */
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

/**
 * 修复输入框元素状态
 */
function fixInputElements() {
    const inputs = document.querySelectorAll('input, textarea, select, button');

    inputs.forEach(input => {
        // 确保元素可交互
        input.disabled = false;
        input.readOnly = false;
        input.style.pointerEvents = 'auto';
        input.style.userSelect = 'auto';
        input.style.opacity = '1';
        input.style.cursor = 'default';
    });
}

/**
 * 加载选项卡数据
 */
function loadTabData(tabId) {
    switch (tabId) {
        case 'users':
            loadUsers();
            break;
        case 'books':
            loadBooks();
            break;
        case 'borrow':
            loadBorrowRecords();
            break;
        case 'addUser':
            // 添加用户选项卡不需要加载额外数据
            break;
        case 'addBook':
            // 添加书籍选项卡不需要加载额外数据
            break;
    }
}

/**
 * 编辑用户
 */
function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (user) showEditModal('user', user);
}

/**
 * 编辑图书
 */
function editBook(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (book) showEditModal('book', book);
}

/**
 * 显示编辑模态框
 */
function showEditModal(type, data) {
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');
    const formContent = document.getElementById('modalFormContent');

    if (!modal || !modalTitle || !formContent) return;

    modalTitle.textContent = type === 'user' ? '编辑用户信息' : '编辑图书信息';

    if (type === 'user') {
        formContent.innerHTML = `
            <input type="hidden" name="id" value="${data.id}">
            <div class="form-group">
                <input type="text" name="name" value="${data.name || ''}" placeholder="姓名" required>
            </div>
            <div class="form-group">
                <input type="text" name="number" value="${data.number || ''}" placeholder="学号" required>
            </div>
            <div class="form-group">
                <input type="email" name="email" value="${data.email || ''}" placeholder="邮箱" required>
            </div>
            <div class="form-group">
                <select name="status" required>
                    <option value="active" ${data.status === 'active' ? 'selected' : ''}>活跃</option>
                    <option value="inactive" ${data.status === 'inactive' ? 'selected' : ''}>禁用</option>
                </select>
            </div>
        `;
    } else {
        formContent.innerHTML = `
            <input type="hidden" name="id" value="${data.id}">
            <div class="form-group">
                <input type="text" name="title" value="${data.title || ''}" placeholder="书名" required>
            </div>
            <div class="form-group">
                <input type="text" name="author" value="${data.author || ''}" placeholder="作者" required>
            </div>
            <div class="form-group">
                <input type="text" name="isbn" value="${data.isbn || ''}" placeholder="ISBN" required>
            </div>
        `;
    }

    modal.style.display = 'block';
}

/**
 * 处理编辑提交
 */
async function handleEdit(event) {
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const type = data.name ? 'user' : 'book';

    try {
        const response = await apiRequest(
            type === 'user' ? 'updateUser' : 'updateBook',
            data
        );

        if (response?.success) {
            showMessage('更新成功！', 'success');
            closeModal();
            await loadAllData();
        } else {
            showMessage('更新失败', 'error');
        }
    } catch (error) {
        showMessage('更新失败：网络错误', 'error');
    }
}

/**
 * 删除用户
 */
async function deleteUser(userId) {
    if (confirm('确定要删除该用户吗？')) {
        try {
            const response = await apiRequest('deleteUser', { userId });

            if (response?.success) {
                showMessage('用户删除成功！', 'success');
                await loadAllData();
            } else {
                showMessage('删除失败', 'error');
            }
        } catch (error) {
            showMessage('删除失败：网络错误', 'error');
        }
    }
}

/**
 * 删除图书
 */
async function deleteBook(bookId) {
    if (confirm('确定要删除该图书吗？')) {
        try {
            const response = await apiRequest('deleteBook', { bookId });

            if (response?.success) {
                showMessage('图书删除成功！', 'success');
                await loadAllData();
            } else {
                showMessage('删除失败', 'error');
            }
        } catch (error) {
            showMessage('删除失败：网络错误', 'error');
        }
    }
}

/**
 * 归还图书
 */
async function returnBook(recordId) {
    try {
        const response = await apiRequest('returnBook', { recordId });

        if (response?.success) {
            showMessage('图书归还成功！', 'success');
            await loadAllData();
        } else {
            showMessage('归还失败', 'error');
        }
    } catch (error) {
        showMessage('归还失败：网络错误', 'error');
    }
}

/**
 * 添加用户
 */
async function addUser(event) {
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 验证必填字段
    if (!data.userName) {
        showMessage('请填写所有必填字段', 'error');
        return;
    }

    try {
        const response = await apiRequest('addUser', {
            name: data.userName,
            number: data.userNumber,
            email: data.userEmail
        });

        if (response?.success) {
            showMessage('用户添加成功！', 'success');
            form.reset();
            await loadUsers();
            updateStatistics();
        } else {
            showMessage('添加失败', 'error');
        }
    } catch (error) {
        showMessage('添加失败：网络错误', 'error');
    }
}

/**
 * 添加图书
 */
async function addBook(event) {
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 验证必填字段 - 修正字段名称匹配问题
    if (!data.bookTitle || !data.bookAuthor || !data.bookISBN || !data.bookCampus || !data.bookFloor || !data.bookShelf) {
        showMessage('请填写所有必填字段', 'error');
        return;
    }

    // 验证图书类别
    const bookTypes = data.bookTypes;
    if (!bookTypes) {
        showMessage('请选择至少一个图书类别', 'error');
        return;
    }

    try {
        // 将类别字符串转换为数组
        data.bookTypes = bookTypes.split(',');

        // 修正API请求数据字段名称
        const response = await apiRequest('addBook', {
            title: data.bookTitle,
            author: data.bookAuthor,
            isbn: data.bookISBN,
            campus: data.bookCampus,
            floor: data.bookFloor,
            shelf: data.bookShelf,
            bookTypes: data.bookTypes
        });

        if (response?.success) {
            showMessage('图书添加成功！', 'success');
            form.reset();
            // 重置类别选择
            document.getElementById('bookTypes').value = '';
            document.getElementById('selectedCategoriesText').textContent = '请选择图书类别';
            await loadAllData();
        } else {
            showMessage('添加失败', 'error');
        }
    } catch (error) {
        showMessage('添加失败：网络错误', 'error');
    }
}

/**
 * 显示消息
 */
function showMessage(message, type) {
    const messageDiv = document.getElementById('globalMessage');
    if (!messageDiv) return;

    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, CONFIG.MESSAGE_TIMEOUT);
}

/**
 * 清空所有数据
 */
function clearAllData() {
    usersData = [];
    booksData = [];
    borrowData = [];

    const tables = ['userTableBody', 'bookTableBody', 'borrowTableBody'];
    tables.forEach(tableId => {
        const tbody = document.getElementById(tableId);
        if (tbody) tbody.innerHTML = '';
    });

    updateStatistics();
}