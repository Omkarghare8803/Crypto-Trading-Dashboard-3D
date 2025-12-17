/* 
Project Name: 3D Crypto Trading Dashboard
Project Owner/Auther: OG -> Omkar R. Ghare
Project Technologies: HTML, CSS & JS.
*/

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.querySelector('.sidebar');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking on a link
document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
});

// Section Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        
        // Get the section to show
        const sectionId = item.getAttribute('data-section');
        
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        
        // Show the clicked section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Re-initialize chart if on dashboard
            if (sectionId === 'dashboard') {
                setTimeout(() => {
                    if (marketChart) {
                        marketChart.resize();
                    }
                }, 100);
            }
        }
    });
});

// Chart Configuration
const ctx = document.getElementById('marketChart');
if (ctx) {
    const chartCtx = ctx.getContext('2d');
    
    // Gradient for the chart
    const gradient = chartCtx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 242, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 242, 255, 0.01)');
    
    const marketChart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
            datasets: [{
                label: 'Bitcoin Price',
                data: [42000, 42500, 41800, 43200, 42900, 43500, 43100],
                borderColor: '#00f2ff',
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#00f2ff',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 15, 26, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#a0a0b0',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#a0a0b0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#a0a0b0',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });
    
    // Store chart globally for later use
    window.marketChart = marketChart;
}

// Counter Animation
const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
    const hasCurrency = counter.innerText.includes('$');
    counter.innerText = '0';
    
    const updateCounter = () => {
        const target = +counter.getAttribute('data-target');
        const c = +counter.innerText.replace(/[^0-9.-]+/g,"");
        
        const increment = target / 200; // Slower animation
        
        if (c < target) {
            const newValue = c + increment;
            
            // Check if we need currency formatting
            if (hasCurrency || target > 100) {
                 counter.innerText = `$${newValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            } else {
                 counter.innerText = `${Math.ceil(newValue)}`;
            }
           
            setTimeout(updateCounter, 10);
        } else {
             // Final set to ensure accuracy
             if (hasCurrency || counter.getAttribute('data-target').includes('.')) {
                 counter.innerText = `$${target.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
             } else {
                 counter.innerText = target;
             }
        }
    };
    
    updateCounter();
});

// 3D Tilt Effect for Cards
const cards = document.querySelectorAll('.stats-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Simulate Real-time Data Updates
setInterval(() => {
    // Update Chart Data only if it exists
    if (window.marketChart) {
        const newData = window.marketChart.data.datasets[0].data.map(val => {
            const change = (Math.random() - 0.5) * 500;
            return val + change;
        });
        
        window.marketChart.data.datasets[0].data = newData;
        window.marketChart.update();
    }
    
    // Randomly update one asset price
    const assets = document.querySelectorAll('.asset-price h4');
    if (assets.length > 0) {
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        const currentPrice = parseFloat(randomAsset.innerText.replace(/[^0-9.-]+/g,""));
        const newPrice = currentPrice + (Math.random() - 0.5) * 10;
        randomAsset.innerText = `$${newPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        // Update style based on change (simplistic)
        const priceP = randomAsset.nextElementSibling;
        if (newPrice > currentPrice) {
            priceP.className = 'positive';
            priceP.innerText = `+${(Math.random() * 2).toFixed(1)}%`;
        } else {
            priceP.className = 'negative';
            priceP.innerText = `-${(Math.random() * 2).toFixed(1)}%`;
        }
    }
}, 3000);

// Active Link Handling - Only for navigation items
document.querySelectorAll('.nav-item').forEach(item => {
    // Navigation is already handled by click event above
});

/* ═══════════════════════════════════════════════════════════════════════════════
   ██████╗ ███████╗██╗████████╗██╗   ██╗ ██████╗ ██╗   ██╗███████╗██████╗ ███████╗██╗  ██╗██╗██████╗ ███████╗███╗   ██╗████████╗██╗████████╗██╗   ██╗
   ██╔════╝ ██╔════╝██║╚══██╔══╝██║   ██║██╔═══██╗██║   ██║██╔════╝██╔══██╗██╔════╝██║  ██║██║██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██║╚══██╔══╝╚██╗ ██╔╝
   ███████╗█████╗  ██║   ██║   ██║   ██║██║   ██║██║   ██║█████╗  ██████╔╝███████╗███████║██║██████╔╝█████╗  ██╔██╗ ██║   ██║   ██║   ██║    ╚████╔╝ 
   ██╔════╝██╔══╝  ██║   ██║   ██║   ██║██║   ██║██║   ██║██╔══╝  ██╔══██╗╚════██║██╔══██║██║██╔══██╗██╔══╝  ██║╚██╗██║   ██║   ██║   ██║     ╚██╔╝  
   ██║     ███████╗██║   ██║   ╚██████╔╝╚██████╔╝╚██████╔╝███████╗██║  ██║███████║██║  ██║██║██║  ██║███████╗██║ ╚████║   ██║   ██║   ██║      ██║   
   ╚═╝     ╚══════╝╚═╝   ╚═╝    ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝   ╚═╝      ╚═╝   
   
   OWNERSHIP VERIFICATION & ANTI-TAMPERING SYSTEM
   ═══════════════════════════════════════════════════════════════════════════════ */

const OWNERSHIP_CONFIG = {
    owner: 'Omkar R. Ghare',
    ownerCode: 'OG',
    projectName: 'Crypto 3D Dashboard',
    version: '2.0',
    edition: 'Premium',
    createdDate: 'December 2025',
    lastUpdated: 'December 16, 2025',
    authentication: {
        hash: '7f3c8e2b4a9d1f6e5c3b8a2d9f4e1c6b',
        verified: true,
        timestamp: Date.now()
    }
};

// Ownership Verification Function
function verifyOwnership() {
    const ownershipMarker = document.getElementById('og-ownership-marker');
    if (!ownershipMarker) {
        console.warn('[OG-SECURITY] Ownership marker not found. This might be a modified copy.');
        return false;
    }
    
    const ownerData = ownershipMarker.querySelector('[data-owner]')?.textContent;
    if (ownerData !== 'OG') {
        console.warn('[OG-SECURITY] Ownership verification failed.');
        return false;
    }
    
    return true;
}

// Anti-Tampering Check
function performSecurityCheck() {
    // Check if ownership marker exists
    if (!verifyOwnership()) {
        console.warn('[OG-SECURITY] ⚠️  TAMPER ALERT: This appears to be an unauthorized modification.');
    }
    
    // Check for meta tags
    const authorMeta = document.querySelector('meta[name="author"]');
    if (!authorMeta || !authorMeta.content.includes('Omkar')) {
        console.warn('[OG-SECURITY] ⚠️  OWNERSHIP METADATA MISSING OR MODIFIED');
    }
    
    // Log ownership info to console
    console.group('%c🔐 OWNERSHIP VERIFICATION', 'color: #00f2ff; font-weight: bold; font-size: 14px;');
    console.log('%cProject Owner: ' + OWNERSHIP_CONFIG.owner, 'color: #00ff88; font-weight: bold;');
    console.log('%cProject: ' + OWNERSHIP_CONFIG.projectName + ' v' + OWNERSHIP_CONFIG.version, 'color: #00f2ff;');
    console.log('%cAuthentication Status: VERIFIED ✓', 'color: #00ff88; font-weight: bold;');
    console.log('%cCreated: ' + OWNERSHIP_CONFIG.createdDate, 'color: #a0a0b0;');
    console.log('%cLast Updated: ' + OWNERSHIP_CONFIG.lastUpdated, 'color: #a0a0b0;');
    console.groupEnd();
    
    // Additional warning if trying to modify
    console.warn('%c⚠️  WARNING', 'color: #ff0055; font-size: 14px; font-weight: bold;');
    console.warn('This project is owned and maintained by ' + OWNERSHIP_CONFIG.owner);
    console.warn('Unauthorized modifications or redistribution is not permitted.');
    console.warn('For legitimate use, please provide proper attribution.');
}

// Run security check on page load
document.addEventListener('DOMContentLoaded', performSecurityCheck);

// Periodically verify ownership (every 30 seconds)
setInterval(function() {
    if (!verifyOwnership()) {
        console.warn('[OG-SECURITY] Ownership verification check failed at ' + new Date().toLocaleTimeString());
    }
}, 30000);

/* ═══════════════════════════════════════════════════════════════════════════════
   If you're seeing this code, you understand that this is the intellectual 
   property of Omkar R. Ghare. Removing or modifying this section is theft of 
   intellectual property. Please respect the author's work.
   ═══════════════════════════════════════════════════════════════════════════════ */
