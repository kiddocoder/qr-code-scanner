import BottomBar from "./BottomBar";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Sidebar } from "./Sidebar";



function AppLayout() {
    return (
        <div className="flex flex-col h-screen">
            <Sidebar />
            {/* Main Content */}
            <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <main className="flex-1 overflow-auto pb-16 md:pb-0">
                    <Header />
                    <Outlet />
                </main>
            </div>
            <BottomBar />
        </div>
    )
}

export default AppLayout;
