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

// 设置事件监听器
function setupEventListeners() {
    // 登录表单提交
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

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

    // 搜索功能
    document.getElementById('searchUserBtn').addEventListener('click', searchUsers);
    document.getElementById('searchBookBtn').addEventListener('click', searchBooks);
    document.getElementById('searchBorrowBtn').addEventListener('click', searchBorrow);

    // 添加数据表单
    document.getElementById('addUserForm').addEventListener('submit', addUser);
    document.getElementById('addBookForm').addEventListener('submit', addBook);

    // 编辑表单提交
    document.getElementById('editForm').addEventListener('submit', handleEdit);

    // 页面滚动监听
    window.addEventListener('scroll', handleScroll);
}

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
    const query = document.getElementById('userSearch').value.toLowerCase();
    const filteredUsers = usersData.filter(user =>
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.number && user.number.includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
    );
    displayUsers(filteredUsers);
}

// 搜索图书
function searchBooks() {
    const query = document.getElementById('bookSearch').value.toLowerCase();
    const filteredBooks = booksData.filter(book =>
        (book.title && book.title.toLowerCase().includes(query)) ||
        (book.author && book.author.toLowerCase().includes(query)) ||
        (book.isbn && book.isbn.includes(query))
    );
    displayBooks(filteredBooks);
}

// 搜索借阅记录
function searchBorrow() {
    const query = document.getElementById('borrowSearch').value.toLowerCase();
    const filteredRecords = borrowData.filter(record =>
        (record.userId && record.userId.toString().includes(query)) ||
        (record.bookId && record.bookId.toString().includes(query))
    );
    displayBorrowRecords(filteredRecords);
}

// 添加用户
async function addUser(event) {
    event.preventDefault();

    const userData = {
        name: document.getElementById('userName').value,
        number: document.getElementById('userNumber').value,
        email: document.getElementById('userEmail').value
    };

    try {
        const response = await fetch('/Library/Administer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'addUser',
                ...userData
            })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showMessage('用户添加成功！', 'success');
                event.target.reset();
                // 成功响应后刷新页面数据
                loadAllData();
            } else {
                showMessage('添加失败：' + result.message, 'error');
            }
        }
    } catch (error) {
        showMessage('添加失败：网络错误', 'error');
    }
}

// 添加图书
async function addBook(event) {
    event.preventDefault();

    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookISBN').value,
        stock: parseInt(document.getElementById('bookStock').value)
    };

    try {
        const response = await fetch('/Library/Administer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'addBook',
                ...bookData
            })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showMessage('图书添加成功！', 'success');
                event.target.reset();
                // 成功响应后刷新页面数据
                loadAllData();
            } else {
                showMessage('添加失败：' + result.message, 'error');
            }
        }
    } catch (error) {
        showMessage('添加失败：网络错误', 'error');
    }
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

// 显示编辑模态框
function showEditModal(type, data) {
    const modal = document.getElementById('editModal');
    const title = document.getElementById('modalTitle');
    const formContent = document.getElementById('modalFormContent');

    if (type === 'user') {
        title.textContent = '编辑用户信息';
        formContent.innerHTML = `
            <input type="hidden" name="id" value="${data.id}">
            <input type="hidden" name="type" value="user">
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
    } else if (type === 'book') {
        title.textContent = '编辑图书信息';
        formContent.innerHTML = `
            <input type="hidden" name="id" value="${data.id}">
            <input type="hidden" name="type" value="book">
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
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/Library/Administer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'edit' + data.type.charAt(0).toUpperCase() + data.type.slice(1),
                ...data
            })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showMessage('修改成功！', 'success');
                closeModal();
                // 成功响应后刷新页面数据
                loadAllData();
            } else {
                showMessage('修改失败：' + result.message, 'error');
            }
        }
    } catch (error) {
        showMessage('修改失败：网络错误', 'error');
    }
}

// 删除用户
async function deleteUser(userId) {
    if (confirm('确定要删除这个用户吗？')) {
        try {
            const response = await fetch('/Library/Administer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'deleteUser',
                    id: userId
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    showMessage('用户删除成功！', 'success');
                    // 成功响应后刷新页面数据
                    loadUsers();
                } else {
                    showMessage('删除失败：' + result.message, 'error');
                }
            }
        } catch (error) {
            showMessage('删除失败：网络错误', 'error');
        }
    }
}

// 删除图书
async function deleteBook(bookId) {
    if (confirm('确定要删除这本图书吗？')) {
        try {
            const response = await fetch('/Library/Administer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'deleteBook',
                    id: bookId
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    showMessage('图书删除成功！', 'success');
                    // 成功响应后刷新页面数据
                    loadBooks();
                } else {
                    showMessage('删除失败：' + result.message, 'error');
                }
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
                // 成功响应后刷新页面数据
                loadBorrowRecords();
                loadBooks();
            } else {
                showMessage('归还失败：' + result.message, 'error');
            }
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

    // 3秒后自动移除
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
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
