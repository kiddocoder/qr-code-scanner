"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
    ChevronLeft,
    Share2,
    Copy,
    Save,
    QrCode,
    Trash2,
    Search,
    X,
    Link,
    ShoppingCart,
    User,
    FileText,
} from "lucide-react"
import QRCodeGenerator from "../components/QrCodeGenerator"

type ScanHistoryItem = {
    id: string
    data: string
    type: string
    timestamp: string
    details?: Record<string, any>
}

export default function History() {
    const navigate = useNavigate()
    const [history, setHistory] = useState<ScanHistoryItem[]>([])
    const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null)
    const [showQRCode, setShowQRCode] = useState(false)
    const [copied, setCopied] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        // Load scan history from localStorage
        const storedHistory = localStorage.getItem("scanLogs")
        if (storedHistory) {
            try {
                const parsedHistory = JSON.parse(storedHistory)
                setHistory(
                    parsedHistory.map((item: any, index: number) => ({
                        ...item,
                        id: item.id || `scan-${index}`,
                    })),
                )
            } catch (error) {
                console.error("Failed to parse scan history:", error)
            }
        }
    }, [])

    // Filter history based on search term
    const filteredHistory = useMemo(() => {
        if (!searchTerm.trim()) return history

        const lowerSearchTerm = searchTerm.toLowerCase()

        return history.filter((item) => {
            // Search in data
            if (item.data.toLowerCase().includes(lowerSearchTerm)) return true

            // Search in type
            if (item.type.toLowerCase().includes(lowerSearchTerm)) return true

            // Search in date
            const date = new Date(item.timestamp)
            const dateStr = date.toLocaleDateString()
            const timeStr = date.toLocaleTimeString()
            const fullDateStr = `${dateStr} ${timeStr}`

            if (fullDateStr.toLowerCase().includes(lowerSearchTerm)) return true

            // Search in month name
            const monthName = date.toLocaleString("default", { month: "long" })
            if (monthName.toLowerCase().includes(lowerSearchTerm)) return true

            // Search in short month name
            const shortMonthName = date.toLocaleString("default", { month: "short" })
            if (shortMonthName.toLowerCase().includes(lowerSearchTerm)) return true

            return false
        })
    }, [history, searchTerm])

    const handleItemClick = (item: ScanHistoryItem) => {
        setSelectedItem(item)
        setShowQRCode(false)
    }

    const handleBack = () => {
        if (showQRCode) {
            setShowQRCode(false)
        } else if (selectedItem) {
            setSelectedItem(null)
        } else {
            navigate("/")
        }
    }

    const handleCopy = async () => {
        if (selectedItem) {
            await navigator.clipboard.writeText(selectedItem.data)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleShare = async () => {
        if (selectedItem && navigator.share) {
            try {
                await navigator.share({
                    title: "Shared QR Code",
                    text: `QR Code data: ${selectedItem.data}`,
                    url: selectedItem.data.startsWith("http") ? selectedItem.data : undefined,
                })
            } catch (error) {
                console.error("Error sharing:", error)
            }
        }
    }

    const handleSave = () => {
        const canvas = document.querySelector("canvas")
        if (canvas) {
            const dataUrl = canvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = dataUrl
            link.download = `qrcode-${new Date().getTime()}.png`
            link.click()
        }
    }

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const updatedHistory = history.filter((item) => item.id !== id)
        setHistory(updatedHistory)
        localStorage.setItem("scanLogs", JSON.stringify(updatedHistory))

        if (selectedItem && selectedItem.id === id) {
            setSelectedItem(null)
            setShowQRCode(false)
        }
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} ${date.getHours() >= 12 ? "pm" : "am"}`
        } catch (e) {
            return dateString
        }
    }

    const getDisplayData = (data: string) => {
        // Truncate long data for display
        return data.length > 30 ? `${data.substring(0, 30)}...` : data
    }

    const getTypeIcon = (type: string) => {
        // Return appropriate icon based on QR code type
        switch (type.toLowerCase()) {
            case "url":
                return <Link className="h-5 w-5 text-yellow-500" />
            case "product":
                return <ShoppingCart className="h-5 w-5 text-yellow-500" />
            case "employee":
                return <User className="h-5 w-5 text-yellow-500" />
            case "menu":
                return <FileText className="h-5 w-5 text-yellow-500" />
            default:
                return <QrCode className="h-5 w-5 text-yellow-500" />
        }
    }

    const toggleSearch = () => {
        setIsSearching(!isSearching)
        if (isSearching) {
            setSearchTerm("")
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        {(selectedItem || showQRCode) && (
                            <button onClick={handleBack} className="mr-3 p-1 rounded-full hover:bg-gray-800" aria-label="Back">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <h1 className="text-xl font-bold">{showQRCode ? "QR Code" : selectedItem ? "Result" : "History"}</h1>
                    </div>
                    <div className="flex items-center">
                        {!selectedItem && !showQRCode && (
                            <button
                                onClick={toggleSearch}
                                className={`p-2 rounded-full mr-2 ${isSearching ? "bg-yellow-600 text-black" : "hover:bg-gray-800"}`}
                                aria-label="Search"
                            >
                                {isSearching ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                            </button>
                        )}

                    </div>
                </div>

                {/* Search Bar */}
                {isSearching && !selectedItem && !showQRCode && (
                    <div className="container mx-auto px-4 py-2 border-t border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search history..."
                                className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-700"
                                >
                                    <X className="h-4 w-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-4">
                {/* History List View */}
                {!selectedItem && !showQRCode && (
                    <>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button
                                onClick={() => navigate("/")}
                                className="py-2 bg-yellow-600 text-black font-medium rounded-md hover:bg-yellow-700 transition-colors"
                            >
                                Scan
                            </button>
                            <button
                                onClick={() => navigate("/generate")}
                                className="py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Create
                            </button>
                        </div>

                        {filteredHistory.length > 0 ? (
                            <div className="space-y-3">
                                {searchTerm && (
                                    <div className="text-sm text-gray-400 mb-2">
                                        Found {filteredHistory.length} result{filteredHistory.length !== 1 ? "s" : ""} for "{searchTerm}"
                                    </div>
                                )}
                                {filteredHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleItemClick(item)}
                                        className="flex items-center justify-between p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <div className="bg-gray-800 p-2 rounded-md mr-3">{getTypeIcon(item.type)}</div>
                                            <div>
                                                <p className="text-sm font-medium">{getDisplayData(item.data)}</p>
                                                <p className="text-xs text-gray-400">{formatDate(item.timestamp)}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="p-2 text-gray-400 hover:text-yellow-500"
                                            aria-label="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="bg-gray-800 p-4 rounded-full mb-4">
                                    {searchTerm ? (
                                        <Search className="h-8 w-8 text-yellow-500" />
                                    ) : (
                                        <QrCode className="h-8 w-8 text-yellow-500" />
                                    )}
                                </div>
                                <h3 className="text-lg font-medium mb-2">{searchTerm ? "No Results Found" : "No History Yet"}</h3>
                                <p className="text-sm text-gray-400 max-w-xs">
                                    {searchTerm
                                        ? `No items match your search for "${searchTerm}". Try a different search term.`
                                        : "Scan QR codes to see your history here. All scanned codes will appear in this list."}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="mt-4 py-2 px-4 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Result Detail View */}
                {selectedItem && !showQRCode && (
                    <div className="bg-gray-900 rounded-lg p-6">
                        <div className="flex items-center mb-6">
                            <div className="bg-gray-800 p-3 rounded-md mr-4">{getTypeIcon(selectedItem.type)}</div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Data</h3>
                                <p className="text-sm break-all">{selectedItem.data}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatDate(selectedItem.timestamp)}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowQRCode(true)}
                            className="w-full py-2 px-4 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors mb-6"
                        >
                            Show QR Code
                        </button>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleShare}
                                className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <Share2 className="h-6 w-6 mb-2 text-yellow-500" />
                                <span className="text-sm">Share</span>
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <Copy className="h-6 w-6 mb-2 text-yellow-500" />
                                <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* QR Code View */}
                {selectedItem && showQRCode && (
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-900 p-4 mb-4 w-full">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Data</h3>
                            <p className="text-sm break-all">{selectedItem.data}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg border-4 border-yellow-600 mb-6">
                            <QRCodeGenerator data={selectedItem.data} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <button
                                onClick={handleShare}
                                className="flex flex-col items-center justify-center p-4 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                <Share2 className="h-6 w-6 mb-2" />
                                <span className="text-sm">Share</span>
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex flex-col items-center justify-center p-4 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
                            >
                                <Save className="h-6 w-6 mb-2" />
                                <span className="text-sm">Save</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
