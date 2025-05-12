import { useState } from "react"
import { Bell, CheckCircle2, LayoutGrid, LogOut, Settings, ShoppingCart, User, UserCheck } from "lucide-react"
import { motion } from "framer-motion"
import AuthForm from "../components/AuthForm"

function Header() {
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false)
    const [showNotifications, setShowNotifications] = useState<boolean>(false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isStaff, setIsStaff] = useState<boolean>(false)

    const toggleLogin = () => {
        setIsLoggedIn(!isLoggedIn)
        setShowUserMenu(false)

        // If logging in, show mode selection
        if (!isLoggedIn) {
            setShowModeSelection(true)
            setIsStaff(true) // Auto set to staff for demo
        } else {
            // If logging out, reset staff status and mode
            setIsStaff(false)
            setScannerMode("general")
            setShowModeSelection(false)
        }
    }

    // Toggle staff status (for demo purposes)
    const toggleStaffStatus = () => {
        if (isLoggedIn) {
            setIsStaff(!isStaff)
            setShowUserMenu(false)
        }
    }

    // Render user menu
    const renderUserMenu = () => {
        if (!showUserMenu) return null

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-64 bg-gray-200 dark:bg-gray-600 rounded-xl shadow-lg border border-border z-40"
            >
                <div className="p-4 border-b border-border">
                    <p className="font-medium font-onest">{isLoggedIn ? "User Account" : "Not Logged In"}</p>
                    <p className="text-sm text-muted-foreground">
                        {isLoggedIn ? (isStaff ? "Staff Account" : "Regular Account") : "Guest User"}
                    </p>
                </div>
                <div className="p-2">
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={toggleStaffStatus}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-background flex items-center gap-2 transition-colors"
                            >
                                <Settings size={16} />
                                {isStaff ? "Switch to Regular Mode" : "Switch to Staff Mode"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowUserMenu(false)
                                    setShowModeSelection(true)
                                }}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-background flex items-center gap-2 transition-colors"
                            >
                                <LayoutGrid size={16} />
                                Change Scanner Mode
                            </button>
                            <div className="h-px bg-border my-1"></div>
                            <button
                                onClick={toggleLogin}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-background flex items-center gap-2 transition-colors text-destructive"
                            >
                                <LogOut size={16} />
                                Log Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={toggleLogin}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-background flex items-center gap-2 transition-colors text-accent"
                        >
                            <User size={16} />
                            Log In
                        </button>
                    )}
                </div>
            </motion.div>
        )
    }
    // Render notifications panel
    const renderNotifications: any = () => {
        if (!showNotifications) return null

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-80 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg border border-border z-40"
            >
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <p className="font-medium font-onest">Notifications</p>
                    <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">3 new</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                    <div className="p-4 border-b border-border hover:bg-background transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                <UserCheck size={16} />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Employee Check-in</p>
                                <p className="text-xs text-muted-foreground">John Doe checked in at 9:15 AM</p>
                                <p className="text-xs text-accent mt-1">2 minutes ago</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-b border-border hover:bg-background transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-mainOrange/10 flex items-center justify-center text-mainOrange flex-shrink-0">
                                <ShoppingCart size={16} />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Procurement Alert</p>
                                <p className="text-xs text-muted-foreground">5 items are low in stock</p>
                                <p className="text-xs text-accent mt-1">15 minutes ago</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-b border-border hover:bg-background transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                                <CheckCircle2 size={16} />
                            </div>
                            <div>
                                <p className="font-medium text-sm">System Update</p>
                                <p className="text-xs text-muted-foreground">Scanner software updated to v2.1</p>
                                <p className="text-xs text-accent mt-1">1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-3 border-t border-border">
                    <button className="w-full text-center text-sm text-accent font-medium">View All Notifications</button>
                </div>
            </motion.div>
        )
    }

    return (
        <>
            {/* Header with navigation and user profile */}
            <div className="container mx-auto px-4 py-6 font-nunito">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold font-onest text-primary">QR Scanner</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications)
                                    setShowUserMenu(false)
                                }}
                                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-muted transition-colors relative"
                            >
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600  rounded-full flex items-center justify-center text-[10px] font-bold">
                                    3
                                </span>
                            </button>
                            {renderNotifications()}
                        </div>


                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowUserMenu(!showUserMenu)
                                    setShowNotifications(false)
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLoggedIn ? "bg-accent text-white" : "bg-blue-600 hover:bg-muted"
                                    }`}
                            >
                                <User size={20} />
                            </button>
                            {isLoggedIn && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-mainBlue rounded-full border-2 border-white dark:border-primary"></div>
                            )}
                            {renderUserMenu()}
                        </div>
                    </div>
                </div>
            </div>
            {
                showUserMenu && <AuthForm onClose={() => setShowUserMenu(false)} />
            }
        </>
    )
}

export default Header;
