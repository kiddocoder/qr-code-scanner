
import { useState, useEffect } from "react"
import { ChevronLeft, Vibrate, Bell, Star, Share2, Shield, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Settings() {
    const navigate = useNavigate()
    const [vibrateEnabled, setVibrateEnabled] = useState(true)
    const [beepEnabled, setBeepEnabled] = useState(false)

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("qrScannerSettings")
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings)
                setVibrateEnabled(settings.vibrate ?? true)
                setBeepEnabled(settings.beep ?? false)
            } catch (error) {
                console.error("Failed to parse settings:", error)
            }
        }
    }, [])

    // Save settings to localStorage when they change
    useEffect(() => {
        const settings = {
            vibrate: vibrateEnabled,
            beep: beepEnabled,
        }
        localStorage.setItem("qrScannerSettings", JSON.stringify(settings))
    }, [vibrateEnabled, beepEnabled])

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "QR Scanner",
                    text: "Check out this awesome QR code scanner app!",
                    url: window.location.origin,
                })
            } catch (error) {
                console.error("Error sharing:", error)
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            alert("Share this app: " + window.location.origin)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-800" aria-label="Back">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl font-bold">Settings</h1>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {/* Settings Section */}
                <h2 className="text-lg font-medium text-yellow-500 mb-3">Settings</h2>

                <div className="space-y-3 mb-8">
                    {/* Vibrate Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                        <div className="flex items-center">
                            <div className="bg-gray-800 p-2 rounded-md mr-3">
                                <Vibrate className="h-5 w-5 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Vibrate</p>
                                <p className="text-xs text-gray-400">Vibration when scan is done.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={vibrateEnabled}
                                onChange={() => setVibrateEnabled(!vibrateEnabled)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                        </label>
                    </div>

                    {/* Beep Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                        <div className="flex items-center">
                            <div className="bg-gray-800 p-2 rounded-md mr-3">
                                <Bell className="h-5 w-5 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Beep</p>
                                <p className="text-xs text-gray-400">Beep when scan is done.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={beepEnabled}
                                onChange={() => setBeepEnabled(!beepEnabled)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                        </label>
                    </div>
                </div>

                {/* Support Section */}
                <h2 className="text-lg font-medium text-yellow-500 mb-3">Support</h2>

                <div className="space-y-px">
                    {/* Rate Us */}
                    <button
                        className="w-full flex items-center justify-between p-4 bg-gray-900 rounded-t-lg hover:bg-gray-800 transition-colors"
                        onClick={() => window.open("https://example.com/rate", "_blank")}
                    >
                        <div className="flex items-center">
                            <div className="bg-gray-800 p-2 rounded-md mr-3">
                                <Star className="h-5 w-5 text-gray-300" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium">Rate Us</p>
                                <p className="text-xs text-gray-400">Your best reward to us.</p>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                    </button>

                    {/* Share */}
                    <button
                        className="w-full flex items-center justify-between p-4 bg-gray-900 border-t border-gray-800 hover:bg-gray-800 transition-colors"
                        onClick={handleShare}
                    >
                        <div className="flex items-center">
                            <div className="bg-gray-800 p-2 rounded-md mr-3">
                                <Share2 className="h-5 w-5 text-gray-300" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium">Share</p>
                                <p className="text-xs text-gray-400">Share app with others.</p>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                    </button>

                    {/* Privacy Policy */}
                    <button
                        className="w-full flex items-center justify-between p-4 bg-gray-900 border-t border-gray-800 rounded-b-lg hover:bg-gray-800 transition-colors"
                        onClick={() => window.open("/privacy-policy", "_blank")}
                    >
                        <div className="flex items-center">
                            <div className="bg-gray-800 p-2 rounded-md mr-3">
                                <Shield className="h-5 w-5 text-gray-300" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium">Privacy Policy</p>
                                <p className="text-xs text-gray-400">Follow our policies that benefits you.</p>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                    </button>
                </div>

                {/* App Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">QR Scanner v1.0.0</p>
                    <p className="text-xs text-gray-600 mt-1">© 2025 All Rights Reserved</p>
                </div>
            </main>
        </div>
    )
}
