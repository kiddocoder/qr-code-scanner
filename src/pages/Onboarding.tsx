"use client"

import { useState, useEffect } from "react"
import {
    QrCode,
    Zap,
    Shield,
    History,
    PlusSquare,
    ArrowRight,
    Star,
    ChevronDown,
    ChevronUp,
    Download,
    Share2,
    Smartphone,
    CloudOff,
    Bell,
    Check,
    X,
    Settings,
    // Moon,
    Eye,
    Scan,
    Copy,
    ArrowUpRight,
    Users,
    BarChart,
    Box,
    MessageCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const Onboarding = () => {
    const [activeTab, setActiveTab] = useState("personal")
    const [openFaq, setOpenFaq] = useState(null)
    const [darkMode, setDarkMode] = useState(true)
    const [showNotification, setShowNotification] = useState(false)
    const [showDemoModal, setShowDemoModal] = useState(false)
    const [scanAnimation, setScanAnimation] = useState(false)
    const navigate = useNavigate();

    const recentScans = [
        { id: 1, type: "URL", content: "https://example.com", date: "2 mins ago", icon: "globe" },
        { id: 2, type: "WiFi", content: "Home_Network", date: "1 hour ago", icon: "wifi" },
        { id: 3, type: "Text", content: "Meeting notes from...", date: "Yesterday", icon: "file-text" },
    ]

    const faqs = [
        {
            question: "How accurate is the QR code scanner?",
            answer:
                "Our scanner uses advanced algorithms to ensure 99.9% accuracy even in low-light conditions or with partially damaged QR codes.",
        },
        {
            question: "Can I scan multiple QR codes at once?",
            answer: "Yes, with our Pro plan you can batch scan up to 50 QR codes simultaneously, saving you time and effort.",
        },
        {
            question: "Is my data secure when scanning QR codes?",
            answer:
                "Absolutely. We use end-to-end encryption and never store the content of your scans on our servers unless you explicitly save them to your history.",
        },
        {
            question: "Can I generate QR codes offline?",
            answer:
                "Yes, our app works offline for both scanning and generating QR codes. Your data will sync when you reconnect to the internet.",
        },
        {
            question: "Can I customize the design of my QR codes?",
            answer:
                "Yes! Pro users can customize colors, add logos, and choose from various design templates to create branded QR codes that match your style.",
        },
        {
            question: "How do I share my generated QR codes?",
            answer:
                "You can share directly via email, social media, or export as high-resolution PNG/SVG files for print materials.",
        },
    ]

    const useCases = [
        {
            title: "Retail",
            description: "Quick inventory management and product information access",
            icon: <Box className="h-8 w-8" />,
        },
        {
            title: "Events",
            description: "Seamless ticketing and attendee check-ins",
            icon: <Users className="h-8 w-8" />,
        },
        {
            title: "Marketing",
            description: "Track campaign performance with dynamic QR codes",
            icon: <BarChart className="h-8 w-8" />,
        },
        {
            title: "Customer Support",
            description: "Instant access to support resources and feedback forms",
            icon: <MessageCircle className="h-8 w-8" />,
        },
    ]

    const toggleFaq = (index: any) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    // Show notification after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotification(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    // Start scan animation when in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setScanAnimation(true)
                }
            },
            { threshold: 0.5 },
        )

        const heroSection = document.querySelector(".hero-section")
        if (heroSection) {
            observer.observe(heroSection)
        }

        return () => {
            if (heroSection) {
                observer.unobserve(heroSection)
            }
        }
    }, [])

    return (
        <div className={`min-h-screen font-nunito ${darkMode ? "bg-slate-900 text-white" : "bg-background"}`}>
            {/* Toggle Dark Mode */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="fixed top-4 right-4 z-50 p-2 rounded-full bg-primary text-white shadow-lg hover:bg-opacity-90 transition-all"
            >
                {/* <Moon size={20} /> */}
            </button>

            {/* Notification */}
            {showNotification && (
                <div className="fixed top-16 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border-l-4 border-accent animate-fadeIn flex items-start max-w-xs">
                    <div className="mr-3 mt-1">
                        <Bell size={20} className="text-accent" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-800">New Feature Available!</h4>
                        <p className="text-sm text-gray-600 mt-1">Try our new batch processing for QR codes.</p>
                    </div>
                    <button onClick={() => setShowNotification(false)} className="ml-2">
                        <X size={16} className="text-gray-400 hover:text-gray-600" />
                    </button>
                </div>
            )}

            {/* Hero Section */}
            <div className={`${darkMode ? "bg-slate-800" : "bg-primary"} text-white hero-section relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="container mx-auto px-4 py-16 md:py-24 md:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent/20 text-white mb-2">
                                <Star size={14} className="mr-1 text-secondary" />
                                <span>Trusted by 10M+ users worldwide</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold font-onest tracking-tight leading-tight">
                                QR Scanner <span className="text-secondary">Pro</span>
                            </h1>
                            <p className="text-xl opacity-90 max-w-lg">
                                The intelligent way to scan, generate, and process QR codes for personal and business use
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={() => navigate("/scanner")}
                                    className="bg-accent hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <QrCode size={20} />
                                    Start Scanning
                                </button>

                                <button
                                    onClick={() => navigate("/generate")}
                                    className="bg-secondary text-primary hover:bg-opacity-90 font-medium py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                                    <PlusSquare size={20} />
                                    Generate QR Code
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-sm mt-4">
                                <Check size={16} className="text-secondary" />
                                <span>No sign-up required to start</span>
                            </div>
                        </div>
                        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
                            <div
                                className={`relative transition-all duration-1000 ${scanAnimation ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
                            >
                                <div className="w-72 h-96 bg-slate-800 rounded-3xl border-4 border-mainWhite/10 shadow-2xl overflow-hidden">
                                    <div className="bg-slate-900 h-10 w-full flex items-center justify-center">
                                        <div className="w-32 h-4 rounded-full bg-slate-800"></div>
                                    </div>
                                    <div className="flex items-center justify-center p-4 h-full">
                                        <div className="relative w-full h-full bg-slate-700 rounded-lg flex items-center justify-center">
                                            <QrCode size={150} className="text-white opacity-50" />
                                            <div
                                                className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-accent opacity-50 ${scanAnimation ? "animate-scanline" : ""}`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating elements */}
                                <div className="absolute -top-4 -right-4 bg-mainWhite p-3 rounded-xl shadow-lg">
                                    <QrCode size={24} className="text-accent" />
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-mainWhite p-3 rounded-xl shadow-lg">
                                    <Zap size={24} className="text-mainOrange" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="none">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 50H48C96 50 192 50 288 35.5C384 21 480 -6.5 576 1.5C672 9.5 768 49 864 64.5C960 80 1056 71 1152 54.5C1248 38 1344 14 1392 2L1440 -10V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
                            fill={darkMode ? "#0f172a" : "#F8FAFC"}
                        />
                    </svg>
                </div>
            </div>

            <div className={`container mx-auto px-4 md:px-8 py-12 ${darkMode ? "text-gray-200" : ""}`}>
                {/* App Features Preview */}
                <div className="relative mb-12 pt-6">
                    <div className="flex overflow-x-auto pb-6 scrollbar-hide gap-4">
                        <div
                            className={`${darkMode ? "bg-slate-800" : "bg-mainWhite"} flex-shrink-0 rounded-xl shadow-md border ${darkMode ? "border-slate-700" : "border-gray-100"} p-4 w-72 snap-center`}
                        >
                            <div className="flex items-center mb-3">
                                <div className="p-3 rounded-full bg-blue-100 text-accent mr-3">
                                    <Scan size={20} />
                                </div>
                                <span className="font-medium">Quick Scan</span>
                            </div>
                            <div
                                className={`w-full h-32 ${darkMode ? "bg-slate-700" : "bg-gray-100"} rounded-lg flex items-center justify-center`}
                            >
                                <QrCode size={50} className={`${darkMode ? "text-slate-600" : "text-gray-300"}`} />
                            </div>
                            <div className="mt-3 text-sm">Instantly scan any QR code with your camera</div>
                        </div>

                        <div
                            className={`${darkMode ? "bg-slate-800" : "bg-mainWhite"} flex-shrink-0 rounded-xl shadow-md border ${darkMode ? "border-slate-700" : "border-gray-100"} p-4 w-72 snap-center`}
                        >
                            <div className="flex items-center mb-3">
                                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                                    <Eye size={20} />
                                </div>
                                <span className="font-medium">Scan History</span>
                            </div>
                            <div className={`w-full h-32 ${darkMode ? "bg-slate-700" : "bg-gray-100"} rounded-lg p-3`}>
                                <div className={`h-6 w-full ${darkMode ? "bg-slate-600" : "bg-gray-200"} rounded mb-2`}></div>
                                <div className={`h-6 w-3/4 ${darkMode ? "bg-slate-600" : "bg-gray-200"} rounded mb-2`}></div>
                                <div className={`h-6 w-1/2 ${darkMode ? "bg-slate-600" : "bg-gray-200"} rounded`}></div>
                            </div>
                            <div className="mt-3 text-sm">Keep track of all your previous scans</div>
                        </div>

                        <div
                            className={`${darkMode ? "bg-slate-800" : "bg-mainWhite"} flex-shrink-0 rounded-xl shadow-md border ${darkMode ? "border-slate-700" : "border-gray-100"} p-4 w-72 snap-center`}
                        >
                            <div className="flex items-center mb-3">
                                <div className="p-3 rounded-full bg-yellow-100 text-mainOrange mr-3">
                                    <PlusSquare size={20} />
                                </div>
                                <span className="font-medium">Custom Generator</span>
                            </div>
                            <div
                                className={`w-full h-32 ${darkMode ? "bg-slate-700" : "bg-gray-100"} rounded-lg flex items-center justify-center relative`}
                            >
                                <QrCode size={70} className="text-accent" />
                                <div className="absolute bottom-2 right-2 bg-secondary rounded-full p-1">
                                    <Settings size={12} className="text-primary" />
                                </div>
                            </div>
                            <div className="mt-3 text-sm">Create custom branded QR codes</div>
                        </div>

                        <div
                            className={`${darkMode ? "bg-slate-800" : "bg-mainWhite"} flex-shrink-0 rounded-xl shadow-md border ${darkMode ? "border-slate-700" : "border-gray-100"} p-4 w-72 snap-center`}
                        >
                            <div className="flex items-center mb-3">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                                    <Share2 size={20} />
                                </div>
                                <span className="font-medium">Easy Sharing</span>
                            </div>
                            <div
                                className={`w-full h-32 ${darkMode ? "bg-slate-700" : "bg-gray-100"} rounded-lg flex items-center justify-center`}
                            >
                                <div className="flex space-x-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                        <ArrowUpRight size={20} className="text-white" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                        <Copy size={20} className="text-white" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                                        <Download size={20} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-sm">Share across all your devices and apps</div>
                        </div>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background to-transparent w-16 h-full pointer-events-none"></div>
                </div>

                {/* Stats Section */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16`}>
                    <div
                        className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} rounded-xl p-6 shadow-md border hover:border-accent hover:shadow-lg transition-all duration-300`}
                    >
                        <p className="text-4xl font-bold text-accent font-onest">10M+</p>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Active Users</p>
                    </div>
                    <div
                        className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} rounded-xl p-6 shadow-md border hover:border-accent hover:shadow-lg transition-all duration-300`}
                    >
                        <p className="text-4xl font-bold text-accent font-onest">99.9%</p>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Scan Accuracy</p>
                    </div>
                    <div
                        className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} rounded-xl p-6 shadow-md border hover:border-accent hover:shadow-lg transition-all duration-300`}
                    >
                        <p className="text-4xl font-bold text-accent font-onest">50+</p>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>QR Code Types</p>
                    </div>
                    <div
                        className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} rounded-xl p-6 shadow-md border hover:border-accent hover:shadow-lg transition-all duration-300`}
                    >
                        <p className="text-4xl font-bold text-accent font-onest">4.9</p>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>App Store Rating</p>
                    </div>
                </div>

                {/* Features Section */}
                <section className="mb-16">
                    <h2 className={`text-2xl font-bold mb-2 font-onest ${darkMode ? "text-white" : "text-primary"}`}>
                        Smart Features
                    </h2>
                    <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Advanced capabilities that make QR scanning effortless
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div
                            className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} p-6 rounded-xl shadow-md border hover:shadow-lg transition-all duration-200 group`}
                        >
                            <div className="p-4 rounded-full bg-yellow-100 text-mainOrange inline-flex mb-4 group-hover:scale-110 transition-transform duration-200">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-2 font-onest">Smart Detection</h3>
                            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Automatically identifies and processes different QR code types including URLs, WiFi, contacts, and more.
                            </p>
                        </div>

                        <div
                            className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} p-6 rounded-xl shadow-md border hover:shadow-lg transition-all duration-200 group`}
                        >
                            <div className="p-4 rounded-full bg-green-100 text-green-600 inline-flex mb-4 group-hover:scale-110 transition-transform duration-200">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-2 font-onest">Secure Processing</h3>
                            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                End-to-end encryption ensures your sensitive QR code data remains private and secure.
                            </p>
                        </div>

                        <div
                            className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} p-6 rounded-xl shadow-md border hover:shadow-lg transition-all duration-200 group`}
                        >
                            <div className="p-4 rounded-full bg-purple-100 text-purple-600 inline-flex mb-4 group-hover:scale-110 transition-transform duration-200">
                                <History size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-2 font-onest">Scan History</h3>
                            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Keep track of all your scanned QR codes with searchable history and organization tools.
                            </p>
                        </div>

                        <div
                            className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} p-6 rounded-xl shadow-md border hover:shadow-lg transition-all duration-200 group`}
                        >
                            <div className="p-4 rounded-full bg-blue-100 text-accent inline-flex mb-4 group-hover:scale-110 transition-transform duration-200">
                                <PlusSquare size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-2 font-onest">QR Generator</h3>
                            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Create custom QR codes with your branding, colors, and embedded logos.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Use Cases Section - NEW */}
                <section className="mb-16">
                    <h2 className={`text-2xl font-bold mb-2 font-onest ${darkMode ? "text-white" : "text-primary"}`}>
                        Industry Use Cases
                    </h2>
                    <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        How businesses across industries leverage QR Scanner Pro
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {useCases.map((useCase, index) => (
                            <div
                                key={index}
                                className={`${darkMode ? "bg-slate-800 border-slate-700 hover:border-accent" : "bg-mainWhite border-gray-100 hover:border-accent"} p-6 rounded-xl shadow-md border transition-all duration-200 group relative overflow-hidden`}
                            >
                                <div className="relative z-10">
                                    <div className={`${darkMode ? "text-accent" : "text-accent"} mb-4`}>{useCase.icon}</div>
                                    <h3 className="text-lg font-bold mb-2 font-onest">{useCase.title}</h3>
                                    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>{useCase.description}</p>
                                    <button
                                        className={`mt-4 flex items-center text-sm font-medium ${darkMode ? "text-accent" : "text-accent"} group-hover:underline`}
                                    >
                                        Learn more <ArrowRight size={14} className="ml-1" />
                                    </button>
                                </div>
                                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent opacity-5 rounded-full group-hover:opacity-10 transition-opacity duration-300"></div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Scans Preview */}
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className={`text-2xl font-bold font-onest ${darkMode ? "text-white" : "text-primary"}`}>
                                Recent Scans
                            </h2>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Quickly access your latest scanned codes
                            </p>
                        </div>
                        <button className="text-accent hover:underline flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </button>
                    </div>

                    <div
                        className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} rounded-xl shadow-md overflow-hidden border`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`${darkMode ? "bg-slate-700" : "bg-gray-50"} text-left`}>
                                    <tr>
                                        <th className={`px-6 py-4 text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Type
                                        </th>
                                        <th className={`px-6 py-4 text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Content
                                        </th>
                                        <th className={`px-6 py-4 text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Scanned
                                        </th>
                                        <th className={`px-6 py-4 text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? "divide-slate-700" : "divide-gray-100"}`}>
                                    {recentScans.map((scan) => (
                                        <tr key={scan.id} className={`${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-50"} group`}>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-accent bg-opacity-10 flex items-center justify-center text-accent">
                                                        <QrCode size={16} />
                                                    </div>
                                                    {scan.type}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 ${darkMode ? "text-gray-400" : "text-gray-600"} truncate max-w-xs`}>
                                                {scan.content}
                                            </td>
                                            <td className={`px-6 py-4 ${darkMode ? "text-gray-500" : "text-gray-500"} text-sm`}>
                                                {scan.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className={`p-1.5 rounded-full ${darkMode ? "hover:bg-slate-600" : "hover:bg-gray-100"}`}
                                                    >
                                                        <Download size={16} className={`${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                                                    </button>
                                                    <button
                                                        className={`p-1.5 rounded-full ${darkMode ? "hover:bg-slate-600" : "hover:bg-gray-100"}`}
                                                    >
                                                        <Share2 size={16} className={`${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                                                    </button>
                                                    <button
                                                        className={`p-1.5 rounded-full ${darkMode ? "hover:bg-slate-600" : "hover:bg-gray-100"}`}
                                                    >
                                                        <Copy size={16} className={`${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Pro Features Section */}
                <section className="mb-16">
                    <h2 className={`text-2xl font-bold mb-2 font-onest ${darkMode ? "text-white" : "text-primary"}`}>
                        Choose Your Plan
                    </h2>
                    <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Select the plan that fits your scanning needs
                    </p>

                    <div className="flex justify-center mb-8">
                        <div className={`${darkMode ? "bg-slate-700" : "bg-gray-100"} p-1 rounded-full inline-flex`}>
                            <button
                                className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${activeTab === "personal"
                                    ? `${darkMode ? "bg-slate-800" : "bg-mainWhite"} shadow-md ${darkMode ? "text-white" : "text-primary"}`
                                    : `${darkMode ? "text-gray-300" : "text-gray-600"}`
                                    }`}
                                onClick={() => setActiveTab("personal")}
                            >
                                Personal
                            </button>
                            <button
                                className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${activeTab === "business"
                                    ? `${darkMode ? "bg-slate-800" : "bg-mainWhite"} shadow-md ${darkMode ? "text-white" : "text-primary"}`
                                    : `${darkMode ? "text-gray-300" : "text-gray-600"}`
                                    }`}
                                onClick={() => setActiveTab("business")}
                            >
                                Business
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div
                            className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} rounded-xl overflow-hidden shadow-md border`}
                        >
                            <div className="p-8">
                                <h3 className="text-xl font-bold mb-2 font-onest">Free</h3>
                                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>Basic scanning and generation</p>
                                <p className="text-4xl font-bold mb-6 font-onest">
                                    $0
                                    <span className={`${darkMode ? "text-gray-500" : "text-gray-400"} text-base font-normal`}>
                                        /month
                                    </span>
                                </p>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <ArrowRight size={12} className="text-green-600" />
                                        </div>
                                        <span>Unlimited QR code scans</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <ArrowRight size={12} className="text-green-600" />
                                        </div>
                                        <span>Basic QR code generation</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <ArrowRight size={12} className="text-green-600" />
                                        </div>
                                        <span>7-day scan history</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-400">
                                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                            <CloudOff size={12} className="text-gray-400" />
                                        </div>
                                        <span>No cloud backup</span>
                                    </li>
                                </ul>

                                <button
                                    className={`w-full border border-accent text-accent font-medium py-3 px-4 rounded-lg hover:bg-accent hover:text-white transition-colors duration-200`}
                                >
                                    Current Plan
                                </button>
                            </div>
                        </div>

                        <div className={`${darkMode ? "bg-primary" : "bg-primary"} rounded-xl overflow-hidden shadow-lg relative`}>
                            <div className="absolute top-0 right-0 bg-secondary text-primary font-medium py-1 px-4 rounded-bl-lg">
                                Popular
                            </div>
                            <div className="p-8 text-white">
                                <h3 className="text-xl font-bold mb-2 font-onest">Pro</h3>
                                <p className="text-blue-100 mb-6">Advanced features for power users</p>
                                <p className="text-4xl font-bold mb-6 font-onest">
                                    {activeTab === "personal" ? "$4.99" : "$12.99"}
                                    <span className="text-blue-200 text-base font-normal">/month</span>
                                </p>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                            <ArrowRight size={12} className="text-primary" />
                                        </div>
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                            <ArrowRight size={12} className="text-primary" />
                                        </div>
                                        <span>Batch scanning & processing</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                            <ArrowRight size={12} className="text-primary" />
                                        </div>
                                        <span>Custom QR code designs with logo</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                            <ArrowRight size={12} className="text-primary" />
                                        </div>
                                        <span>Unlimited scan history</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                            <ArrowRight size={12} className="text-primary" />
                                        </div>
                                        <span>Cloud backup & sync</span>
                                    </li>
                                    {activeTab === "business" && (
                                        <>
                                            <li className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                                    <ArrowRight size={12} className="text-primary" />
                                                </div>
                                                <span>Analytics dashboard</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                                    <ArrowRight size={12} className="text-primary" />
                                                </div>
                                                <span>Team sharing & permissions</span>
                                            </li>
                                        </>
                                    )}
                                </ul>

                                <button className="w-full bg-secondary text-primary font-medium py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg">
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="mb-16">
                    <h2 className={`text-2xl font-bold mb-2 font-onest ${darkMode ? "text-white" : "text-primary"}`}>
                        What Our Users Say
                    </h2>
                    <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Trusted by individuals and businesses worldwide
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div
                            className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} p-6 rounded-xl shadow-md border`}
                        >
                            <div className="flex gap-1 mb-4 text-secondary">
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                            </div>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                                "This app has revolutionized how our retail business handles inventory. The batch scanning feature saves
                                us hours every week!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full ${darkMode ? "bg-slate-700" : "bg-gray-200"} flex items-center justify-center`}
                                >
                                    <span className={`font-medium ${darkMode ? "text-white" : "text-primary"}`}>JD</span>
                                </div>
                                <div>
                                    <p className="font-medium">John Doe</p>
                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Retail Manager</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} p-6 rounded-xl shadow-md border`}
                        >
                            <div className="flex gap-1 mb-4 text-secondary">
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                            </div>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                                "The custom QR code designs with our logo have significantly improved our brand recognition at events.
                                Worth every penny!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full ${darkMode ? "bg-slate-700" : "bg-gray-200"} flex items-center justify-center`}
                                >
                                    <span className={`font-medium ${darkMode ? "text-white" : "text-primary"}`}>AS</span>
                                </div>
                                <div>
                                    <p className="font-medium">Alice Smith</p>
                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Marketing Director</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} p-6 rounded-xl shadow-md border`}
                        >
                            <div className="flex gap-1 mb-4 text-secondary">
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                                <Star size={20} fill="#FACC15" />
                            </div>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                                "I use this app daily for both personal and work purposes. The scan history and cloud sync make it easy
                                to access my QR codes from any device."
                            </p>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full ${darkMode ? "bg-slate-700" : "bg-gray-200"} flex items-center justify-center`}
                                >
                                    <span className={`font-medium ${darkMode ? "text-white" : "text-primary"}`}>RJ</span>
                                </div>
                                <div>
                                    <p className="font-medium">Robert Johnson</p>
                                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Freelance Developer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mb-16">
                    <h2 className={`text-2xl font-bold mb-2 font-onest ${darkMode ? "text-white" : "text-primary"}`}>
                        Frequently Asked Questions
                    </h2>
                    <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Find answers to common questions about QR Scanner Pro
                    </p>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} rounded-xl shadow-md border overflow-hidden`}
                            >
                                <button
                                    className="w-full p-6 text-left flex justify-between items-center"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="font-medium text-lg">{faq.question}</span>
                                    {openFaq === index ? (
                                        <ChevronUp size={20} className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                                    ) : (
                                        <ChevronDown size={20} className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                                    )}
                                </button>

                                {openFaq === index && (
                                    <div className={`px-6 pb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{faq.answer}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Download App Section */}
                <section className="mb-16 bg-gradient-to-r from-primary to-darkBlue text-white rounded-xl overflow-hidden">
                    <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3 mb-8 md:mb-0">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-onest">Get the Mobile App</h2>
                            <p className="text-blue-100 mb-6">
                                Scan QR codes on the go with our mobile app. Available for iOS and Android.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-mainBlack hover:bg-opacity-80 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200">
                                    <Download size={20} />
                                    App Store
                                </button>
                                <button className="bg-mainBlack hover:bg-opacity-80 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200">
                                    <Download size={20} />
                                    Google Play
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <div className="relative">
                                <Smartphone size={240} className="text-blue-200" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <QrCode size={100} className="text-secondary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Newsletter Section - NEW */}
                <section className="mb-16">
                    <div
                        className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-mainWhite border-gray-100"} rounded-xl p-8 shadow-md border`}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="md:w-1/2">
                                <h2 className={`text-2xl font-bold mb-2 font-onest ${darkMode ? "text-white" : "text-primary"}`}>
                                    Stay Updated
                                </h2>
                                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    Subscribe to our newsletter for the latest QR code technology updates and tips.
                                </p>
                            </div>
                            <div className="md:w-1/2 w-full">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className={`flex-1 px-4 py-3 rounded-lg ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder:text-gray-400" : "bg-white border-gray-200 text-gray-800"} border focus:outline-none focus:ring-2 focus:ring-accent`}
                                    />
                                    <button className="bg-accent hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                                        Subscribe
                                    </button>
                                </div>
                                <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    We respect your privacy. Unsubscribe at any time.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className={`${darkMode ? "bg-slate-800 border-t border-slate-700" : "bg-primary"} text-white py-12`}>
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4 font-onest">QR Scanner Pro</h3>
                            <p className="text-blue-200 text-sm">The intelligent way to scan, generate, and process QR codes.</p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Features</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        QR Scanner
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        QR Generator
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        History
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Pro Features
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-blue-200">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-blue-200 text-sm">© 2025 QR Scanner Pro. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Demo Modal */}
            {showDemoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div
                        className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-xl shadow-xl max-w-lg w-full overflow-hidden relative`}
                    >
                        <button
                            onClick={() => setShowDemoModal(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <div className="p-6">
                            <h3 className={`text-xl font-bold mb-2 font-onest ${darkMode ? "text-white" : "text-primary"}`}>
                                Scan QR Code
                            </h3>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                                Position the QR code within the frame to scan
                            </p>

                            <div
                                className={`${darkMode ? "bg-slate-700" : "bg-gray-100"} rounded-lg p-4 mb-4 aspect-square flex items-center justify-center relative`}
                            >
                                <div className="border-2 border-accent w-3/4 h-3/4 rounded-lg relative">
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent"></div>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <QrCode size={100} className={`${darkMode ? "text-slate-600" : "text-gray-300"}`} />
                                    </div>

                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-accent opacity-50 animate-scanline"></div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setShowDemoModal(false)}
                                    className={`${darkMode ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-800"} py-2 px-4 rounded-lg`}
                                >
                                    Cancel
                                </button>
                                <button className="bg-accent text-white py-2 px-4 rounded-lg">Upload Image</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add custom styles for animations */}
            <style>{`
        @keyframes scanline {
          0% {
            top: 0%;
          }
          50% {
            top: 90%;
          }
          100% {
            top: 0%;
          }
        }
        
        .animate-scanline {
          animation: scanline 3s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    )
}

export default Onboarding
