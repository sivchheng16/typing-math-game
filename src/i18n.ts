// src/i18n.ts — Bilingual translations: English + Khmer

export type Lang = 'en' | 'km';

const translations = {
    en: {
        // ── Navbar ──────────────────────────────────────────────
        score: 'Score',
        level: 'Level',
        bufferIntegrity: 'Health',
        soundOn: 'Sound On (M)',
        soundOff: 'Sound Off (M)',
        backToMenu: 'Back to Menu',
        openReference: 'Open Guide',
        langLabel: 'KH',

        // ── Power-up badges ─────────────────────────────────────
        slow: 'SLOW',
        shield: 'SHIELD',
        doubleScore: '2X SCORE',

        // ── Main Menu ───────────────────────────────────────────
        sysInit: 'Typing Math Game',
        subtitle: 'Solve fast — type the answer before time runs out!',
        cpuOverload: 'Calculate Numbers',
        dataStream: 'Speed Type',
        highScore: 'High Score',
        cpuDesc: 'Numbers fall from the top. Type the answer before they reach the bottom! Bigger numbers = harder math.',
        streamDesc: 'Numbers fall from the top. Type each number before it reaches the bottom! No math needed — just speed and focus.',
        easy: 'EASY',
        medium: 'MEDIUM',
        hard: 'HARD',
        initCpu: 'START MATH',
        initStream: 'START TYPING',
        trainingProtocol: 'TUTORIAL',

        // ── Gameplay ─────────────────────────────────────────────
        typeAnswer: 'Answer...',
        sysOffline: 'Paused',
        escMenu: 'Menu',
        restart: 'Restart',
        mute: 'Mute',
        pause: 'Pause',
        resume: 'Resume',

        // ── Reference Panel ──────────────────────────────────────
        referenceTitle: 'Guide',
        powerUps: 'Power-ups',
        slowPowerName: '⏱ SLOW',
        shieldPowerName: '🛡 SHIELD',
        doublePowerName: '⚡ 2X',
        slowPowerDesc: 'Numbers fall slower for 10 seconds. More time to think!',
        shieldPowerDesc: "Protects you for 10 seconds. Missing numbers won't hurt you!",
        doublePowerDesc: 'Get double points for every correct answer for 10 seconds!',
        powerGlowHint: 'Special numbers glow — type them first for bonus help!',
        binaryTitle: 'Binary (Base 2)',
        binaryPrefix: 'Prefix: ',
        binaryDesc: '. Uses only 0 and 1.',
        hexTitle: 'Hexadecimal (Base 16)',
        hexPrefix: 'Prefix: ',
        hexDesc: '. Uses 0-9 and A-F.',
        moduloTitle: 'Modulo (%)',
        moduloDesc: 'The leftover after dividing.',

        // ── Game Over ────────────────────────────────────────────
        sysCrashed: 'GAME OVER',
        bufferOverflow: 'Too many numbers reached the bottom.',
        finalScore: 'Final Score',
        levelReached: 'Level Reached',
        newHighScore: 'NEW HIGH SCORE!',
        tip: 'Tip',
        tipPowerup: 'Look for glowing special numbers — SLOW ⏱, SHIELD 🛡, and 2X ⚡ give you extra help!',
        tipHealth: 'Each correct answer heals you. Level up every 500 points to get more health!',
        reboot: 'TRY AGAIN',
        returnMenu: 'BACK TO MENU',

        // ── Tutorial ─────────────────────────────────────────────
        trainingProtocolTitle: 'TUTORIAL',
        exitTraining: 'EXIT TUTORIAL',
        continue: 'CONTINUE',
        back: 'BACK',
        incorrectKey: 'WRONG KEY',
        useFinger: 'Use',
        toPress: 'to press',

        // Tutorial step titles
        t1Title: 'How to Play',
        t2Title: 'Finger Position',
        t3Title: 'Reaching the Numbers',
        t4Title: 'Practice: Left Hand',
        t5Title: 'Practice: Right Hand',
        t6Title: 'Practice: Both Hands',
        t7Title: "You're Ready!",

        // Tutorial step content
        t1Content: 'Welcome! Numbers will fall from the top of the screen. Type the correct answer before they reach the bottom.',
        t2Content: 'Put your fingers on the middle row of the keyboard (A-S-D-F and J-K-L-;). This is the starting position for fast typing.',
        t3Content: 'Move your fingers up from the middle row to press the number keys (1-0). Try to look at the screen, not your hands.',
        t4Content: 'Type each number using the correct LEFT hand finger. The glowing key shows which one to press.',
        t5Content: 'Now use your RIGHT hand. Type each number when it glows — bring your fingers back to the middle row after each press.',
        t6Content: 'Last exercise — use BOTH hands. This is just like the real game. Stay calm and type steadily!',
        t7Content: 'Great job! Here are some tips before you play:\n• Correct answers heal your health\n• Special power-ups (SLOW ⏱, SHIELD 🛡, 2X ⚡) appear on glowing numbers — get them first!\n• Level up every 500 points for extra health\n• Press R to restart, ESC for menu, M to mute',

        // Finger names
        lPinky: 'Left Pinky',
        lRing: 'Left Ring',
        lMiddle: 'Left Middle',
        lIndex: 'Left Index',
        rIndex: 'Right Index',
        rMiddle: 'Right Middle',
        rRing: 'Right Ring',
        rPinky: 'Right Pinky',
    },

    km: {
        // ── Navbar ──────────────────────────────────────────────
        score: 'ពិន្ទុ',
        level: 'កម្រិត',
        bufferIntegrity: 'ជីវិត',
        soundOn: 'បើកសំឡេង (M)',
        soundOff: 'បិទសំឡេង (M)',
        backToMenu: 'ត្រឡប់ទៅម៉ឺនុយ',
        openReference: 'បើកការណែនាំ',
        langLabel: 'EN',

        // ── Power-up badges ─────────────────────────────────────
        slow: 'យឺត',
        shield: 'ខែល',
        doubleScore: 'x2 ពិន្ទុ',

        // ── Main Menu ───────────────────────────────────────────
        sysInit: 'ហ្គេមវាយគណិតវិទ្យា',
        subtitle: 'ដោះស្រាយឱ្យលឿន! វាយចម្លើយមុនពេលអស់ពេល!',
        cpuOverload: 'គណនាលេខ',
        dataStream: 'វាយលឿន',
        highScore: 'ពិន្ទុខ្ពស់បំផុត',
        cpuDesc: 'លេខនឹងធ្លាក់ពីខាងលើ។ វាយចម្លើយមុនពេលវាដល់ខាងក្រោម! លេខកាន់តែធំ គណិតកាន់តែពិបាក។',
        streamDesc: 'លេខនឹងធ្លាក់ពីខាងលើ។ វាយលេខនីមួយៗមុនពេលវាដល់ខាងក្រោម! មិនចំបាច់គិតទេ គ្រាន់តែលឿន និងមើលច្បាស់!',
        easy: 'ងាយ',
        medium: 'មធ្យម',
        hard: 'ពិបាក',
        initCpu: 'ចាប់ផ្ដើមគណិត',
        initStream: 'ចាប់ផ្ដើមវាយ',
        trainingProtocol: 'មេរៀន',

        // ── Gameplay ─────────────────────────────────────────────
        typeAnswer: 'ចម្លើយ...',
        sysOffline: 'ផ្អាក',
        escMenu: 'ម៉ឺនុយ',
        restart: 'ចាប់ផ្ដើមម្ដងទៀត',
        mute: 'បិទសំឡេង',
        pause: 'ផ្អាក',
        resume: 'បន្ត',

        // ── Reference Panel ──────────────────────────────────────
        referenceTitle: 'ការណែនាំ',
        powerUps: 'អានុភាព',
        slowPowerName: '⏱ យឺត',
        shieldPowerName: '🛡 ខែល',
        doublePowerName: '⚡ x2',
        slowPowerDesc: 'លេខធ្លាក់យឺតលង ១០ វិ។ មានពេលគិតច្រើនជាង!',
        shieldPowerDesc: 'ការពារអ្នក ១០ វិ។ លេខដែលមិនបានវាយ មិនបាត់ជីវិតទេ!',
        doublePowerDesc: 'ពិន្ទុ x2 រៀងរាល់ចម្លើយត្រឹមត្រូវ ១០ វិ!',
        powerGlowHint: 'លេខពិសេសភ្លឺ — វាយយកវាមុនសិន ដើម្បីបានជំនួយបន្ថែម!',
        binaryTitle: 'ប្រព័ន្ធគូ (មូលដ្ឋាន ២)',
        binaryPrefix: 'បុព្វបទ៖ ',
        binaryDesc: '។ ប្រើតែ ០ និង ១ ។',
        hexTitle: 'ប្រព័ន្ធដប់ប្រាំមួយ (មូលដ្ឋាន ១៦)',
        hexPrefix: 'បុព្វបទ៖ ',
        hexDesc: '។ ប្រើ ០-៩ និង A-F ។',
        moduloTitle: 'សំណល់ (%)',
        moduloDesc: 'សំណល់ដែលនៅសល់ពីការចែក។',

        // ── Game Over ────────────────────────────────────────────
        sysCrashed: 'ចប់ហ្គេម',
        bufferOverflow: 'លេខច្រើនពេកដល់ខាងក្រោម។',
        finalScore: 'ពិន្ទុចុងក្រោយ',
        levelReached: 'កម្រិតដែលបានដល់',
        newHighScore: 'ពិន្ទុខ្ពស់ថ្មី!',
        tip: 'គន្លឹះ',
        tipPowerup: 'មើលលេខពិសេសដែលភ្លឺ — យឺត ⏱ ខែល 🛡 និង x2 ⚡ ជួយអ្នកបន្ថែម!',
        tipHealth: 'ចម្លើយត្រឹមត្រូវជួយបំពេញជីវិត។ ឡើងកម្រិតរៀងរាល់ ៥០០ ពិន្ទុ ដើម្បីបានជីវិតបន្ថែម!',
        reboot: 'លេងម្ដងទៀត',
        returnMenu: 'ត្រឡប់ទៅម៉ឺនុយ',

        // ── Tutorial ─────────────────────────────────────────────
        trainingProtocolTitle: 'មេរៀន',
        exitTraining: 'ចេញពីមេរៀន',
        continue: 'បន្ត',
        back: 'ត្រឡប់',
        incorrectKey: 'ចុចខុស',
        useFinger: 'ប្រើ',
        toPress: 'ដើម្បីចុច',

        // Tutorial step titles
        t1Title: 'របៀបលេង',
        t2Title: 'ទីតាំងម្រាមដៃ',
        t3Title: 'វាយលេខ',
        t4Title: 'លំហាត់: ដៃឆ្វេង',
        t5Title: 'លំហាត់: ដៃស្ដាំ',
        t6Title: 'លំហាត់: ដៃទាំងពីរ',
        t7Title: 'អ្នករៀចរាល់ហើយ!',

        // Tutorial step content
        t1Content: 'សូមស្វាគមន៍! លេខនឹងធ្លាក់ពីខាងលើ។ វាយចម្លើយឱ្យត្រឹមត្រូវ មុនពេលវាដល់ខាងក្រោម។',
        t2Content: 'ដាក់ម្រាមដៃនៅលើជួរកណ្តាលនៃក្តារចុច (A-S-D-F និង J-K-L-;)។ នេះជាទីតាំងចាប់ផ្ដើមសម្រាប់ការវាយលឿន។',
        t3Content: 'លើកម្រាមដៃពីជួរកណ្តាលទៅវាយលេខ (1-0)។ ព្យាយាមមើលលើអេក្រង់ កុំមើលដៃ!',
        t4Content: 'វាយលេខនីមួយៗដោយប្រើម្រាមដៃឆ្វេងឱ្យត្រឹមត្រូវ។ ប៊ូតុងដែលភ្លឺបង្ហាញគោលដៅដែលអ្នកត្រូវចុច។',
        t5Content: 'ឥឡូវប្រើដៃស្ដាំវិញ។ វាយលេខនៅពេលវាភ្លឺ — ដាក់ម្រាមដៃមកជួរកណ្តាលវិញរាល់ពេលវាយរួច។',
        t6Content: 'វគ្គចុងក្រោយ — ប្រើដៃទាំងពីរ។ ដូចជាពេលលេងហ្គេមពិតៗ។ រក្សាស្មារតីឱ្យស្ងប់ ហើយវាយឱ្យទៀងទាត់!',
        t7Content: 'អ្នកពូកែហើយ! គន្លឹះខ្លះៗមុនពេលលេង៖\n• ចម្លើយត្រឹមត្រូវជួយបំពេញជីវិត\n• លេខពិសេស (យឺត ⏱ ខែល 🛡 x2 ⚡) នឹងភ្លឺឡើង — វាយយកវាមុនសិន!\n• ឡើងកម្រិតរៀងរាល់ ៥០០ ពិន្ទុ ដើម្បីបានជីវិតបន្ថែម\n• ចុច R លេងម្ដងទៀត, ESC ម៉ឺនុយ, M បិទសំឡេង',

        // Finger names
        lPinky: 'កូនម្រាមឆ្វេង',
        lRing: 'ម្រាមចិញ្ចៀនឆ្វេង',
        lMiddle: 'ម្រាមកណ្ដាលឆ្វេង',
        lIndex: 'ម្រាមចង្អុលឆ្វេង',
        rIndex: 'ម្រាមចង្អុលស្ដាំ',
        rMiddle: 'ម្រាមកណ្ដាលស្ដាំ',
        rRing: 'ម្រាមចិញ្ចៀនស្ដាំ',
        rPinky: 'កូនម្រាមស្ដាំ',
    },
} as const;

export type TranslationKey = keyof typeof translations.en;
export default translations;
