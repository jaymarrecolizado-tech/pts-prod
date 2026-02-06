/**
 * Authentication Service for Static Dashboard
 */
const AuthService = {
    API_BASE_URL: 'http://localhost:8000/api/v1',

    init() {
        this.checkAuth();
        this.setupAutoRefresh();
        this.addLogoutButton();
    },

    checkAuth() {
        const token = localStorage.getItem('access_token');
        const currentPath = window.location.pathname;

        // Allow access to landing and login pages
        if (currentPath.endsWith('landing.html') || currentPath.endsWith('login.html')) {
            return;
        }

        // If no token and not on login/landing page, redirect to login
        if (!token && !currentPath.endsWith('login.html')) {
            window.location.href = 'login.html';
            return;
        }

        // If token exists, verify it's valid
        if (token) {
            this.verifyToken(token);
        }
    },

    async verifyToken(token) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Invalid token');
            }

            const user = await response.json();
            this.currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            this.applyRBAC();
        } catch (error) {
            console.error('Token verification failed:', error);
            this.logout();
        }
    },

    setupAutoRefresh() {
        setInterval(async () => {
            const accessToken = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');

            if (!accessToken || !refreshToken) return;

            try {
                const response = await fetch(`${this.API_BASE_URL}/auth/token/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    console.log('Token refreshed successfully');
                } else {
                    throw new Error('Token refresh failed');
                }
            } catch (error) {
                console.error('Auto-refresh failed:', error);
                this.logout();
            }
        }, 25 * 60 * 1000); // Refresh every 25 minutes (access token expires in 30)
    },

    logout() {
        const refreshToken = localStorage.getItem('refresh_token');

        // Call logout endpoint if refresh token exists
        if (refreshToken) {
            fetch(`${this.API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh_token: refreshToken })
            }).catch(err => console.error('Logout API error:', err));
        }

        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        // Redirect to login
        window.location.href = 'login.html';
    },

    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    hasRole(roles) {
        const user = this.getUser();
        if (!user) return false;
        return roles.includes(user.role);
    },

    hasPermission(permission) {
        const user = this.getUser();
        if (!user) return false;

        const permissions = {
            admin: ['view_dashboard', 'view_projects', 'add_project', 'edit_project', 'delete_project', 'manage_users', 'view_reports', 'export_data'],
            editor: ['view_dashboard', 'view_projects', 'add_project', 'edit_project', 'view_reports', 'export_data'],
            viewer: ['view_dashboard', 'view_projects', 'view_reports', 'export_data']
        };

        return permissions[user.role]?.includes(permission) || false;
    },

    applyRBAC() {
        const user = this.getUser();
        if (!user) return;

        // Add project button - Admin and Editor only
        const addProjectBtn = document.getElementById('add-project-btn');
        if (addProjectBtn) {
            addProjectBtn.style.display = this.hasPermission('add_project') ? 'block' : 'none';
        }

        // Import data - Admin and Editor only
        const importDataBtn = document.querySelector('[data-tab="data-migration"]');
        if (importDataBtn) {
            importDataBtn.style.display = this.hasPermission('add_project') ? 'flex' : 'none';
        }

        // Manual entry - Admin and Editor only
        const manualEntryTab = document.querySelector('[data-tab="manual-entry"]');
        if (manualEntryTab) {
            manualEntryTab.style.display = this.hasPermission('add_project') ? 'flex' : 'none';
        }

        // Delete project buttons
        document.querySelectorAll('.delete-project-btn').forEach(btn => {
            btn.style.display = this.hasPermission('delete_project') ? 'block' : 'none';
        });
    },

    addLogoutButton() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Check if logout button already exists
        if (document.getElementById('logout-btn')) return;

        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.className = 'nav-logout-btn';
        logoutBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; margin-right: 6px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
        `;
        logoutBtn.style.cssText = `
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            font-size: 14px;
            box-shadow: 0 4px 14px rgba(231, 76, 60, 0.3);
        `;

        logoutBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
        });

        logoutBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 14px rgba(231, 76, 60, 0.3)';
        });

        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                this.logout();
            }
        }.bind(this));

        // Add logout button to navbar
        const ctaButton = navbar.querySelector('.nav-cta');
        if (ctaButton) {
            ctaButton.parentNode.insertBefore(logoutBtn, ctaButton);
        }
    },

    // API wrapper that includes auth token
    async apiCall(endpoint, options = {}) {
        const token = localStorage.getItem('access_token');

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            ...options
        };

        const response = await fetch(`${this.API_BASE_URL}${endpoint}`, defaultOptions);

        if (response.status === 401) {
            this.logout();
            throw new Error('Unauthorized');
        }

        return response;
    }
};

// Initialize auth service when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthService.init());
} else {
    AuthService.init();
}

// Make it available globally
window.AuthService = AuthService;
