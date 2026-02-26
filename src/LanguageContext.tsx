// src/LanguageContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import translations, { type Lang, type TranslationKey } from './i18n';

interface LanguageContextType {
    lang: Lang;
    toggleLang: () => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    toggleLang: () => { },
    t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>(() => {
        return (localStorage.getItem('lang') as Lang) || 'en';
    });

    const toggleLang = () => {
        setLang((prev) => {
            const next: Lang = prev === 'en' ? 'km' : 'en';
            localStorage.setItem('lang', next);
            return next;
        });
    };

    useEffect(() => {
        if (lang === 'km') {
            document.documentElement.classList.add('lang-km');
        } else {
            document.documentElement.classList.remove('lang-km');
        }
    }, [lang]);

    const t = (key: TranslationKey): string => translations[lang][key];

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    return useContext(LanguageContext);
}
