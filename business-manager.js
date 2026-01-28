// ============================================
// NEXUS BUSINESS MANAGER - INTERACTIVE JAVASCRIPT
// ============================================

// ============================================
// DATA MANAGEMENT
// ============================================

let businessData = {
    clients: [
        { id: 1, name: 'Reliance', email: 'contact@reliance.com', project: 'Website Redesign', status: 'active', amount: 8500, avatar: 'AC' },
        { id: 2, name: 'TATA', email: 'info@tata.io', project: 'Mobile App Dev', status: 'pending', amount: 15200, avatar: 'TI' },
        { id: 3, name: 'Mahindra', email: 'hello@mahindra.com', project: 'Cloud Migration', status: 'completed', amount: 22750, avatar: 'GS' },
        { id: 4, name: 'Infosys', email: 'team@infosys.net', project: 'SEO Campaign', status: 'active', amount: 6300, avatar: 'DS' },
        { id: 5, name: 'Airtel', email: 'hello@airtel.io', project: 'Branding', status: 'pending', amount: 4200, avatar: 'IL' },
        { id: 6, name: 'Zoho', email: 'info@zoho.com', project: 'DevOps Setup', status: 'active', amount: 12000, avatar: 'CF' }
    ],
    activities: [
        { icon: '💼', color: 'blue', title: 'New project started', description: 'Website redesign for Reliance', time: '2 hours ago' },
        { icon: '✅', color: 'green', title: 'Invoice paid', description: 'Payment received from TATA', time: '5 hours ago' },
        { icon: '👤', color: 'orange', title: 'New client added', description: 'Mahindra joined your network', time: '1 day ago' },
        { icon: '📊', color: 'yellow', title: 'Report generated', description: 'Q4 financial summary is ready', time: '2 days ago' },
        { icon: '🚀', color: 'blue', title: 'Project milestone', description: 'Cloud migration 75% complete', time: '3 days ago' }
    ],
    stats: {
        revenue: 47824,
        projects: 24,
        clients: 156,
        tasks: 12
    },
    revenueData: [
        { day: 'Mon', value: 8200 },
        { day: 'Tue', value: 10500 },
        { day: 'Wed', value: 6800 },
        { day: 'Thu', value: 12100 },
        { day: 'Fri', value: 9300 },
        { day: 'Sat', value: 7500 },
        { day: 'Sun', value: 13800 }
    ],
    notifications: [
        { id: 1, title: 'New payment received', message: 'TATA paid $15,200', read: false },
        { id: 2, title: 'Project deadline approaching', message: 'Website Redesign due in 3 days', read: false },
        { id: 3, title: 'New message', message: 'Client inquiry from Mahindra', read: true }
    ]
};

// ============================================
// MODAL MANAGEMENT
// ============================================

function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate modal entrance
        const content = modal.querySelector('.modal-content');
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 10);
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        const content = modal.querySelector('.modal-content');
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id.replace('Modal', '');
        closeModal(modalId);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            const modalType = activeModal.id.replace('Modal', '');
            closeModal(modalType);
        }
    }
});

// ============================================
// FORM HANDLING
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Handle all form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const modal = form.closest('.modal');
    const modalType = modal.id.replace('Modal', '');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Process based on modal type
        switch(modalType) {
            case 'client':
                addNewClient(formData);
                break;
            case 'project':
                addNewProject(formData);
                break;
            case 'invoice':
                createInvoice(formData);
                break;
            case 'team':
                addTeamMember(formData);
                break;
        }
        
        // Reset form and close modal
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        closeModal(modalType);
        
        // Show success notification
        showNotification('Success!', `${modalType.charAt(0).toUpperCase() + modalType.slice(1)} added successfully`, 'success');
        
    }, 1500);
}

function addNewClient(formData) {
    const name = formData.get('company') || 'New Client';
    const newClient = {
        id: businessData.clients.length + 1,
        name: name,
        email: formData.get('email') || 'email@example.com',
        project: 'Pending',
        status: 'pending',
        amount: 0,
        avatar: name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    };
    
    businessData.clients.unshift(newClient);
    businessData.stats.clients++;
    
    updateClientsTable();
    updateStats();
    addActivity('👤', 'orange', 'New client added', `${name} joined your network`, 'Just now');
}

function addNewProject(formData) {
    businessData.stats.projects++;
    updateStats();
    addActivity('💼', 'blue', 'New project created', formData.get('name') || 'New Project', 'Just now');
}

function createInvoice(formData) {
    const amount = formData.get('amount') || 0;
    businessData.stats.revenue += parseInt(amount);
    updateStats();
    addActivity('📄', 'green', 'Invoice created', `New invoice for $${amount}`, 'Just now');
}

function addTeamMember(formData) {
    addActivity('👤', 'orange', 'Team member added', formData.get('name') || 'New Member', 'Just now');
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon ${type}">
                ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
            </div>
            <div>
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        </div>
        <div class="notification-close" onclick="this.parentElement.remove()">✕</div>
    `;
    
    // Add notification styles if not already present
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 2rem;
                background: var(--secondary);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 1.25rem;
                min-width: 320px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                z-index: 10000;
                animation: slideInRight 0.4s ease;
                display: flex;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .notification-content {
                display: flex;
                gap: 1rem;
                align-items: flex-start;
            }
            
            .notification-icon {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                flex-shrink: 0;
            }
            
            .notification-icon.success {
                background: rgba(0, 229, 160, 0.15);
                color: var(--success);
            }
            
            .notification-icon.error {
                background: rgba(255, 107, 53, 0.15);
                color: var(--accent-warm);
            }
            
            .notification-icon.info {
                background: rgba(0, 217, 255, 0.15);
                color: var(--accent);
            }
            
            .notification-title {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .notification-message {
                font-size: 0.85rem;
                color: var(--text-dim);
            }
            
            .notification-close {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                background: rgba(255, 107, 53, 0.15);
                color: var(--accent-warm);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.4s ease reverse';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        updateClientsTable();
        return;
    }
    
    const filteredClients = businessData.clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.project.toLowerCase().includes(searchTerm)
    );
    
    updateClientsTable(filteredClients);
    
    if (filteredClients.length === 0) {
        showNotification('No Results', `No matches found for "${searchTerm}"`, 'info');
    }
}

// ============================================
// TABLE UPDATES
// ============================================

function updateClientsTable(clients = businessData.clients) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = clients.slice(0, 4).map(client => `
        <tr onclick="viewClientDetails(${client.id})" style="cursor: pointer;">
            <td>
                <div class="client-info">
                    <div class="client-avatar">${client.avatar}</div>
                    <div>
                        <div style="font-weight: 600;">${client.name}</div>
                        <div style="font-size: 0.85rem; color: var(--text-dim);">${client.email}</div>
                    </div>
                </div>
            </td>
            <td>${client.project}</td>
            <td><span class="status-badge ${client.status}">${client.status.charAt(0).toUpperCase() + client.status.slice(1)}</span></td>
            <td style="font-weight: 600;">$${client.amount.toLocaleString()}</td>
        </tr>
    `).join('');
    
    // Add hover animation
    tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

function viewClientDetails(clientId) {
    const client = businessData.clients.find(c => c.id === clientId);
    if (client) {
        showNotification('Client Details', `Viewing details for ${client.name}`, 'info');
        // In a real app, this would open a detailed view
    }
}

// ============================================
// STATS UPDATES
// ============================================

function updateStats() {
    const stats = [
        { selector: '.stat-value', index: 0, value: `$${businessData.stats.revenue.toLocaleString()}` },
        { selector: '.stat-value', index: 1, value: businessData.stats.projects },
        { selector: '.stat-value', index: 2, value: businessData.stats.clients },
        { selector: '.stat-value', index: 3, value: businessData.stats.tasks }
    ];
    
    stats.forEach(stat => {
        const elements = document.querySelectorAll(stat.selector);
        if (elements[stat.index]) {
            animateValue(elements[stat.index], stat.value);
        }
    });
}

function animateValue(element, newValue) {
    const currentValue = element.textContent;
    element.style.transform = 'scale(1.1)';
    element.style.color = 'var(--accent)';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        setTimeout(() => {
            element.style.color = '';
        }, 300);
    }, 150);
}

// ============================================
// ACTIVITY FEED UPDATES
// ============================================

function addActivity(icon, color, title, description, time) {
    const activity = { icon, color, title, description, time };
    businessData.activities.unshift(activity);
    
    const activityContainer = document.querySelector('.card .activity-item')?.parentElement;
    if (!activityContainer) return;
    
    const activityHTML = `
        <div class="activity-item" style="animation: slideIn 0.4s ease;">
            <div class="activity-icon ${color}">${icon}</div>
            <div class="activity-content">
                <h4>${title}</h4>
                <p style="font-size: 0.85rem; color: var(--text-dim);">${description}</p>
                <div class="activity-time">${time}</div>
            </div>
        </div>
    `;
    
    activityContainer.insertAdjacentHTML('afterbegin', activityHTML);
    
    // Remove oldest activity if more than 5
    const activities = activityContainer.querySelectorAll('.activity-item');
    if (activities.length > 5) {
        activities[activities.length - 1].remove();
    }
}

// ============================================
// CHART INTERACTIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach((bar, index) => {
        bar.addEventListener('click', () => {
            const value = businessData.revenueData[index].value;
            const day = businessData.revenueData[index].day;
            showNotification('Revenue Details', `${day}: $${value.toLocaleString()}`, 'info');
        });
        
        // Add tooltip on hover
        bar.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2)';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    });
});

// ============================================
// NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the navigation title
            const navTitle = this.textContent.trim().replace(/\d+/g, '').trim();
            
            // Update page content based on navigation
            switchPage(navTitle);
        });
    });
});

function switchPage(pageName) {
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;
    
    // Fade out current content
    dashboard.style.opacity = '0';
    dashboard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        // Update page header
        updatePageHeader(pageName);
        
        // Update dashboard content based on page
        switch(pageName) {
            case 'Dashboard':
                showDashboardContent();
                break;
            case 'Clients':
                showClientsContent();
                break;
            case 'Projects':
                showProjectsContent();
                break;
            case 'Invoices':
                showInvoicesContent();
                break;
            case 'Reports':
                showReportsContent();
                break;
            case 'Finance':
                showFinanceContent();
                break;
            case 'Team':
                showTeamContent();
                break;
            case 'Settings':
                showSettingsContent();
                break;
        }
        
        // Fade in new content
        setTimeout(() => {
            dashboard.style.opacity = '1';
            dashboard.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
}

function updatePageHeader(title) {
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    
    const subtitles = {
        'Dashboard': "Welcome back! Here's what's happening with your business today.",
        'Clients': 'Manage your client relationships and track their projects.',
        'Projects': 'Monitor ongoing projects and track their progress.',
        'Invoices': 'Create and manage invoices for your clients.',
        'Reports': 'Analyze your business performance with detailed reports.',
        'Finance': 'Track income, expenses, and financial health.',
        'Team': 'Manage your team members and their roles.',
        'Settings': 'Configure your business settings and preferences.'
    };
    
    if (pageTitle) pageTitle.textContent = title;
    if (pageSubtitle) pageSubtitle.textContent = subtitles[title] || 'Manage your business efficiently.';
}

// ============================================
// PAGE CONTENT GENERATORS
// ============================================

function showDashboardContent() {
    const dashboard = document.querySelector('.dashboard');
    const headerHTML = dashboard.querySelector('.page-header').outerHTML;
    
    dashboard.innerHTML = headerHTML + `
        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon blue">💰</div>
                    <div class="stat-change up">↑ 12.5%</div>
                </div>
                <div class="stat-value">$${businessData.stats.revenue.toLocaleString()}</div>
                <div class="stat-label">Total Revenue</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon green">📊</div>
                    <div class="stat-change up">↑ 8.2%</div>
                </div>
                <div class="stat-value">${businessData.stats.projects}</div>
                <div class="stat-label">Active Projects</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon orange">👥</div>
                    <div class="stat-change up">↑ 5.7%</div>
                </div>
                <div class="stat-value">${businessData.stats.clients}</div>
                <div class="stat-label">Total Clients</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon yellow">⚡</div>
                    <div class="stat-change down">↓ 2.1%</div>
                </div>
                <div class="stat-value">${businessData.stats.tasks}</div>
                <div class="stat-label">Pending Tasks</div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <div class="action-card" onclick="openModal('invoice')">
                <div class="action-icon blue">📄</div>
                <div class="action-content">
                    <h3>Create Invoice</h3>
                    <p>Generate a new invoice for clients</p>
                </div>
            </div>
            <div class="action-card" onclick="openModal('client')">
                <div class="action-icon green">➕</div>
                <div class="action-content">
                    <h3>Add Client</h3>
                    <p>Register a new client to your system</p>
                </div>
            </div>
            <div class="action-card" onclick="openModal('project')">
                <div class="action-icon orange">🚀</div>
                <div class="action-content">
                    <h3>New Project</h3>
                    <p>Start tracking a new project</p>
                </div>
            </div>
            <div class="action-card" onclick="openModal('team')">
                <div class="action-icon yellow">👤</div>
                <div class="action-content">
                    <h3>Add Team Member</h3>
                    <p>Invite a new team member</p>
                </div>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Recent Clients</h2>
                    <button class="btn btn-secondary">View All</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Project</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Recent Activity</h2>
                </div>
                <div id="activity-container"></div>
            </div>
        </div>

        <!-- Revenue Chart -->
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Revenue Overview</h2>
                <button class="btn btn-primary">Download Report</button>
            </div>
            <div class="chart-container">
                ${businessData.revenueData.map(data => 
                    `<div class="chart-bar" style="height: ${(data.value / 138) * 100}%;" data-value="$${(data.value / 1000).toFixed(1)}k"></div>`
                ).join('')}
            </div>
            <div class="chart-labels">
                ${businessData.revenueData.map(data => `<span>${data.day}</span>`).join('')}
            </div>
        </div>
    `;
    
    updateClientsTable();
    updateActivityFeed();
    attachChartListeners();
}

function showReportsContent() {
    const dashboard = document.querySelector('.dashboard');
    const headerHTML = dashboard.querySelector('.page-header').outerHTML;
    
    dashboard.innerHTML = headerHTML + `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon blue">📈</div>
                    <div class="stat-change up">↑ 15.3%</div>
                </div>
                <div class="stat-value">$${(businessData.stats.revenue * 1.2).toLocaleString()}</div>
                <div class="stat-label">Monthly Revenue</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-change up">↑ 22%</div>
                </div>
                <div class="stat-value">87%</div>
                <div class="stat-label">Completion Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon orange">⏱️</div>
                    <div class="stat-change down">↓ 5%</div>
                </div>
                <div class="stat-value">14.2</div>
                <div class="stat-label">Avg Days to Complete</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon yellow">⭐</div>
                    <div class="stat-change up">↑ 8%</div>
                </div>
                <div class="stat-value">4.8</div>
                <div class="stat-label">Client Satisfaction</div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 2rem;">
            <div class="card-header">
                <h2 class="card-title">Revenue Analytics</h2>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn btn-secondary">Last 7 Days</button>
                    <button class="btn btn-secondary">Last 30 Days</button>
                    <button class="btn btn-primary">Export Report</button>
                </div>
            </div>
            <div class="chart-container" style="height: 350px;">
                ${businessData.revenueData.map(data => 
                    `<div class="chart-bar" style="height: ${(data.value / 138) * 100}%;" data-value="$${(data.value / 1000).toFixed(1)}k"></div>`
                ).join('')}
            </div>
            <div class="chart-labels">
                ${businessData.revenueData.map(data => `<span>${data.day}</span>`).join('')}
            </div>
        </div>

        <div class="content-grid">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Top Performing Projects</h2>
                </div>
                <div style="padding: 1rem 0;">
                    <div style="padding: 1rem; border-bottom: 1px solid var(--border);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-weight: 600;">Cloud Migration - Infosys</span>
                            <span style="color: var(--success);">$22,750</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="width: 95%; height: 100%; background: linear-gradient(90deg, var(--accent), var(--success));"></div>
                        </div>
                    </div>
                    <div style="padding: 1rem; border-bottom: 1px solid var(--border);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-weight: 600;">Mobile App Dev - TATA</span>
                            <span style="color: var(--success);">$15,200</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="width: 68%; height: 100%; background: linear-gradient(90deg, var(--accent), var(--success));"></div>
                        </div>
                    </div>
                    <div style="padding: 1rem; border-bottom: 1px solid var(--border);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-weight: 600;">Website Redesign - Reliance</span>
                            <span style="color: var(--success);">$8,500</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="width: 45%; height: 100%; background: linear-gradient(90deg, var(--accent), var(--success));"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Client Distribution</h2>
                </div>
                <div style="padding: 2rem 0;">
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Technology</span>
                                <span style="font-weight: 600;">45%</span>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); height: 10px; border-radius: 5px; overflow: hidden;">
                                <div style="width: 45%; height: 100%; background: var(--accent);"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Finance</span>
                                <span style="font-weight: 600;">30%</span>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); height: 10px; border-radius: 5px; overflow: hidden;">
                                <div style="width: 30%; height: 100%; background: var(--success);"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Healthcare</span>
                                <span style="font-weight: 600;">15%</span>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); height: 10px; border-radius: 5px; overflow: hidden;">
                                <div style="width: 15%; height: 100%; background: var(--accent-warm);"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Other</span>
                                <span style="font-weight: 600;">10%</span>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); height: 10px; border-radius: 5px; overflow: hidden;">
                                <div style="width: 10%; height: 100%; background: var(--warning);"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    attachChartListeners();
}

function showFinanceContent() {
    const dashboard = document.querySelector('.dashboard');
    const headerHTML = dashboard.querySelector('.page-header').outerHTML;
    
    const totalIncome = businessData.stats.revenue;
    const totalExpenses = Math.floor(totalIncome * 0.65);
    const netProfit = totalIncome - totalExpenses;
    
    dashboard.innerHTML = headerHTML + `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon green">💵</div>
                    <div class="stat-change up">↑ 12.5%</div>
                </div>
                <div class="stat-value">$${totalIncome.toLocaleString()}</div>
                <div class="stat-label">Total Income</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon orange">💸</div>
                    <div class="stat-change up">↑ 8.2%</div>
                </div>
                <div class="stat-value">$${totalExpenses.toLocaleString()}</div>
                <div class="stat-label">Total Expenses</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon blue">📊</div>
                    <div class="stat-change up">↑ 18.7%</div>
                </div>
                <div class="stat-value">$${netProfit.toLocaleString()}</div>
                <div class="stat-label">Net Profit</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon yellow">📈</div>
                    <div class="stat-change up">↑ 5.3%</div>
                </div>
                <div class="stat-value">${((netProfit / totalIncome) * 100).toFixed(1)}%</div>
                <div class="stat-label">Profit Margin</div>
            </div>
        </div>

        <div class="content-grid">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Income vs Expenses</h2>
                    <button class="btn btn-primary">Download Report</button>
                </div>
                <div class="chart-container" style="height: 320px;">
                    <div class="chart-bar" style="height: 85%; background: linear-gradient(180deg, var(--success), #00B380);" data-value="Income"></div>
                    <div class="chart-bar" style="height: 60%; background: linear-gradient(180deg, var(--accent-warm), #E55A2A);" data-value="Expenses"></div>
                    <div class="chart-bar" style="height: 95%; background: linear-gradient(180deg, var(--success), #00B380);" data-value="Income"></div>
                    <div class="chart-bar" style="height: 55%; background: linear-gradient(180deg, var(--accent-warm), #E55A2A);" data-value="Expenses"></div>
                    <div class="chart-bar" style="height: 75%; background: linear-gradient(180deg, var(--success), #00B380);" data-value="Income"></div>
                    <div class="chart-bar" style="height: 50%; background: linear-gradient(180deg, var(--accent-warm), #E55A2A);" data-value="Expenses"></div>
                    <div class="chart-bar" style="height: 100%; background: linear-gradient(180deg, var(--success), #00B380);" data-value="Income"></div>
                </div>
                <div class="chart-labels">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Recent Transactions</h2>
                </div>
                <div style="padding: 0.5rem 0;">
                    ${[
                        { type: 'income', desc: 'Payment from TATA', amount: 15200, date: 'Today' },
                        { type: 'expense', desc: 'Software Licenses', amount: -2500, date: 'Yesterday' },
                        { type: 'income', desc: 'Payment from Reliance', amount: 8500, date: '2 days ago' },
                        { type: 'expense', desc: 'Office Supplies', amount: -350, date: '3 days ago' },
                        { type: 'income', desc: 'Payment from Infosys', amount: 22750, date: '4 days ago' },
                        { type: 'expense', desc: 'Marketing Campaign', amount: -5000, date: '5 days ago' }
                    ].map(transaction => `
                        <div style="padding: 1rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="width: 40px; height: 40px; border-radius: 10px; background: ${transaction.type === 'income' ? 'rgba(0, 229, 160, 0.15)' : 'rgba(255, 107, 53, 0.15)'}; display: flex; align-items: center; justify-content: center; color: ${transaction.type === 'income' ? 'var(--success)' : 'var(--accent-warm)'};">
                                    ${transaction.type === 'income' ? '↓' : '↑'}
                                </div>
                                <div>
                                    <div style="font-weight: 600;">${transaction.desc}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-dim);">${transaction.date}</div>
                                </div>
                            </div>
                            <div style="font-weight: 700; color: ${transaction.type === 'income' ? 'var(--success)' : 'var(--accent-warm)'};">
                                ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toLocaleString()}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Expense Breakdown</h2>
            </div>
            <div style="padding: 2rem 0;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
                    ${[
                        { category: 'Salaries', amount: 18500, percent: 45 },
                        { category: 'Software', amount: 8200, percent: 20 },
                        { category: 'Marketing', amount: 6150, percent: 15 },
                        { category: 'Operations', amount: 4920, percent: 12 },
                        { category: 'Other', amount: 3280, percent: 8 }
                    ].map(expense => `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                <span style="font-weight: 600;">${expense.category}</span>
                                <span style="color: var(--text-dim);">${expense.percent}%</span>
                            </div>
                            <div style="background: rgba(255,255,255,0.05); height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 0.5rem;">
                                <div style="width: ${expense.percent}%; height: 100%; background: linear-gradient(90deg, var(--accent), var(--success)); transition: width 1s ease;"></div>
                            </div>
                            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent);">$${expense.amount.toLocaleString()}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    attachChartListeners();
}

function showClientsContent() {
    const dashboard = document.querySelector('.dashboard');
    const headerHTML = dashboard.querySelector('.page-header').outerHTML;
    
    dashboard.innerHTML = headerHTML + `
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-secondary">All Clients (${businessData.clients.length})</button>
                <button class="btn btn-secondary">Active (${businessData.clients.filter(c => c.status === 'active').length})</button>
                <button class="btn btn-secondary">Pending (${businessData.clients.filter(c => c.status === 'pending').length})</button>
            </div>
            <button class="btn btn-primary" onclick="openModal('client')">+ Add New Client</button>
        </div>

        <div class="card">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Project</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${businessData.clients.map(client => `
                            <tr>
                                <td>
                                    <div class="client-info">
                                        <div class="client-avatar">${client.avatar}</div>
                                        <div>
                                            <div style="font-weight: 600;">${client.name}</div>
                                            <div style="font-size: 0.85rem; color: var(--text-dim);">${client.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>${client.project}</td>
                                <td><span class="status-badge ${client.status}">${client.status.charAt(0).toUpperCase() + client.status.slice(1)}</span></td>
                                <td style="font-weight: 600;">$${client.amount.toLocaleString()}</td>
                                <td>
                                    <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="viewClientDetails(${client.id})">View</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showProjectsContent() {
    const dashboard = document.querySelector('.dashboard');
    const headerHTML = dashboard.querySelector('.page-header').outerHTML;
    
    const projects = [
        { name: 'Website Redesign', client: 'Reliance', progress: 75, status: 'active', dueDate: 'Jan 30, 2026' },
        { name: 'Mobile App Dev', client: 'TATA', progress: 45, status: 'active', dueDate: 'Feb 15, 2026' },
        { name: 'Cloud Migration', client: 'Mahindra', progress: 100, status: 'completed', dueDate: 'Jan 15, 2026' },
        { name: 'SEO Campaign', client: 'Infosys', progress: 60, status: 'active', dueDate: 'Feb 5, 2026' },
        { name: 'Branding', client: 'Airtel', progress: 20, status: 'pending', dueDate: 'Feb 28, 2026' },
        { name: 'DevOps Setup', client: 'Zoho', progress: 85, status: 'active', dueDate: 'Jan 28, 2026' }
    ];
    
    dashboard.innerHTML = headerHTML + `
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-secondary">All Projects (${projects.length})</button>
                <button class="btn btn-secondary">Active (${projects.filter(p => p.status === 'active').length})</button>
                <button class="btn btn-secondary">Completed (${projects.filter(p => p.status === 'completed').length})</button>
            </div>
            <button class="btn btn-primary" onclick="openModal('project')">+ New Project</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
            ${projects.map(project => `
                <div class="card" style="cursor: pointer; transition: all 0.3s ease;" onmouseenter="this.style.transform='translateY(-5px)'" onmouseleave="this.style.transform='translateY(0)'">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <div>
                            <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${project.name}</h3>
                            <p style="font-size: 0.85rem; color: var(--text-dim);">${project.client}</p>
                        </div>
                        <span class="status-badge ${project.status}">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.85rem; color: var(--text-dim);">Progress</span>
                            <span style="font-size: 0.85rem; font-weight: 600;">${project.progress}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${project.progress}%; height: 100%; background: linear-gradient(90deg, var(--accent), var(--success)); transition: width 1s ease;"></div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border);">
                        <div style="font-size: 0.85rem; color: var(--text-dim);">
                            📅 Due: ${project.dueDate}
                        </div>
                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">View Details</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showInvoicesContent() {
    const dashboard = document.querySelector('.dashboard');
    const headerHTML = dashboard.querySelector('.page-header').outerHTML;
    
    const invoices = [
        { id: 'INV-001', client: 'TATA', amount: 15200, status: 'paid', date: 'Jan 25, 2026' },
        { id: 'INV-002', client: 'Reliance', amount: 8500, status: 'pending', date: 'Jan 27, 2026' },
        { id: 'INV-003', client: 'Infosys', amount: 22750, status: 'paid', date: 'Jan 15, 2026' },
        { id: 'INV-004', client: 'Mahindra', amount: 6300, status: 'overdue', date: 'Jan 10, 2026' },
        { id: 'INV-005', client: 'Airtel', amount: 4200, status: 'pending', date: 'Jan 28, 2026' }
    ];
    
    dashboard.innerHTML = headerHTML + `
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-secondary">All (${invoices.length})</button>
                <button class="btn btn-secondary">Paid (${invoices.filter(i => i.status === 'paid').length})</button>
                <button class="btn btn-secondary">Pending (${invoices.filter(i => i.status === 'pending').length})</button>
                <button class="btn btn-secondary">Overdue (${invoices.filter(i => i.status === 'overdue').length})</button>
            </div>
            <button class="btn btn-primary" onclick="openModal('invoice')">+ Create Invoice</button>
        </div>

        <div class="card">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Client</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoices.map(invoice => `
                            <tr>
                                <td style="font-weight: 600; font-family: 'Courier New', monospace;">${invoice.id}</td>
                                <td>${invoice.client}</td>
                                <td style="font-weight: 600;">$${invoice.amount.toLocaleString()}</td>
                                <td style="color: var(--text-dim);">${invoice.date}</td>
                                <td><span class="status-badge ${invoice.status === 'paid' ? 'completed' : invoice.status === 'overdue' ? 'pending' : 'active'}">${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span></td>
                                <td>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">View</button>
                                        <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Download</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function showTeamContent() {
    const dashboard = document.querySelector('.dashboard');
    const headerHTML = dashboard.querySelector('.page-header').outerHTML;
    
    const team = [
        { name: 'Vishnu Kusi', role: 'Administrator', email: 'vishnu@company.com', status: 'active', avatar: 'JD' },
        { name: 'Teju', role: 'Project Manager', email: 'teju@company.com', status: 'active', avatar: 'SS' },
        { name: 'Guna', role: 'Developer', email: 'guna@company.com', status: 'active', avatar: 'MJ' },
        { name: 'Chaya', role: 'Designer', email: 'chaya@company.com', status: 'active', avatar: 'EB' },
        { name: 'Rudri', role: 'Accountant', email: 'rudri@company.com', status: 'active', avatar: 'DL' }
    ];
    
    dashboard.innerHTML = headerHTML + `
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <button class="btn btn-secondary">All Members (${team.length})</button>
            <button class="btn btn-primary" onclick="openModal('team')">+ Add Team Member</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
            ${team.map(member => `
                <div class="card" style="text-align: center;">
                    <div style="width: 80px; height: 80px; margin: 0 auto 1rem; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--success)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700;">
                        ${member.avatar}
                    </div>
                    <h3 style="margin-bottom: 0.25rem;">${member.name}</h3>
                    <p style="color: var(--text-dim); margin-bottom: 0.5rem;">${member.role}</p>
                    <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 1rem;">${member.email}</p>
                    <span class="status-badge ${member.status}">${member.status.charAt(0).toUpperCase() + member.status.slice(1)}</span>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button class="btn btn-secondary" style="flex: 1; padding: 0.6rem;">Message</button>
                        <button class="btn btn-primary" style="flex: 1; padding: 0.6rem;">Edit</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showSettingsContent() {
    const dashboard = document.querySelector('.dashboard');
    const headerHTML = dashboard.querySelector('.page-header').outerHTML;
    
    dashboard.innerHTML = headerHTML + `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <h3 style="margin-bottom: 1.5rem;">Account Settings</h3>
                <div class="form-group">
                    <label>Company Name</label>
                    <input type="text" value="Nexus Business" placeholder="Enter company name">
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" value="contact@nexus.com" placeholder="Enter email">
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value="+1 (555) 123-4567" placeholder="Enter phone">
                </div>
                <button class="btn btn-primary" style="width: 100%;">Save Changes</button>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 1.5rem;">Notification Preferences</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${[
                        'Email notifications for new clients',
                        'Project deadline reminders',
                        'Payment notifications',
                        'Weekly performance reports',
                        'Team activity updates'
                    ].map(pref => `
                        <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                            <input type="checkbox" checked style="width: 18px; height: 18px;">
                            <span>${pref}</span>
                        </label>
                    `).join('')}
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">Update Preferences</button>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 1.5rem;">Security</h3>
                <div class="form-group">
                    <label>Current Password</label>
                    <input type="password" placeholder="Enter current password">
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password">
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm new password">
                </div>
                <button class="btn btn-primary" style="width: 100%;">Change Password</button>
            </div>
        </div>
    `;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function updateActivityFeed() {
    const activityContainer = document.getElementById('activity-container');
    if (!activityContainer) return;
    
    activityContainer.innerHTML = businessData.activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.color}">${activity.icon}</div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p style="font-size: 0.85rem; color: var(--text-dim);">${activity.description}</p>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function attachChartListeners() {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        bar.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            showNotification('Chart Details', `Value: ${value}`, 'info');
        });
        
        bar.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2)';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    });
}

// ============================================
// STAT CARD INTERACTIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const statLabel = this.querySelector('.stat-label').textContent;
            const statValue = this.querySelector('.stat-value').textContent;
            
            showNotification(statLabel, `Current value: ${statValue}`, 'info');
            
            // Add pulse animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
    });
});

// ============================================
// NOTIFICATION ICON
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const notificationBtn = document.querySelector('.icon-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNotificationPanel();
        });
    }
});

function showNotificationPanel() {
    const existingPanel = document.querySelector('.notification-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }
    
    const panel = document.createElement('div');
    panel.className = 'notification-panel';
    panel.innerHTML = `
        <div class="notification-panel-header">
            <h3>Notifications</h3>
            <span class="badge">${businessData.notifications.filter(n => !n.read).length}</span>
        </div>
        <div class="notification-panel-content">
            ${businessData.notifications.map(notif => `
                <div class="notification-panel-item ${notif.read ? 'read' : ''}" onclick="markAsRead(${notif.id})">
                    <div class="notification-panel-icon">${notif.read ? '📧' : '📬'}</div>
                    <div>
                        <div class="notification-panel-title">${notif.title}</div>
                        <div class="notification-panel-message">${notif.message}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="notification-panel-footer">
            <button class="btn btn-secondary" onclick="markAllAsRead()">Mark all as read</button>
        </div>
    `;
    
    // Add panel styles
    if (!document.getElementById('notification-panel-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-panel-styles';
        styles.textContent = `
            .notification-panel {
                position: fixed;
                top: 80px;
                right: 2rem;
                width: 360px;
                background: var(--secondary);
                border: 1px solid var(--border);
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            
            .notification-panel-header {
                padding: 1.25rem;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-panel-header h3 {
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .notification-panel-content {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .notification-panel-item {
                padding: 1rem 1.25rem;
                border-bottom: 1px solid var(--border);
                display: flex;
                gap: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .notification-panel-item:hover {
                background: rgba(0, 217, 255, 0.05);
            }
            
            .notification-panel-item.read {
                opacity: 0.6;
            }
            
            .notification-panel-icon {
                font-size: 1.5rem;
            }
            
            .notification-panel-title {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .notification-panel-message {
                font-size: 0.85rem;
                color: var(--text-dim);
            }
            
            .notification-panel-footer {
                padding: 1rem 1.25rem;
                border-top: 1px solid var(--border);
            }
            
            .notification-panel-footer .btn {
                width: 100%;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(panel);
    
    // Close when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeNotificationPanel);
    }, 10);
}

function closeNotificationPanel(e) {
    const panel = document.querySelector('.notification-panel');
    if (panel && !panel.contains(e.target)) {
        panel.remove();
        document.removeEventListener('click', closeNotificationPanel);
    }
}

function markAsRead(id) {
    const notification = businessData.notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        const panel = document.querySelector('.notification-panel');
        if (panel) {
            panel.remove();
            showNotificationPanel();
        }
    }
}

function markAllAsRead() {
    businessData.notifications.forEach(n => n.read = true);
    const panel = document.querySelector('.notification-panel');
    if (panel) {
        panel.remove();
        showNotificationPanel();
    }
    showNotification('Success', 'All notifications marked as read', 'success');
}

// ============================================
// REAL-TIME UPDATES SIMULATION
// ============================================

function startRealtimeUpdates() {
    // Simulate real-time stat updates every 30 seconds
    setInterval(() => {
        // Randomly update stats
        const randomChange = Math.floor(Math.random() * 1000) - 500;
        businessData.stats.revenue += randomChange;
        
        updateStats();
    }, 30000);
    
    // Simulate new activities every minute
    setInterval(() => {
        const activities = [
            { icon: '💼', color: 'blue', title: 'Project updated', description: 'Progress milestone reached' },
            { icon: '💰', color: 'green', title: 'Payment received', description: 'New invoice payment' },
            { icon: '📊', color: 'yellow', title: 'Report ready', description: 'Weekly analytics compiled' }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        addActivity(randomActivity.icon, randomActivity.color, randomActivity.title, randomActivity.description, 'Just now');
    }, 60000);
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-bar input')?.focus();
    }
    
    // Ctrl/Cmd + N for new client
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openModal('client');
    }
    
    // Ctrl/Cmd + I for new invoice
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        openModal('invoice');
    }
});

// ============================================
// TABLE ROW ACTIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Add context menu to table rows
    document.addEventListener('contextmenu', (e) => {
        const row = e.target.closest('tbody tr');
        if (row) {
            e.preventDefault();
            showContextMenu(e.clientX, e.clientY, row);
        }
    });
});

function showContextMenu(x, y, row) {
    // Remove existing context menu
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) existingMenu.remove();
    
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `
        <div class="context-menu-item" onclick="editClient()">
            <span>✏️</span> Edit Client
        </div>
        <div class="context-menu-item" onclick="viewDetails()">
            <span>👁️</span> View Details
        </div>
        <div class="context-menu-item" onclick="createInvoiceForClient()">
            <span>📄</span> Create Invoice
        </div>
        <div class="context-menu-item danger" onclick="deleteClient()">
            <span>🗑️</span> Delete
        </div>
    `;
    
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    
    // Add context menu styles
    if (!document.getElementById('context-menu-styles')) {
        const styles = document.createElement('style');
        styles.id = 'context-menu-styles';
        styles.textContent = `
            .context-menu {
                position: fixed;
                background: var(--secondary);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 0.5rem;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                z-index: 10000;
                min-width: 200px;
            }
            
            .context-menu-item {
                padding: 0.75rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .context-menu-item:hover {
                background: rgba(0, 217, 255, 0.1);
            }
            
            .context-menu-item.danger:hover {
                background: rgba(255, 107, 53, 0.1);
                color: var(--accent-warm);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeContextMenu);
    }, 10);
}

function closeContextMenu() {
    const menu = document.querySelector('.context-menu');
    if (menu) {
        menu.remove();
        document.removeEventListener('click', closeContextMenu);
    }
}

function editClient() {
    closeContextMenu();
    showNotification('Edit Client', 'Opening edit dialog...', 'info');
}

function viewDetails() {
    closeContextMenu();
    showNotification('View Details', 'Loading client details...', 'info');
}

function createInvoiceForClient() {
    closeContextMenu();
    openModal('invoice');
}

function deleteClient() {
    closeContextMenu();
    if (confirm('Are you sure you want to delete this client?')) {
        showNotification('Client Deleted', 'Client removed successfully', 'success');
    }
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Nexus Business Manager Initialized');
    
    // Initialize components
    updateClientsTable();
    updateStats();
    
    // Start real-time updates
    startRealtimeUpdates();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome Back!', 'Your business dashboard is ready', 'success');
    }, 1000);
});

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;
window.viewClientDetails = viewClientDetails;
window.markAsRead = markAsRead;
window.markAllAsRead = markAllAsRead;
window.editClient = editClient;
window.viewDetails = viewDetails;
window.createInvoiceForClient = createInvoiceForClient;
window.deleteClient = deleteClient;
