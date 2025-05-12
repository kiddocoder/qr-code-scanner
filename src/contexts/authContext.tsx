import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
    id: string
    name: string
    email: string
    role: "staff" | "admin"
} | null

type AuthContextType = {
    user: User
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    signup: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        }
    }, [])

    const login = async (email: string, password: string) => {
        // This is a mock implementation. In a real app, you would call an API
        if (email && password) {
            const mockUser = {
                id: "1",
                name: "Test User",
                email,
                role: "staff" as const,
            }

            setUser(mockUser)
            setIsAuthenticated(true)
            localStorage.setItem("user", JSON.stringify(mockUser))
        } else {
            throw new Error("Invalid credentials")
        }
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem("user")
    }

    const signup = async (name: string, email: string, password: string) => {
        // This is a mock implementation. In a real app, you would call an API
        if (name && email && password) {
            const mockUser = {
                id: "1",
                name,
                email,
                role: "staff" as const,
            }

            setUser(mockUser)
            setIsAuthenticated(true)
            localStorage.setItem("user", JSON.stringify(mockUser))
        } else {
            throw new Error("Invalid signup data")
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup }}>{children}</AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
