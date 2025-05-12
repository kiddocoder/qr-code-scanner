import type React from "react"

import { useState } from "react"
import { useAuth } from "../contexts/authContext"
import { X } from "lucide-react"

type AuthFormProps = {
    onClose: () => void
}

export default function AuthForm({ onClose }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { login, signup } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            if (isLogin) {
                await login(email, password)
            } else {
                await signup(name, email, password)
            }
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="relative bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-lg w-full max-w-md">
                <button
                    onClick={onClose}
                    className="absolute right-0 top-0 p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">{isLogin ? "Sign In" : "Create Account"}</h2>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-input rounded-md bg-background"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-input rounded-md bg-background"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-input rounded-md bg-background"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
                        {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    )
}
