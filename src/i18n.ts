// src/i18n.ts — Bilingual translations: English + Khmer

export type Lang = 'en' | 'km';

const translations = {
    en: {
        // ── Navbar ──────────────────────────────────────────────
        score: 'Score',
        level: 'Level',
        bufferIntegrity: 'Buffer Integrity',
        soundOn: 'Sound On (M)',
        soundOff: 'Sound Off (M)',
        backToMenu: 'Back to Menu',
        openReference: 'Open Reference',
        langLabel: 'KH',

        // ── Power-up badges ─────────────────────────────────────
        slow: 'SLOW',
        shield: 'SHIELD',
        doubleScore: '2X SCORE',

        // ── Main Menu ───────────────────────────────────────────
        sysInit: 'Mathematics',
        subtitle: "Resolve quickly - type the result before it's out.",
        cpuOverload: 'Calculate numbers',
        dataStream: 'Speed Type',
        highScore: 'High Score',
        cpuDesc: 'Calculate the number that falls. Solve each number before it go out! The bigger the number, the harder the solution.',
        streamDesc: 'Type the numbers that fall. Enter each number accurately! No need to calculate, just speed and a sharp eye.',
        easy: 'EASY',
        medium: 'MEDIUM',
        hard: 'HARD',
        initCpu: 'START MATH',
        initStream: 'START TYPING',
        trainingProtocol: 'TUTORIAL',

        // ── Gameplay ─────────────────────────────────────────────
        typeAnswer: 'Type answer...',
        sysOffline: 'System Offline',
        escMenu: 'Menu',
        restart: 'Restart',
        mute: 'Mute',

        // ── Reference Panel ──────────────────────────────────────
        referenceTitle: 'Reference',
        powerUps: 'Power-ups',
        slowPowerName: '⏱ SLOW',
        shieldPowerName: '🛡 SHIELD',
        doublePowerName: '⚡ 2X',
        slowPowerDesc: 'Halves fall speed for 10 seconds. Gives you breathing room.',
        shieldPowerDesc: 'Blocks all buffer damage for 10 seconds. Miss without penalty.',
        doublePowerDesc: 'Doubles score from every correct answer for 10 seconds.',
        powerGlowHint: 'Power-up equations glow — prioritize them for maximum impact.',
        binaryTitle: 'Binary (Base 2)',
        binaryPrefix: 'Prefix: ',
        binaryDesc: '. Uses only 0 and 1.',
        hexTitle: 'Hexadecimal (Base 16)',
        hexPrefix: 'Prefix: ',
        hexDesc: '. Uses 0-9 and A-F.',
        moduloTitle: 'Modulo (%)',
        moduloDesc: 'The remainder after division.',

        // ── Game Over ────────────────────────────────────────────
        sysCrashed: 'BUFFER OVERFLOW',
        bufferOverflow: 'Too many equations breached the line.',
        finalScore: 'Final Score',
        levelReached: 'Level Reached',
        newHighScore: 'NEW HIGH SCORE!',
        tip: 'Tip',
        tipPowerup: 'Watch for glowing power-up equations — SLOW ⏱, SHIELD 🛡, and 2X ⚡ can turn the tide.',
        tipHealth: 'Each correct answer restores Buffer Integrity. Level up every 500 XP for a health boost.',
        reboot: 'REBOOT SYSTEM',
        returnMenu: 'RETURN TO MENU',

        // ── Tutorial ─────────────────────────────────────────────
        trainingProtocolTitle: 'TUTORIAL',
        exitTraining: 'EXIT TRAINING',
        continue: 'CONTINUE',
        incorrectKey: 'INCORRECT KEY',
        useFinger: 'Use',
        toPress: 'to press',

        // Tutorial step titles
        t1Title: 'System Interface',
        t2Title: 'Home Row Stance',
        t3Title: 'Number Reach',
        t4Title: 'Drill: Left Hand',
        t5Title: 'Drill: Right Hand',
        t6Title: 'Drill: Mixed',
        t7Title: 'Training Complete',

        // Tutorial step content
        t1Content: 'Welcome, students. Equations and sequences will fall from the top and end at the bottom. Please enter the correct answers before they break the buffer.',
        t2Content: 'Place your fingers on the keyboard in the Home row (A-S-D-F and J-K-L-;). This is the basis for your finger movements on the keyboard.',
        t3Content: 'Reach up from the Home Row to strike the number keys (1-0). Keep your eyes on the screen, not your fingers.',
        t4Content: 'Type each number using the correct LEFT hand finger shown below. The highlighted key is your target.',
        t5Content: 'Now switch to your RIGHT hand. Type each number as it lights up — return to home row after each strike.',
        t6Content: 'Final drill — both hands required. This is the closest simulation to real gameplay. Stay calm and type steadily.',
        t7Content: 'Systems online. A few tips before you engage:\n• Correct answers restore Buffer Integrity\n• Power-ups (SLOW ⏱, SHIELD 🛡, 2X ⚡) appear on special equations — prioritize them\n• Level up every 500 points to earn a health boost\n• Press R to restart, ESC for menu, M to mute',

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
        bufferIntegrity: 'ភាពត្រឹមត្រូវខ្ទប់',
        soundOn: 'បើកសំឡេង (M)',
        soundOff: 'បិទសំឡេង (M)',
        backToMenu: 'ត្រឡប់ទៅម៉ឺនុយ',
        openReference: 'បើកឯកសារយោង',
        langLabel: 'EN',

        // ── Power-up badges ─────────────────────────────────────
        slow: 'យឺត',
        shield: 'ខែល',
        doubleScore: 'x2 ពិន្ទុ',

        // ── Main Menu ───────────────────────────────────────────
        sysInit: 'គណិតវិទ្យា',
        subtitle: 'ដោះស្រាយឱ្យលឿន! វាយលទ្ធផលមុនពេលវាចេញក្រៅ!',
        cpuOverload: 'គណនាលេខ',
        dataStream: 'វាយលឿន',
        highScore: 'ពិន្ទុខ្ពស់បំផុត',
        cpuDesc: 'គណនាចំនួនដែលធ្លាក់។ ដោះស្រាយលេខនីមួយៗមុនពេលវាចេញក្រៅ! លេខកាន់តែធំ ដំណោះស្រាយកាន់តែពិបាក!',
        streamDesc: 'វាយបញ្ចូលលេខដែលធ្លាក់។ បញ្ចូលលេខនីមួយៗឲ្យបានត្រឹមត្រូវ! មិនចាំបាច់គណនាទេ គ្រាន់តែមានល្បឿននិងការសង្កេត!',
        easy: 'ងាយ',
        medium: 'មធ្យម',
        hard: 'ពិបាក',
        initCpu: 'ចាប់ផ្ដើមគណិត',
        initStream: 'ចាប់ផ្ដើមវាយ',
        trainingProtocol: 'មេរៀន',

        // ── Gameplay ─────────────────────────────────────────────
        typeAnswer: 'វាយចម្លើយ...',
        sysOffline: 'ប្រព័ន្ធបិទ',
        escMenu: 'ម៉ឺនុយ',
        restart: 'ចាប់ផ្ដើមម្ដងទៀត',
        mute: 'បិទសំឡេង',

        // ── Reference Panel ──────────────────────────────────────
        referenceTitle: 'ឯកសារយោង',
        powerUps: 'អានុភាព',
        slowPowerName: '⏱ យឺត',
        shieldPowerName: '🛡 ខែល',
        doublePowerName: '⚡ x2',
        slowPowerDesc: 'កាត់កន្លះល្បឿនដួលចុះ ១០ វិ។ ផ្ដល់ពេលសម្រាក!',
        shieldPowerDesc: 'ការពារខ្ទប់ ១០ វិ ពីការខូចខាតទាំងអស់!',
        doublePowerDesc: 'ពិន្ទុ x2 ពីចម្លើយត្រឹមត្រូវ ១០ វិ!',
        powerGlowHint: 'សមីការអានុភាពភ្លឺ — ផ្ដល់អាទិភាពដើម្បីប្រសិទ្ធភាពខ្ពស់!',
        binaryTitle: 'ប្រព័ន្ធគូ (មូលដ្ឋាន ២)',
        binaryPrefix: 'បុព្វបទ៖ ',
        binaryDesc: '។ ប្រើតែ ០ និង ១ ។',
        hexTitle: 'ប្រព័ន្ធដប់ប្រាំមួយ (មូលដ្ឋាន ១៦)',
        hexPrefix: 'បុព្វបទ៖ ',
        hexDesc: '។ ប្រើ ០-៩ និង A-F ។',
        moduloTitle: 'ច្រៃ (%)',
        moduloDesc: 'សំណល់បន្ទាប់ពីការចែក។',

        // ── Game Over ────────────────────────────────────────────
        sysCrashed: 'ខ្ទប់បានហូរលើស',
        bufferOverflow: 'សមីការច្រើនពេកបានឆ្លងកាត់បន្ទាត់។',
        finalScore: 'ពិន្ទុចុងក្រោយ',
        levelReached: 'កម្រិតដែលបានឈានដល់',
        newHighScore: 'ពិន្ទុខ្ពស់ថ្មី!',
        tip: 'គន្លឹះ',
        tipPowerup: 'ប្រយ័ត្នចំពោះសមីការអានុភាពភ្លឺ — យឺត ⏱, ខែល 🛡, និង x2 ⚡ អាចបង្វិលស្ថានការណ៍!',
        tipHealth: 'ចម្លើយត្រឹមត្រូវស្ដារខ្ទប់ម្ដងៗ។ ឡើងកម្រិតរៀងរាល់ ៥០០ XP ដើម្បីបង្កើនជីវិត!',
        reboot: 'ចាប់ប្រព័ន្ធឡើងវិញ',
        returnMenu: 'ត្រឡប់ទៅម៉ឺនុយ',

        // ── Tutorial ─────────────────────────────────────────────
        trainingProtocolTitle: 'មេរៀន',
        exitTraining: 'ចេញពីការហ្វឹកហ្វឺន',
        continue: 'បន្ត',
        incorrectKey: 'គ្រាប់ចុចខុស',
        useFinger: 'ប្រើ',
        toPress: 'ដើម្បីចុច',

        // Tutorial step titles
        t1Title: 'ចំណុចប្រទាក់ប្រព័ន្ធ',
        t2Title: 'ឥរិយាបថជួរផ្ទះ',
        t3Title: 'ការឈានដល់លេខ',
        t4Title: 'លំហាត់: ដៃឆ្វេង',
        t5Title: 'លំហាត់: ដៃស្ដាំ',
        t6Title: 'លំហាត់: ចម្រុះ',
        t7Title: 'ការហ្វឹកហ្វឺនបានបញ្ចប់',

        // Tutorial step content
        t1Content: 'សូមស្វាគមន៍ សិស្សានុសិស្ស។ សមីការ និងលំដាប់នឹងធ្លាក់ពីខាងលើ ហើយបញ្ចប់នៅខាងក្រោម។ សូមវាយបញ្ចូលចម្លើយដែលត្រឹមត្រូវ មុនពេលពួកវាបំបែកសតិ!',
        t2Content: 'ដាក់ម្រាមដៃរបស់អ្នកនៅលើក្តារចុចនៅជួរ Home (A-S-D-F និង J-K-L-;)។ នេះគឺជាមូលដ្ឋាននៃប្រតិបត្តិការម្រាមដៃរបស់អ្នកនៅលើក្តារចុច!',
        t3Content: 'លើកម្រាមដៃពីជួរកណ្តាល (Home Row) ទៅវាយលេខ (១-០)។ ព្យាយាមមើលតែលើអេក្រង់ កុំមើលដៃ!',
        t4Content: 'វាយលេខនីមួយៗដោយប្រើម្រាម ដៃឆ្វេង ឲ្យបានត្រឹមត្រូវតាមរូបខាងក្រោម។ មើលប៊ូតុងដែលលោតពន្លឺ ជាគោលដៅរបស់អ្នក!',
        t5Content: 'ឥឡូវប្តូរមកប្រើ ដៃស្តាំ វិញម្តង។ វាយលេខណាដែលលោតពន្លឺឡើង ហើយត្រូវដាក់ម្រាមដៃមក ជួរកណ្តាល វិញរាល់ពេលវាយរួច!',
        t6Content: 'វគ្គចុងក្រោយ — ត្រូវប្រើ ដៃទាំងពីរ។ នេះគឺជាការអនុវត្តដូចពេលលេងហ្គេមពិតៗអញ្ចឹង។ រក្សាស្មារតីឲ្យស្ងប់ ហើយវាយឲ្យទៀងទាត់!',
        t7Content: `ប្រព័ន្ធដំណើរការហើយ! គន្លឹះខ្លះៗមុនពេលចាប់ផ្តើម៖ 
        - ឆ្លើយត្រូវ នឹងជួយបំពេញ Buffer (ថាមពលការពារ) ឡើងវិញរូបសញ្ញាជំនួយ (យឺត ⏱, របាំងការពារ 🛡, មេគុណ២ ⚡) នឹងចេញមកតាមលេខពិសេស — ត្រូវប្រញាប់វាយយកវាឡើងវគ្គថ្មីរាល់ពេលបាន ៥០០ ពិន្ទុ ដើម្បីទទួលបានឈាមបន្ថែមចុច R ដើម្បីលេងឡើងវិញ, ESC ដើម្បីមើលម៉ឺនុយ, M ដើម្បីបិទសំឡេង`,

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
