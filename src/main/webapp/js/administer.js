// 管理员系统JavaScript功能

// 全局变量
let currentUser = null;
let usersData = [];
let booksData = [];
let borrowData = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    checkLoginStatus();
});

// 初始化页面
function initializePage() {
    // 默认显示登录界面，隐藏管理员界面
    document.getElementById('adminInterface').style.display = 'none';
    document.getElementById('loginModal').style.display = 'block';

    // 初始化选项卡功能
    initTabs();
}

// 绑定所有事件监听器
// 绑定登录相关事件
// 绑定搜索相关事件
// 绑定表单相关事件
// 绑定其他事件
// 初始化选项卡功能
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // 移除所有激活状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // 激活当前选项卡
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // 滚动到选项卡区域
            document.querySelector('.tab-section').scrollIntoView({ behavior: 'smooth' });

            // 加载对应数据
            loadTabData(tabId);
        });
    });
}

// 检查登录状态
function checkLoginStatus() {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showAdminInterface();
        loadAllData();
    }
}

// 处理页面滚动
function handleScroll() {
    const nav = document.querySelector('.top-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

// 关闭模态框
function closeModal() {
document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// 处理登录
async function handleLogin(event) {
event.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    // 使用POST方法发送登录请求到/Library/Administer
    try {
        const response = await fetch('/Library/Administer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
action: 'login',
                username: username,
                password: password
            })
        });

if (response.ok) {
            const result = await response.json();
            if (result.success) {
                currentUser = { username: username };
                localStorage.setItem('adminUser', JSON.stringify(currentUser));
                showAdminInterface();
                await loadAllData();
                showMessage('登录成功！', 'success');
            } else {
                showMessage('登录失败：' + result.message, 'error');
                // 登录失败时重定向到/Library
                setTimeout(() => {
                    window.location.href = '/Library';
                }, 2000);
            }
        } else {
            showMessage('登录失败：服务器错误', 'error');
            // 登录失败时重定向到/Library
            setTimeout(() => {
                window.location.href = '/Library';
            }, 2000);
        }
    } catch (error) {
        showMessage('登录失败：网络错误', 'error');
        // 登录失败时重定向到/Library
        setTimeout(() => {
            window.location.href = '/Library';
        }, 2000);
    }
}
// 处理退出登录
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('adminUser');
    showLoginInterface();
    clearAllData();
    showMessage('已退出登录', 'success');
}

// 显示管理员界面
function showAdminInterface() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminInterface').style.display = 'block';
    document.getElementById('adminName').textContent = currentUser.username;
    document.getElementById('welcomeTitle').textContent = `欢迎回来，${currentUser.username}！`;
}

// 显示登录界面
function showLoginInterface() {
    document.getElementById('adminInterface').style.display = 'none';
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('loginForm').reset();
}

// 加载所有数据
async function loadAllData() {
    await loadUsers();
    await loadBooks();
    await loadBorrowRecords();
    updateStatistics();
}

// 加载用户数据
async function loadUsers() {
    try {
        const response = await fetch('/Library/Administer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getUsers'
            })
        });

        if (response.ok) {
            const result = await response.json();
            usersData = result.data || [];
            displayUsers(usersData);
        }
    } catch (error) {
        console.error('加载用户数据失败:', error);
        showMessage('加载用户数据失败', 'error');
    }
}

// 加载图书数据
async function loadBooks() {
    try {
        const response = await fetch('/Library/Administer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getBooks'
            })
        });

        if (response.ok) {
            const result = await response.json();
            booksData = result.data || [];
            displayBooks(booksData);
        }
    } catch (error) {
        console.error('加载图书数据失败:', error);
        showMessage('加载图书数据失败', 'error');
    }
}

// 加载借阅记录
async function loadBorrowRecords() {
    try {
        const response = await fetch('/Library/Administer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getBorrowRecords'
            })
        });

        if (response.ok) {
            const result = await response.json();
            borrowData = result.data || [];
            displayBorrowRecords(borrowData);
        }
    } catch (error) {
        console.error('加载借阅记录失败:', error);
        showMessage('加载借阅记录失败', 'error');
    }
}

// 显示用户数据
function displayUsers(users) {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id || 'N/A'}</td>
            <td>${user.name || 'N/A'}</td>
            <td>${user.number || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td class="status-${user.status === 'active' ? 'active' : 'inactive'}">${user.status === 'active' ? '活跃' : '禁用'}</td>
            <td>
                <button class="action-btn edit" onclick="editUser(${user.id})">编辑</button>
                <button class="action-btn delete" onclick="deleteUser(${user.id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 显示图书数据
function displayBooks(books) {
    const tbody = document.getElementById('bookTableBody');
    tbody.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id || 'N/A'}</td>
            <td>${book.title || 'N/A'}</td>
            <td>${book.author || 'N/A'}</td>
            <td>${book.isbn || 'N/A'}</td>
            <td>${book.stock || 0}</td>
            <td class="status-${book.status === 'available' ? 'available' : 'borrowed'}">${book.status === 'available' ? '可借' : '已借出'}</td>
            <td>
                <button class="action-btn edit" onclick="editBook(${book.id})">编辑</button>
                <button class="action-btn delete" onclick="deleteBook(${book.id})">删除</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 显示借阅记录
function displayBorrowRecords(records) {
    const tbody = document.getElementById('borrowTableBody');
    tbody.innerHTML = '';

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.id || 'N/A'}</td>
            <td>${record.userId || 'N/A'}</td>
            <td>${record.bookId || 'N/A'}</td>
            <td>${record.borrowDate || 'N/A'}</td>
            <td>${record.dueDate || 'N/A'}</td>
            <td class="status-${record.status === 'returned' ? 'active' : 'borrowed'}">${record.status === 'returned' ? '已归还' : '借阅中'}</td>
            <td>
                <button class="action-btn" onclick="returnBook(${record.id})">归还</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 更新统计信息
function updateStatistics() {
    document.getElementById('totalUsers').textContent = usersData.length;
    document.getElementById('totalBooks').textContent = booksData.length;
    document.getElementById('borrowedBooks').textContent = borrowData.filter(r => r.status !== 'returned').length;
}

// 搜索用户
function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    if (searchTerm.trim() === '') {
        displayUsers(usersData);
        return;
    }

    const filteredUsers = usersData.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm)) ||
        (user.number && user.number.toLowerCase().includes(searchTerm)) ||
        (user.email && user.email.toLowerCase().includes(searchTerm))
    );

    displayUsers(filteredUsers);
}

// 搜索图书
function searchBooks() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    if (searchTerm.trim() === '') {
        displayBooks(booksData);
        return;
    }

    const filteredBooks = booksData.filter(book =>
        (book.title && book.title.toLowerCase().includes(searchTerm)) ||
        (book.author && book.author.toLowerCase().includes(searchTerm)) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchTerm))
    );

    displayBooks(filteredBooks);
}

// 搜索借阅记录
function searchBorrow() {
    const searchTerm = document.getElementById('borrowSearch').value.toLowerCase();
    if (searchTerm.trim() === '') {
        displayBorrowRecords(borrowData);
        return;
    }

    const filteredRecords = borrowData.filter(record =>
        (record.userId && record.userId.toString().includes(searchTerm)) ||
        (record.bookId && record.bookId.toString().includes(searchTerm)) ||
        (record.borrowDate && record.borrowDate.toLowerCase().includes(searchTerm))
    );

    displayBorrowRecords(filteredRecords);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners(); // 只保留一次调用
    checkLoginStatus();
});

// 设置事件监听器
function setupEventListeners() {
    // 延迟执行以确保DOM元素已加载
    setTimeout(() => {
        // 登录表单
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // 退出登录
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // 搜索功能
        const searchUserBtn = document.getElementById('searchUserBtn');
        if (searchUserBtn) {
            searchUserBtn.addEventListener('click', searchUsers);
        }

        const searchBookBtn = document.getElementById('searchBookBtn');
        if (searchBookBtn) {
            searchBookBtn.addEventListener('click', searchBooks);
        }

        const searchBorrowBtn = document.getElementById('searchBorrowBtn');
        if (searchBorrowBtn) {
            searchBorrowBtn.addEventListener('click', searchBorrow);
        }

        // 搜索输入框回车键支持
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    searchUsers();
                }
            });
        }

        const bookSearch = document.getElementById('bookSearch');
        if (bookSearch) {
            bookSearch.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    searchBooks();
                }
            });
        }

        const borrowSearch = document.getElementById('borrowSearch');
        if (borrowSearch) {
            borrowSearch.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    searchBorrow();
                }
            });
        }

        // 添加数据表单
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.addEventListener('submit', addUser);
        }

        const addBookForm = document.getElementById('addBookForm');
        if (addBookForm) {
            addBookForm.addEventListener('submit', addBook);
        }

        // 编辑表单提交
        const editForm = document.getElementById('editForm');
        if (editForm) {
            editForm.addEventListener('submit', handleEdit);
        }

        // 页面滚动监听
        window.addEventListener('scroll', handleScroll);

        // 关闭模态框
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        // 点击模态框外部关闭
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                closeModal();
            }
        });

        console.log('事件监听器设置完成');
    }, 100);
}

// 编辑用户
function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (user) {
        showEditModal('user', user);
    }
}

// 编辑图书
function editBook(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (book) {
        showEditModal('book', book);
    }
}

// 清空所有数据
function clearAllData() {
    usersData = [];
    booksData = [];
    borrowData = [];
    document.getElementById('userTableBody').innerHTML = '';
    document.getElementById('bookTableBody').innerHTML = '';
    document.getElementById('borrowTableBody').innerHTML = '';
    updateStatistics();
}

// 加载选项卡数据
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
    }
}

// 显示编辑模态框
function showEditModal(data, type) {
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');
    const formContent = document.getElementById('modalFormContent');
    
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
            <div class="form-group">
                <input type="number" name="stock" value="${data.stock || 0}" placeholder="库存数量" required>
            </div>
        `;
    }
    
    modal.style.display = 'block';
}

// 处理编辑提交
async function handleEdit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const type = data.name ? 'user' : 'book';
    
    try {
        const response = await fetch('/Library/Administer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: type === 'user' ? 'updateUser' : 'updateBook',
                data: data
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showMessage('更新成功！', 'success');
                closeModal();
                await loadAllData();
            } else {
                showMessage('更新失败：' + result.message, 'error');
            }
        } else {
            showMessage('更新失败：服务器错误', 'error');
        }
    } catch (error) {
        showMessage('更新失败：网络错误', 'error');
    }
}

// 删除用户
async function deleteUser(userId) {
    if (confirm('确定要删除该用户吗？')) {
        try {
            const response = await fetch('/Library/Administer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'deleteUser',
                    userId: userId
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    showMessage('用户删除成功！', 'success');
                    await loadAllData();
                } else {
                    showMessage('删除失败：' + result.message, 'error');
                }
            } else {
                showMessage('删除失败：服务器错误', 'error');
            }
        } catch (error) {
            showMessage('删除失败：网络错误', 'error');
        }
    }
}

// 删除图书
async function deleteBook(bookId) {
    if (confirm('确定要删除该图书吗？')) {
        try {
            const response = await fetch('/Library/Administer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'deleteBook',
                    bookId: bookId
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    showMessage('图书删除成功！', 'success');
                    await loadAllData();
                } else {
                    showMessage('删除失败：' + result.message, 'error');
                }
            } else {
                showMessage('删除失败：服务器错误', 'error');
            }
        } catch (error) {
            showMessage('删除失败：网络错误', 'error');
        }
    }
}

// 归还图书
async function returnBook(recordId) {
    try {
        const response = await fetch('/Library/Administer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'returnBook',
                recordId: recordId
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showMessage('图书归还成功！', 'success');
                await loadAllData();
            } else {
                showMessage('归还失败：' + result.message, 'error');
            }
        } else {
            showMessage('归还失败：服务器错误', 'error');
        }
    } catch (error) {
        showMessage('归还失败：网络错误', 'error');
    }
}

// 显示消息
function showMessage(message, type) {
    const messageDiv = document.getElementById('globalMessage');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// 检查和修复所有输入框状态
function fixAllInputElements() {
    console.log('开始检查和修复输入框状态...');
    
    const allInputs = document.querySelectorAll('input, textarea, select');
    console.log(`找到 ${allInputs.length} 个输入元素`);
    
    allInputs.forEach((input, index) => {
        console.log(`检查输入框 ${index + 1}:`, {
            id: input.id,
            type: input.type,
            disabled: input.disabled,
            readonly: input.readOnly,
            style: {
                pointerEvents: input.style.pointerEvents,
                userSelect: input.style.userSelect,
                opacity: input.style.opacity,
                cursor: input.style.cursor
            }
        });
        
        // 移除禁用和只读属性
        input.disabled = false;
        input.readOnly = false;
        
        // 确保正确的CSS样式
        input.style.pointerEvents = 'auto';
        input.style.userSelect = 'auto';
        input.style.opacity = '1';
        input.style.cursor = 'text';
        input.style.backgroundColor = 'white';
        
        // 添加焦点事件监听器用于调试
        input.addEventListener('focus', function() {
            console.log('输入框获得焦点:', this.id || this.name || '未命名输入框');
        });
        
        input.addEventListener('input', function() {
            console.log('输入框内容变化:', this.id || this.name || '未命名输入框', '值:', this.value);
        });
    });
    
    console.log('输入框状态检查和修复完成');
}

// 修改页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 页面初始化开始 ===');
    initializePage();
    setupEventListeners();
    checkLoginStatus();
    
    // 延迟修复输入框状态
    setTimeout(() => {
        fixAllInputElements();
    }, 500);
    
    console.log('=== 页面初始化完成 ===');
});