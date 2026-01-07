// MK Vocab - Main App Module

const App = {
    // Vocabulary data cache
    vocabData: {},

    // Grade info
    grades: {
        m1: { name: 'ม.1', title: 'มัธยมศึกษาปีที่ 1', total: 499 },
        m2: { name: 'ม.2', title: 'มัธยมศึกษาปีที่ 2', total: 500 },
        m3: { name: 'ม.3', title: 'มัธยมศึกษาปีที่ 3', total: 500 },
        m4: { name: 'ม.4', title: 'มัธยมศึกษาปีที่ 4', total: 500 },
        m5: { name: 'ม.5', title: 'มัธยมศึกษาปีที่ 5', total: 500 },
        m6: { name: 'ม.6', title: 'มัธยมศึกษาปีที่ 6', total: 500 }
    },

    // Get greeting based on time
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'สวัสดีตอนเช้า ☀️';
        if (hour < 17) return 'สวัสดีตอนบ่าย 🌤️';
        return 'สวัสดีตอนเย็น 🌙';
    },

    // Load vocabulary data
    async loadVocabData(grade) {
        if (this.vocabData[grade]) {
            return this.vocabData[grade];
        }

        try {
            const response = await fetch(`data/${grade}.json`);
            if (!response.ok) throw new Error('Failed to load');
            const data = await response.json();
            this.vocabData[grade] = data;
            return data;
        } catch (error) {
            console.error(`Error loading ${grade} data:`, error);
            return null;
        }
    },

    // Render home page content
    renderHome() {
        const greeting = this.getGreeting();
        const stats = Storage.getStats();
        const streak = stats.streak || 0;

        // Update streak if playing today
        Storage.updateStreak();

        let html = `
            <div class="header fade-in">
                <h1 class="header-title">${greeting}</h1>
                <p class="header-subtitle">มาเรียนคำศัพท์กันเถอะ!</p>
            </div>

            <div class="section fade-in" style="animation-delay: 0.1s">
                <div class="flex items-center justify-between mb-4">
                    <div class="streak-badge">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C12 2 7 7 7 12C7 16 9.5 19 12 19C14.5 19 17 16 17 12C17 7 12 2 12 2Z"/>
                        </svg>
                        <span>${streak} วันต่อเนื่อง</span>
                    </div>
                    <a href="pages/stats.html" class="text-secondary" style="font-size: 14px;">ดูสถิติ →</a>
                </div>
            </div>

            <div class="section fade-in" style="animation-delay: 0.2s">
                <h2 class="section-title">
                    เลือกระดับชั้น
                    <span class="text-secondary" style="font-size: 14px;">${Storage.getTotalLearned()} คำที่เรียนแล้ว</span>
                </h2>
                <div class="grade-grid">
        `;

        Object.entries(this.grades).forEach(([grade, info], index) => {
            const progress = Storage.getProgress(grade, info.total);
            const circumference = 2 * Math.PI * 20;
            const offset = circumference - (progress / 100) * circumference;

            html += `
                <a href="pages/vocab-list.html?grade=${grade}" class="grade-card grade-${grade}" style="animation-delay: ${0.3 + index * 0.05}s">
                    <div class="flex items-center justify-between">
                        <div>
                            <div style="font-size: 28px; font-weight: 700;">${info.name}</div>
                            <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">${info.total} คำ</div>
                        </div>
                        <div class="progress-ring">
                            <svg width="48" height="48">
                                <circle class="progress-ring-circle" cx="24" cy="24" r="20"/>
                                <circle class="progress-ring-progress" cx="24" cy="24" r="20"
                                    stroke-dasharray="${circumference}"
                                    stroke-dashoffset="${offset}"/>
                            </svg>
                            <span class="progress-ring-text">${progress}%</span>
                        </div>
                    </div>
                </a>
            `;
        });

        html += `
                </div>
            </div>

            <div class="section fade-in" style="animation-delay: 0.5s">
                <h2 class="section-title">เกม</h2>
                <a href="pages/games.html" class="game-card game-matching" style="display: block; text-decoration: none;">
                    <div class="flex items-center gap-4">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                        </svg>
                        <div>
                            <div style="font-size: 18px; font-weight: 600;">เล่นเกมฝึกคำศัพท์</div>
                            <div style="font-size: 14px; opacity: 0.9;">จับคู่ • สะกดคำ • ควิซ</div>
                        </div>
                    </div>
                </a>
            </div>
        `;

        document.getElementById('app-content').innerHTML = html;
    },

    // Initialize app
    init() {
        Storage.init();
        this.renderHome();
        this.setupDarkMode();
    },

    // Setup dark mode
    setupDarkMode() {
        const settings = Storage.getSettings();
        if (settings.darkMode) {
            document.body.classList.add('dark');
        }
    },

    // Toggle dark mode
    toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark');
        Storage.updateSettings({ darkMode: isDark });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
