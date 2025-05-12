import { History, Home, PlusSquare, QrCode, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function BottomBar() {
    const location = useLocation();
    // Check if current route is active
    const isActive = (path) => {
        return location.pathname === path
    }

    return (
        <>
            {/* Bottom Navigation (Mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="grid grid-cols-5 h-16">
                    <Link
                        to="/"
                        className={`flex flex-col items-center justify-center ${isActive("/") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
                    >
                        <Home size={20} />
                        <span className="text-xs mt-1">Home</span>
                    </Link>

                    <Link
                        to="/scanner"
                        className={`flex flex-col items-center justify-center ${isActive("/scan") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
                    >
                        <QrCode size={20} />
                        <span className="text-xs mt-1">Scan</span>
                    </Link>

                    <Link to="/generate" className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full mb-4 bg-blue-600 dark:bg-blue-500 flex items-center justify-center -mt-5 shadow-lg">
                            <PlusSquare size={24} className="text-white" />
                        </div>
                    </Link>

                    <Link
                        to="/history"
                        className={`flex flex-col items-center justify-center ${isActive("/history") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
                    >
                        <History size={20} />
                        <span className="text-xs mt-1">History</span>
                    </Link>

                    <Link
                        to="/settings"
                        className={`flex flex-col items-center justify-center ${isActive("/settings") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
                    >
                        <Settings size={20} />
                        <span className="text-xs mt-1">Settings</span>
                    </Link>
                </div>
            </nav>
        </>
    )
}

export default BottomBar;
