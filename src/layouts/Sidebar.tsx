import { History, Home, PlusSquare, QrCode, Settings } from "lucide-react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom";
export const Sidebar = () => {
    const location = useLocation();
    // Check if current route is active
    const isActive = (path: any) => {
        return location.pathname === path
    }

    return (
        <>
            {/* Side Navigation (Desktop/Tablet) */}
            < nav className="hidden md:block fixed  z-50 left-0 top-14 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200" >
                <div className="p-4">
                    <div className="space-y-1">
                        <Link
                            to="/"
                            className={`flex items-center px-4 py-3 rounded-lg ${isActive("/") ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                        >
                            <Home size={20} className="mr-3" />
                            <span className="font-medium">Home</span>
                        </Link>

                        <Link
                            to="/scanner"
                            className={`flex items-center px-4 py-3 rounded-lg ${isActive("/scan") ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                        >
                            <QrCode size={20} className="mr-3" />
                            <span className="font-medium">Scan QR Code</span>
                        </Link>

                        <Link
                            to="/generate"
                            className={`flex items-center px-4 py-3 rounded-lg ${isActive("/generate") ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                        >
                            <PlusSquare size={20} className="mr-3" />
                            <span className="font-medium">Generate QR</span>
                        </Link>

                        <Link
                            to="/history"
                            className={`flex items-center px-4 py-3 rounded-lg ${isActive("/history") ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                        >
                            <History size={20} className="mr-3" />
                            <span className="font-medium">Scan History</span>
                        </Link>

                        <Link
                            to="/settings"
                            className={`flex items-center px-4 py-3 rounded-lg ${isActive("/settings") ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                        >
                            <Settings size={20} className="mr-3" />
                            <span className="font-medium">Settings</span>
                        </Link>
                    </div>
                </div>
            </nav >
        </>
    )
}