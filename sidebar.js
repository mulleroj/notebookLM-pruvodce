// Sidebar Navigation JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize sidebar
    initSidebar();
});

function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const expandableLinks = document.querySelectorAll('.sidebar-link.expandable');

    // Mobile toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        });
    }

    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function () {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Expandable menu items
    expandableLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const submenu = this.nextElementSibling;
            const isExpanded = this.classList.contains('expanded');

            // Close all other expanded menus
            expandableLinks.forEach(otherLink => {
                if (otherLink !== this) {
                    otherLink.classList.remove('expanded');
                    const otherSubmenu = otherLink.nextElementSibling;
                    if (otherSubmenu && otherSubmenu.classList.contains('sidebar-submenu')) {
                        otherSubmenu.classList.remove('expanded');
                    }
                }
            });

            // Toggle current menu
            this.classList.toggle('expanded');
            if (submenu && submenu.classList.contains('sidebar-submenu')) {
                submenu.classList.toggle('expanded');
            }
        });
    });

    // Set active page
    setActivePage();

    // Close sidebar on mobile when clicking a link
    const sidebarLinks = document.querySelectorAll('.sidebar-link:not(.expandable), .sidebar-sublink');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    });
}

function setActivePage() {
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar-link, .sidebar-sublink');

    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')))) {
            link.classList.add('active');

            // If it's a sublink, expand its parent menu
            if (link.classList.contains('sidebar-sublink')) {
                const submenu = link.closest('.sidebar-submenu');
                const parentLink = submenu.previousElementSibling;
                if (parentLink && parentLink.classList.contains('expandable')) {
                    parentLink.classList.add('expanded');
                    submenu.classList.add('expanded');
                }
            }
        }
    });
}

// Handle window resize
window.addEventListener('resize', function () {
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (window.innerWidth > 1024) {
        sidebar.classList.remove('open');
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
});
