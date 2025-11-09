// 从 index.jsp 的 <script> 标签中复制所有 JavaScript 代码到这里

// DOM 加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 模态框相关代码
    const registerModal = document.getElementById('registerModal');
    const loginModal = document.getElementById('loginModal');
    const bookDetailModal = document.getElementById('bookDetailModal');
    
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const startBtn = document.getElementById('startBtn');
    const authContainer = document.getElementById('auth-container');
    const closeBtns = document.querySelectorAll('.close-btn');
    
    // 添加表单元素定义
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    // 打开模态框函数 - 添加淡入和缩放动画
    function openModal(modal) {
        if (modal) {
            // 设置初始状态
            modal.style.display = 'block';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            
            // 获取模态框内容
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.9)';
                modalContent.style.transition = 'transform 0.3s ease';
            }
            
            // 添加一个小延迟以确保过渡效果生效
            setTimeout(() => {
                modal.style.opacity = '1';
                if (modalContent) {
                    modalContent.style.transform = 'scale(1)';
                }
            }, 10);
        }
    }
    
    // 关闭模态框函数 - 添加淡出和缩放动画
    function closeModal(modal) {
        if (modal) {
            // 设置过渡效果
            modal.style.opacity = '1';
            modal.style.transition = 'opacity 0.3s ease';
            
            // 获取模态框内容
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(1)';
                modalContent.style.transition = 'transform 0.3s ease';
            }
            
            // 开始淡出动画
            modal.style.opacity = '0';
            if (modalContent) {
                modalContent.style.transform = 'scale(0.9)';
            }
            
            // 动画完成后隐藏模态框
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    // 添加开始按钮点击事件 - 添加平滑过渡效果
    if (startBtn && authContainer) {
        startBtn.addEventListener('click', function() {
            // 添加淡出动画到开始按钮
            startBtn.style.opacity = '1';
            startBtn.style.transition = 'opacity 0.3s ease';
            startBtn.style.opacity = '0';
            
            setTimeout(() => {
                startBtn.style.display = 'none';
                
                // 设置认证容器的初始状态
                authContainer.style.display = 'block';
                authContainer.style.opacity = '0';
                authContainer.style.transform = 'translateY(20px)';
                authContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                // 添加一个小延迟以确保过渡效果生效
                setTimeout(() => {
                    authContainer.style.opacity = '1';
                    authContainer.style.transform = 'translateY(0)';
                }, 10);
            }, 300);
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === registerModal) {
            closeModal(registerModal);
        } else if (event.target === loginModal) {
            closeModal(loginModal);
        } else if (event.target === bookDetailModal) {
            closeModal(bookDetailModal);
        }
    });

    // 注册按钮点击事件 - 添加按钮按下效果
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            // 添加按钮按下效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                openModal(registerModal);
            }, 150);
        });
    }

    // 登录按钮点击事件 - 添加按钮按下效果
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // 添加按钮按下效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                openModal(loginModal);
            }, 150);
        });
    }

    // 关闭按钮点击事件
    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // 添加按钮按下效果
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                const modalId = this.closest('.modal').id;
                const modal = document.getElementById(modalId);
                closeModal(modal);
            }, 100);
        });
    });
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // 处理注册表单提交逻辑
            // 表单验证
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!username || !password || !confirmPassword) {
                alert('请填写所有必填字段');
                return;
            }

            // 用户名验证：45个字符内
            if (username.length > 45) {
                alert('用户名长度不能超过45个字符');
                return;
            }

            // 密码验证：45个字符内
            if (password.length > 45) {
                alert('密码长度不能超过45个字符');
                return;
            }

            // 密码验证：只能由英文、数字、符号组成
            const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
            if (!passwordRegex.test(password)) {
                alert('密码只能包含英文、数字和符号');
                return;
            }

            if (password !== confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }

            // 添加表单提交动画效果
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '处理中...';
            }

            // 使用AJAX发送POST请求
            setTimeout(() => {
                fetch('/Library/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `name=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
                })
                    .then(response => {
                        // 首先检查响应类型
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            return response.json();
                        } else {
                            // 如果不是JSON，返回文本内容
                            return response.text().then(text => {
                                throw new Error(`服务器返回了非JSON响应: ${text.substring(0, 100)}`);
                            });
                        }
                    })
                    .then(data => {
                        if (data.success) {
                            // 注册成功，将用户名存储在sessionStorage中，然后重定向
                            const uniquecode = data.uniquecode || '';
                            
                            // 存储用户数据到sessionStorage
                            const userData = {
                                name: username,
                                uniquecode: uniquecode
                            };
                            sessionStorage.setItem('userData', JSON.stringify(userData));
                            
                            // 直接重定向到home.html，不再使用表单提交
                            window.location.href = '/Library/home.html';
                        } else {
                            alert(data.message);
                            // 恢复按钮状态
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = '注册';
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('注册失败，请重试: ' + error.message);
                        // 恢复按钮状态
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '注册';
                        }
                    });
            }, 1000);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // 处理登录表单提交逻辑
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                alert('请填写用户名和密码');
                return;
            }

            // 添加表单提交动画效果
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '登录中...';
            }

            // 使用AJAX发送POST请求
            setTimeout(() => {
                fetch('/Library/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `name=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
                })
                    .then(response => {
                        // 首先检查响应类型
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            return response.json();
                        } else {
                            // 如果不是JSON，返回文本内容
                            return response.text().then(text => {
                                throw new Error(`服务器返回了非JSON响应: ${text.substring(0, 10000000)}`);
                            });
                        }
                    })
                    .then(data => {
                        if (data.success) {
                            // 登录成功，将用户名存储在sessionStorage中，然后重定向
                            const uniquecode = data.uniquecode || '';
                            
                            // 存储用户数据到sessionStorage
                            const userData = {
                                name: username,
                                uniquecode: uniquecode
                            };
                            sessionStorage.setItem('userData', JSON.stringify(userData));
                            
                            // 直接重定向到home.html，不再使用表单提交
                            window.location.href = '/Library/home.html';
                        } else {
                            alert(data.message);
                            // 恢复按钮状态
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = '登录';
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('登录失败，请重试: ' + error.message);
                        // 恢复按钮状态
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '登录';
                        }
                    });
            }, 1000);
        });
    }

    // 平滑滚动效果 - 增强版
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // 计算目标位置
                const targetPosition = targetElement.offsetTop - 80;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800; // 滚动持续时间（毫秒）
                let startTime = null;

                // 缓动函数 - 使滚动更自然
                function easeInOutQuad(t) {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                }

                // 动画函数
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = easeInOutQuad(Math.min(timeElapsed / duration, 1));
                    window.scrollTo(0, startPosition + distance * run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                // 启动动画
                requestAnimationFrame(animation);
            }
        });
    });

    // 为模态框添加动画效果
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('transitionend', function() {
            // 动画完成后的处理
        });
    });

    // 添加响应式导航菜单处理
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            // 添加菜单展开/收起的动画
            if (navMenu.classList.contains('active')) {
                navMenu.style.height = navMenu.scrollHeight + 'px';
                setTimeout(() => {
                    navMenu.style.height = '0';
                }, 10);
                setTimeout(() => {
                    navMenu.classList.remove('active');
                }, 300);
            } else {
                navMenu.classList.add('active');
                navMenu.style.height = '0';
                setTimeout(() => {
                    navMenu.style.height = navMenu.scrollHeight + 'px';
                }, 10);
            }
        });
    }

    // 窗口大小变化时的响应
    window.addEventListener('resize', function() {
        // 可以在这里添加响应式布局调整逻辑
    });
});