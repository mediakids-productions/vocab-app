// MK Vocab - Storage Module
// Handles all LocalStorage operations

const Storage = {
    KEYS: {
        USER_ID: 'mk_vocab_user_id',
        LEARNED: 'mk_vocab_learned',
        FAVORITES: 'mk_vocab_favorites',
        STATS: 'mk_vocab_stats',
        SETTINGS: 'mk_vocab_settings'
    },

    // Initialize storage with default values
    init() {
        if (!localStorage.getItem(this.KEYS.USER_ID)) {
            localStorage.setItem(this.KEYS.USER_ID, 'user_' + Date.now());
        }
        if (!localStorage.getItem(this.KEYS.LEARNED)) {
            localStorage.setItem(this.KEYS.LEARNED, JSON.stringify({
                m1: [], m2: [], m3: [], m4: [], m5: [], m6: []
            }));
        }
        if (!localStorage.getItem(this.KEYS.FAVORITES)) {
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify({
                m1: [], m2: [], m3: [], m4: [], m5: [], m6: []
            }));
        }
        if (!localStorage.getItem(this.KEYS.STATS)) {
            localStorage.setItem(this.KEYS.STATS, JSON.stringify({
                totalScore: 0,
                gamesPlayed: 0,
                streak: 0,
                lastPlayed: null,
                achievements: []
            }));
        }
        if (!localStorage.getItem(this.KEYS.SETTINGS)) {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify({
                speechRate: 0.9,
                darkMode: false
            }));
        }
    },

    // Get learned words for a grade
    getLearned(grade) {
        const learned = JSON.parse(localStorage.getItem(this.KEYS.LEARNED) || '{}');
        return learned[grade] || [];
    },

    // Mark word as learned
    markAsLearned(grade, wordId) {
        const learned = JSON.parse(localStorage.getItem(this.KEYS.LEARNED) || '{}');
        if (!learned[grade]) learned[grade] = [];
        if (!learned[grade].includes(wordId)) {
            learned[grade].push(wordId);
            localStorage.setItem(this.KEYS.LEARNED, JSON.stringify(learned));
        }
        return learned[grade];
    },

    // Remove from learned
    unmarkAsLearned(grade, wordId) {
        const learned = JSON.parse(localStorage.getItem(this.KEYS.LEARNED) || '{}');
        if (learned[grade]) {
            learned[grade] = learned[grade].filter(id => id !== wordId);
            localStorage.setItem(this.KEYS.LEARNED, JSON.stringify(learned));
        }
        return learned[grade];
    },

    // Check if word is learned
    isLearned(grade, wordId) {
        return this.getLearned(grade).includes(wordId);
    },

    // Get favorites for a grade
    getFavorites(grade) {
        const favorites = JSON.parse(localStorage.getItem(this.KEYS.FAVORITES) || '{}');
        return favorites[grade] || [];
    },

    // Toggle favorite
    toggleFavorite(grade, wordId) {
        const favorites = JSON.parse(localStorage.getItem(this.KEYS.FAVORITES) || '{}');
        if (!favorites[grade]) favorites[grade] = [];
        
        const index = favorites[grade].indexOf(wordId);
        if (index > -1) {
            favorites[grade].splice(index, 1);
        } else {
            favorites[grade].push(wordId);
        }
        localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
        return favorites[grade].includes(wordId);
    },

    // Check if word is favorite
    isFavorite(grade, wordId) {
        return this.getFavorites(grade).includes(wordId);
    },

    // Get stats
    getStats() {
        return JSON.parse(localStorage.getItem(this.KEYS.STATS) || '{}');
    },

    // Update streak
    updateStreak() {
        const stats = this.getStats();
        const today = new Date().toISOString().split('T')[0];
        const lastPlayed = stats.lastPlayed;

        if (lastPlayed === today) {
            // Already played today
            return stats.streak;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastPlayed === yesterdayStr) {
            // Played yesterday, increment streak
            stats.streak += 1;
        } else if (lastPlayed !== today) {
            // Missed a day, reset streak
            stats.streak = 1;
        }

        stats.lastPlayed = today;
        localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
        
        // Check for streak achievements
        this.checkStreakAchievements(stats.streak);
        
        return stats.streak;
    },

    // Add score
    addScore(points) {
        const stats = this.getStats();
        stats.totalScore += points;
        stats.gamesPlayed += 1;
        localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
        return stats.totalScore;
    },

    // Check and add achievements
    checkStreakAchievements(streak) {
        const stats = this.getStats();
        const achievements = stats.achievements || [];
        
        const streakAchievements = {
            3: 'streak_3',
            7: 'streak_7',
            14: 'streak_14',
            30: 'streak_30'
        };

        if (streakAchievements[streak] && !achievements.includes(streakAchievements[streak])) {
            achievements.push(streakAchievements[streak]);
            stats.achievements = achievements;
            localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
        }
    },

    // Add achievement
    addAchievement(achievementId) {
        const stats = this.getStats();
        if (!stats.achievements) stats.achievements = [];
        if (!stats.achievements.includes(achievementId)) {
            stats.achievements.push(achievementId);
            localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
        }
    },

    // Get progress for a grade
    getProgress(grade, totalWords) {
        const learned = this.getLearned(grade);
        return Math.round((learned.length / totalWords) * 100);
    },

    // Get all learned count
    getTotalLearned() {
        const learned = JSON.parse(localStorage.getItem(this.KEYS.LEARNED) || '{}');
        return Object.values(learned).reduce((sum, arr) => sum + arr.length, 0);
    },

    // Settings
    getSettings() {
        return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS) || '{}');
    },

    updateSettings(settings) {
        const current = this.getSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(updated));
        return updated;
    },

    // Export all data
    exportData() {
        const data = {
            userId: localStorage.getItem(this.KEYS.USER_ID),
            learned: JSON.parse(localStorage.getItem(this.KEYS.LEARNED) || '{}'),
            favorites: JSON.parse(localStorage.getItem(this.KEYS.FAVORITES) || '{}'),
            stats: JSON.parse(localStorage.getItem(this.KEYS.STATS) || '{}'),
            settings: JSON.parse(localStorage.getItem(this.KEYS.SETTINGS) || '{}'),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    },

    // Import data
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.learned) localStorage.setItem(this.KEYS.LEARNED, JSON.stringify(data.learned));
            if (data.favorites) localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(data.favorites));
            if (data.stats) localStorage.setItem(this.KEYS.STATS, JSON.stringify(data.stats));
            if (data.settings) localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(data.settings));
            return true;
        } catch (e) {
            console.error('Import failed:', e);
            return false;
        }
    },

    // Reset all data
    reset() {
        localStorage.removeItem(this.KEYS.LEARNED);
        localStorage.removeItem(this.KEYS.FAVORITES);
        localStorage.removeItem(this.KEYS.STATS);
        this.init();
    }
};

// Initialize on load
Storage.init();
