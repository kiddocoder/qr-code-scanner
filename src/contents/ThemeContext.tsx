import React, { useEffect, useState } from "react";

export const ThemeContext = React.createContext<any>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Initialize theme from localStorage or system preference
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme")
        return savedTheme ? savedTheme === "dark" : prefersDarkMode
    })

    // Update body class and localStorage when theme changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
        localStorage.setItem("theme", darkMode ? "dark" : "light")
    }, [darkMode])

    // Toggle theme function
    const toggleTheme = () => {
        setDarkMode(!darkMode)
    }

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

// Custom hook for easier context usage
export const useTheme = () => {
    const context = React.useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useNetwork must be used within a NetworkProvider")
    }
    return context
}

