"use client"

import { useState, useEffect, useRef } from "react"
import {
    Camera,
    CameraOff,
    X,
    User,
    AlertCircle,
    ExternalLink,
    ShoppingCart,
    FileText,
    UserCheck,
    Settings,
    CheckCircle2,
    XCircle,
    LayoutGrid,
    ChevronRight,
    ClipboardList,
    Search,
    Scan,
    History,
    Shield,
    Layers,
} from "lucide-react"
import QrScanner from "qr-scanner"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

// Define QR code types
type QRCodeType = "url" | "product" | "menu" | "employee" | "procurement" | "text"

// Define scan result type
interface ScanResult {
    type: QRCodeType
    data: string
    processed: boolean
    timestamp: number
}

// Define scanner modes
type ScannerMode = "general" | "employee" | "procurement" | "product" | "menu"

const ScanPage = () => {
    const [isScanning, setIsScanning] = useState<boolean>(false)
    const [cameraPermission, setCameraPermission] = useState<"pending" | "granted" | "denied">("pending")
    const [selectedCamera, setSelectedCamera] = useState<QrScanner.Camera | null>(null)
    const [isInitializing, setIsInitializing] = useState<boolean>(false)
    const [scanResult, setScanResult] = useState<ScanResult | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isStaff, setIsStaff] = useState<boolean>(false)
    const [scannerMode, setScannerMode] = useState<ScannerMode>("general")
    const [showModeSelection, setShowModeSelection] = useState<boolean>(false)
    const [recentScans, setRecentScans] = useState<ScanResult[]>([])

    const videoRef = useRef<HTMLVideoElement>(null)
    const scannerRef = useRef<QrScanner | null>(null)
    const scanAreaRef = useRef<HTMLDivElement>(null)

    // Initialize scanner when component mounts
    useEffect(() => {
        if (!videoRef.current) return

        // Check for camera permission
        const checkPermission = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true })
                setCameraPermission("granted")

                // Get available cameras
                const cameras = await QrScanner.listCameras()
                if (cameras.length > 0) {
                    setSelectedCamera(cameras[0])
                }
            } catch (error) {
                console.error("Camera permission denied:", error)
                setCameraPermission("denied")
            }
        }

        checkPermission()

        // Cleanup on unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop()
                scannerRef.current.destroy()
            }
        }
    }, [])

    // Start/stop scanning based on isScanning state
    useEffect(() => {
        if (!videoRef.current || !selectedCamera) return

        if (isScanning) {
            setIsInitializing(true)

            // Create new scanner instance
            scannerRef.current = new QrScanner(
                videoRef.current,
                (result) => {
                    handleSuccessfulScan(result.data)
                },
                {
                    preferredCamera: selectedCamera.id,
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                    returnDetailedScanResult: true,
                },
            )

            // Start scanning
            scannerRef.current
                .start()
                .then(() => {
                    setIsInitializing(false)
                })
                .catch((error) => {
                    console.error("Error starting scanner:", error)
                    setIsInitializing(false)
                    setIsScanning(false)
                })
        } else {
            // Stop scanning
            if (scannerRef.current) {
                scannerRef.current.stop()
            }
        }
    }, [isScanning, selectedCamera])

    // Detect QR code type
    const detectQRCodeType = (data: string): QRCodeType => {
        // Try to parse as JSON first
        try {
            const jsonData = JSON.parse(data)

            // Check for specific JSON structures
            if (jsonData.type === "product" || jsonData.productId) {
                return "product"
            }
            if (jsonData.type === "menu" || jsonData.menuId || jsonData.RestoName) {
                return "menu"
            }
            if (jsonData.type === "employee" || jsonData.employeeId) {
                return "employee"
            }
            if (jsonData.type === "procurement" || jsonData.procurementId) {
                return "procurement"
            }
            if (jsonData.url) {
                return "url"
            }
        } catch (e) {
            // Not JSON, continue with string pattern matching
        }

        // URL detection
        if (/^(https?:\/\/)/i.test(data)) {
            return "url"
        }

        // Product code detection (format: PROD-12345)
        if (/^PROD-\d+$/i.test(data)) {
            return "product"
        }

        // Menu detection (format: MENU-12345)
        if (/^MENU-\d+$/i.test(data) || data.toLowerCase().includes("menu")) {
            return "menu"
        }

        // Employee badge detection (format: EMP-12345)
        if (/^EMP-\d+$/i.test(data)) {
            return "employee"
        }

        // Procurement item detection (format: PROC-12345)
        if (/^PROC-\d+$/i.test(data)) {
            return "procurement"
        }

        // If it's just text
        return "text"
    }

    // Handle successful scan
    const handleSuccessfulScan = (decodedText: string) => {
        // Stop scanning
        if (scannerRef.current) {
            scannerRef.current.stop()
            setIsScanning(false)
        }

        // Provide haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(200)
        }

        // Detect QR code type
        const qrType = detectQRCodeType(decodedText)

        // Create scan result
        const result: ScanResult = {
            type: qrType,
            data: decodedText,
            processed: false,
            timestamp: Date.now(),
        }

        // Add to recent scans
        setRecentScans((prev) => [result, ...prev.slice(0, 9)])

        // Process based on type
        processQRCode(result)
    }

    // Process QR code based on type
    const processQRCode = (result: ScanResult) => {
        setScanResult(result)

        // If scanner mode is set, only process matching types
        if (isLoggedIn && scannerMode !== "general") {
            if (scannerMode === "employee" && result.type !== "employee") {
                setShowModal(true)
                return
            }
            if (scannerMode === "procurement" && result.type !== "procurement") {
                setShowModal(true)
                return
            }
            if (scannerMode === "product" && result.type !== "product") {
                setShowModal(true)
                return
            }
            if (scannerMode === "menu" && result.type !== "menu") {
                setShowModal(true)
                return
            }
        }

        switch (result.type) {
            case "url":
                // Auto-redirect to URL
                setShowModal(true)
                setTimeout(() => {
                    window.location.href = result.data
                }, 1500)
                break

            case "product":
                // Show product details modal
                setShowModal(true)
                break

            case "menu":
                // Redirect to menu page
                try {
                    const jsonData = JSON.parse(result.data)
                    if (jsonData.menuUrl) {
                        setShowModal(true)
                        setTimeout(() => {
                            window.location.href = jsonData.menuUrl
                        }, 1500)
                    } else {
                        // If no direct URL, show modal with menu info
                        setShowModal(true)
                    }
                } catch (e) {
                    // If not JSON, try to extract URL or show modal
                    if (result.data.startsWith("http")) {
                        setShowModal(true)
                        setTimeout(() => {
                            window.location.href = result.data
                        }, 1500)
                    } else {
                        setShowModal(true)
                    }
                }
                break

            case "employee":
                // Only process if user is logged in as staff
                if (isLoggedIn && isStaff) {
                    // Show employee check-in/out modal
                    setShowModal(true)
                } else {
                    // Show login required modal
                    setShowModal(true)
                }
                break

            case "procurement":
                // Only process if user is logged in
                if (isLoggedIn) {
                    // Redirect to procurement page or show modal
                    setShowModal(true)
                } else {
                    // Show login required modal
                    setShowModal(true)
                }
                break

            case "text":
            default:
                // Show generic info modal
                setShowModal(true)
                break
        }

        // Mark as processed
        result.processed = true
    }

    // Toggle login status (for demo purposes)
    const toggleLogin = () => {
        setIsLoggedIn(!isLoggedIn)

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
        }
    }

    // Close modal and restart scanning
    const closeModalAndRescan = () => {
        setShowModal(false)
        setScanResult(null)
        setIsScanning(true)
    }

    // Auto-start scanning when component mounts and camera permission is granted
    useEffect(() => {
        if (cameraPermission === "granted" && !isScanning && selectedCamera && !showModal && !showModeSelection) {
            setIsScanning(true)
        }
    }, [cameraPermission, selectedCamera, showModal, showModeSelection])

    // Render QR code result modal
    const renderResultModal = () => {
        if (!scanResult) return null

        let title = "Scan Result"
        let icon = <AlertCircle size={24} className="text-accent" />
        let content = <p className="text-foreground font-nunito">{scanResult.data}</p>
        let actions = (
            <button
                onClick={closeModalAndRescan}
                className="w-full mt-4 bg-primary hover:bg-darkBlue text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 font-nunito"
            >
                Scan Again
            </button>
        )

        // If scanner mode is set and type doesn't match
        if (isLoggedIn && scannerMode !== "general" && scanResult.type !== scannerMode) {
            title = "Incorrect QR Code Type"
            icon = <AlertCircle size={24} className="text-mainOrange" />
            content = (
                <div>
                    <p className="text-mainOrange font-medium font-onest mb-2">This QR code doesn't match your current mode</p>
                    <p className="text-foreground font-nunito">
                        You're in <span className="font-medium">{scannerMode.charAt(0).toUpperCase() + scannerMode.slice(1)}</span>{" "}
                        mode, but scanned a{" "}
                        <span className="font-medium">{scanResult.type.charAt(0).toUpperCase() + scanResult.type.slice(1)}</span> QR
                        code.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                        <button
                            onClick={() => {
                                setShowModal(false)
                                setShowModeSelection(true)
                            }}
                            className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Settings size={16} />
                            Change Mode
                        </button>
                        <button
                            onClick={closeModalAndRescan}
                            className="w-full bg-primary hover:bg-darkBlue text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white dark:bg-primary rounded-xl w-full max-w-md p-6 shadow-lg border border-border"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                {icon}
                                <h3 className="text-xl font-bold ml-2 font-onest">{title}</h3>
                            </div>
                            <button
                                onClick={closeModalAndRescan}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-4">{content}</div>
                    </motion.div>
                </motion.div>
            )
        }

        switch (scanResult.type) {
            case "url":
                title = "Website Detected"
                icon = <ExternalLink size={24} className="text-accent" />
                content = (
                    <div>
                        <p className="text-foreground font-nunito mb-2">Redirecting to website:</p>
                        <p className="text-accent font-medium truncate">{scanResult.data}</p>
                        <div className="mt-4 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mr-2"></div>
                            <span className="text-sm text-muted-foreground">Redirecting...</span>
                        </div>
                    </div>
                )
                break

            case "product":
                title = "Product Detected"
                icon = <ShoppingCart size={24} className="text-mainOrange" />
                try {
                    const productData = JSON.parse(scanResult.data)
                    content = (
                        <div>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                                    <ShoppingCart size={24} className="text-mainOrange" />
                                </div>
                                <div>
                                    <p className="font-medium text-lg font-onest">{productData.name || "Product"}</p>
                                    <p className="text-foreground font-nunito">{productData.description || "No description available"}</p>
                                    <p className="font-bold mt-1 text-accent">${productData.price || "N/A"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="bg-background p-3 rounded-md">
                                    <p className="text-xs text-muted-foreground">SKU</p>
                                    <p className="font-medium">{productData.sku || "N/A"}</p>
                                </div>
                                <div className="bg-background p-3 rounded-md">
                                    <p className="text-xs text-muted-foreground">Stock</p>
                                    <p className="font-medium">{productData.stock || "N/A"}</p>
                                </div>
                                <div className="bg-background p-3 rounded-md">
                                    <p className="text-xs text-muted-foreground">Category</p>
                                    <p className="font-medium">{productData.category || "N/A"}</p>
                                </div>
                                <div className="bg-background p-3 rounded-md">
                                    <p className="text-xs text-muted-foreground">Supplier</p>
                                    <p className="font-medium">{productData.supplier || "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                    <ShoppingCart size={16} />
                                    Add to Cart
                                </button>
                                <button className="flex-1 bg-background hover:bg-muted text-foreground font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                    <Search size={16} />
                                    View Details
                                </button>
                            </div>
                        </div>
                    )
                } catch (e) {
                    content = (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                                    <ShoppingCart size={24} className="text-mainOrange" />
                                </div>
                                <div>
                                    <p className="font-medium text-lg font-onest">Product</p>
                                    <p className="text-sm text-muted-foreground">Code: {scanResult.data}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-background rounded-lg mb-4">
                                <p className="text-sm text-muted-foreground">Product details will be displayed here</p>
                            </div>

                            <button className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                <Search size={16} />
                                Look Up Product
                            </button>
                        </div>
                    )
                }
                break

            case "menu":
                title = "Menu Detected"
                icon = <FileText size={24} className="text-mainOrange" />
                try {
                    const menuData = JSON.parse(scanResult.data)
                    content = (
                        <div>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                                    <FileText size={24} className="text-mainOrange" />
                                </div>
                                <div>
                                    <p className="font-medium text-lg font-onest">
                                        {menuData.RestoName || menuData.name || "Restaurant Menu"}
                                    </p>
                                    <p className="text-foreground font-nunito">{menuData.description || "View the full menu"}</p>
                                    {menuData.address && <p className="text-sm text-muted-foreground mt-1">{menuData.address}</p>}
                                </div>
                            </div>

                            {menuData.categories && (
                                <div className="mb-4">
                                    <p className="font-medium mb-2 font-onest">Categories:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {menuData.categories.map((category: string, index: number) => (
                                            <span key={index} className="px-3 py-1 bg-background rounded-full text-sm text-foreground">
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {menuData.menuUrl && (
                                <div className="mt-4 flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mr-2"></div>
                                    <span className="text-sm text-muted-foreground">Redirecting to menu...</span>
                                </div>
                            )}

                            {!menuData.menuUrl && (
                                <button className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                    <FileText size={16} />
                                    View Full Menu
                                </button>
                            )}
                        </div>
                    )
                } catch (e) {
                    content = (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                                    <FileText size={24} className="text-mainOrange" />
                                </div>
                                <div>
                                    <p className="font-medium text-lg font-onest">Restaurant Menu</p>
                                    <p className="text-sm text-muted-foreground">Code: {scanResult.data}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-background rounded-lg mb-4">
                                <p className="text-sm text-muted-foreground">Menu details will be displayed here</p>
                            </div>

                            <button className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                <Search size={16} />
                                Look Up Menu
                            </button>
                        </div>
                    )
                }
                break

            case "employee":
                title = "Employee Badge"
                icon = <UserCheck size={24} className="text-accent" />

                if (!isLoggedIn) {
                    content = (
                        <div>
                            <p className="text-destructive font-medium font-onest">Login Required</p>
                            <p className="text-foreground font-nunito mt-2">
                                You need to be logged in as staff to process employee badges.
                            </p>
                        </div>
                    )
                    actions = (
                        <div className="flex flex-col gap-2 mt-4">
                            <button
                                onClick={toggleLogin}
                                className="w-full bg-primary hover:bg-darkBlue text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 font-nunito"
                            >
                                Log In
                            </button>
                            <button
                                onClick={closeModalAndRescan}
                                className="w-full bg-muted hover:bg-muted/80 text-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 font-nunito"
                            >
                                Cancel
                            </button>
                        </div>
                    )
                } else if (!isStaff) {
                    content = (
                        <div>
                            <p className="text-mainOrange font-medium font-onest">Staff Access Required</p>
                            <p className="text-foreground font-nunito mt-2">You need staff privileges to process employee badges.</p>
                        </div>
                    )
                    actions = (
                        <div className="flex flex-col gap-2 mt-4">
                            <button
                                onClick={toggleStaffStatus}
                                className="w-full bg-primary hover:bg-darkBlue text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 font-nunito"
                            >
                                Switch to Staff Mode
                            </button>
                            <button
                                onClick={closeModalAndRescan}
                                className="w-full bg-muted hover:bg-muted/80 text-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 font-nunito"
                            >
                                Cancel
                            </button>
                        </div>
                    )
                } else {
                    try {
                        const employeeData = JSON.parse(scanResult.data)
                        content = (
                            <div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                                        <User size={28} className="text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg font-onest">{employeeData.name || "Employee"}</p>
                                        <p className="text-sm text-muted-foreground">
                                            ID: {employeeData.id || employeeData.employeeId || "Unknown"}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                            <span className="text-sm text-green-600">Active</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-background p-3 rounded-md">
                                        <p className="text-xs text-muted-foreground">Department</p>
                                        <p className="font-medium">{employeeData.department || "N/A"}</p>
                                    </div>
                                    <div className="bg-background p-3 rounded-md">
                                        <p className="text-xs text-muted-foreground">Position</p>
                                        <p className="font-medium">{employeeData.position || "N/A"}</p>
                                    </div>
                                    <div className="bg-background p-3 rounded-md">
                                        <p className="text-xs text-muted-foreground">Last Check-in</p>
                                        <p className="font-medium">{employeeData.lastCheckIn || "Never"}</p>
                                    </div>
                                    <div className="bg-background p-3 rounded-md">
                                        <p className="text-xs text-muted-foreground">Status</p>
                                        <p className="font-medium">{employeeData.status || "Unknown"}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="font-medium font-onest mb-2">Attendance:</p>
                                    <div className="flex gap-2 mt-2">
                                        <button className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                            <CheckCircle2 size={18} />
                                            Check In
                                        </button>
                                        <button className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                            <XCircle size={18} />
                                            Check Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    } catch (e) {
                        content = (
                            <div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                                        <User size={28} className="text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg font-onest">Employee</p>
                                        <p className="text-sm text-muted-foreground">ID: {scanResult.data}</p>
                                        <div className="flex items-center mt-1">
                                            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                                            <span className="text-sm text-yellow-600">Pending Verification</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-background rounded-lg mb-4">
                                    <p className="text-sm text-muted-foreground">Employee details will be verified</p>
                                </div>

                                <div className="mt-4">
                                    <p className="font-medium font-onest mb-2">Attendance:</p>
                                    <div className="flex gap-2 mt-2">
                                        <button className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                            <CheckCircle2 size={18} />
                                            Check In
                                        </button>
                                        <button className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                            <XCircle size={18} />
                                            Check Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    actions = (
                        <button
                            onClick={closeModalAndRescan}
                            className="w-full mt-4 bg-muted hover:bg-muted/80 text-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 font-nunito"
                        >
                            Close
                        </button>
                    )
                }
                break

            case "procurement":
                title = "Procurement Item"
                icon = <ShoppingCart size={24} className="text-accent" />

                if (!isLoggedIn) {
                    content = (
                        <div>
                            <p className="text-destructive font-medium font-onest">Login Required</p>
                            <p className="text-foreground font-nunito mt-2">You need to be logged in to process procurement items.</p>
                        </div>
                    )
                    actions = (
                        <div className="flex flex-col gap-2 mt-4">
                            <button
                                onClick={toggleLogin}
                                className="w-full bg-primary hover:bg-darkBlue text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 font-nunito"
                            >
                                Log In
                            </button>
                            <button
                                onClick={closeModalAndRescan}
                                className="w-full bg-muted hover:bg-muted/80 text-foreground font-medium py-3 px-4 rounded-lg transition-all duration-200 font-nunito"
                            >
                                Cancel
                            </button>
                        </div>
                    )
                } else {
                    try {
                        const procurementData = JSON.parse(scanResult.data)
                        content = (
                            <div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                                        <ShoppingCart size={24} className="text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg font-onest">{procurementData.name || "Procurement Item"}</p>
                                        <p className="text-foreground font-nunito">
                                            {procurementData.description || "No description available"}
                                        </p>
                                        <p className="font-bold mt-1 text-accent">${procurementData.price || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 my-4">
                                    <div className="bg-background p-3 rounded-md">
                                        <p className="text-xs text-muted-foreground">Item Code</p>
                                        <p className="font-medium">{procurementData.code || "N/A"}</p>
                                    </div>
                                    <div className="bg-background p-3 rounded-md">
                                        <p className="text-xs text-muted-foreground">Unit Price</p>
                                        <p className="font-medium">${procurementData.price || "N/A"}</p>
                                    </div>
                                    <div className="bg-background p-3 rounded-md">
                                        <p className="text-xs text-muted-foreground">Supplier</p>
                                        <p className="font-medium">{procurementData.supplier || "N/A"}</p>
                                    </div>
                                    <div className="bg-background p-3 rounded-md">
                                        <p className="text-xs text-muted-foreground">Available</p>
                                        <p className="font-medium">{procurementData.available ? "Yes" : "No"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-4 mb-2">
                                    <p className="font-medium">Quantity:</p>
                                    <div className="flex items-center">
                                        <button className="w-8 h-8 flex items-center justify-center bg-background rounded-l-md border border-border">
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="w-12 h-8 text-center border-y border-border"
                                            defaultValue={1}
                                            min={1}
                                        />
                                        <button className="w-8 h-8 flex items-center justify-center bg-background rounded-r-md border border-border">
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button className="w-full mt-4 bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                    <ShoppingCart size={18} />
                                    Add to Procurement
                                </button>
                            </div>
                        )
                    } catch (e) {
                        content = (
                            <div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                                        <ShoppingCart size={24} className="text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg font-onest">Procurement Item</p>
                                        <p className="text-sm text-muted-foreground">Code: {scanResult.data}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-background rounded-lg mb-4">
                                    <p className="text-sm text-muted-foreground">Item details will be displayed here</p>
                                </div>

                                <div className="flex items-center gap-3 mt-4 mb-2">
                                    <p className="font-medium">Quantity:</p>
                                    <div className="flex items-center">
                                        <button className="w-8 h-8 flex items-center justify-center bg-background rounded-l-md border border-border">
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="w-12 h-8 text-center border-y border-border"
                                            defaultValue={1}
                                            min={1}
                                        />
                                        <button className="w-8 h-8 flex items-center justify-center bg-background rounded-r-md border border-border">
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button className="w-full mt-4 bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                                    <ShoppingCart size={18} />
                                    Add to Procurement
                                </button>
                            </div>
                        )
                    }
                }
                break
        }

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white dark:bg-primary rounded-xl w-full max-w-md p-6 shadow-lg border border-border"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            {icon}
                            <h3 className="text-xl font-bold ml-2 font-onest">{title}</h3>
                        </div>
                        <button
                            onClick={closeModalAndRescan}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="mb-4">{content}</div>
                    {actions}
                </motion.div>
            </motion.div>
        )
    }



    // Render recent scans
    const renderRecentScans = () => {
        if (recentScans.length === 0) return null

        return (
            <div className="mt-8 w-full max-w-md">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold font-onest text-primary">Recent Scans</h2>
                    <button className="text-sm text-accent">View All</button>
                </div>

                <div className="bg-background rounded-xl border border-border overflow-hidden">
                    {recentScans.slice(0, 3).map((scan, index) => (
                        <div
                            key={index}
                            className={`p-4 flex items-center gap-3 ${index < recentScans.slice(0, 3).length - 1 ? "border-b border-border" : ""
                                }`}
                        >
                            {scan.type === "url" && (
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <ExternalLink size={20} />
                                </div>
                            )}
                            {scan.type === "product" && (
                                <div className="w-10 h-10 rounded-full bg-mainOrange/10 flex items-center justify-center text-mainOrange">
                                    <ShoppingCart size={20} />
                                </div>
                            )}
                            {scan.type === "menu" && (
                                <div className="w-10 h-10 rounded-full bg-mainOrange/10 flex items-center justify-center text-mainOrange">
                                    <FileText size={20} />
                                </div>
                            )}
                            {scan.type === "employee" && (
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <UserCheck size={20} />
                                </div>
                            )}
                            {scan.type === "procurement" && (
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <ClipboardList size={20} />
                                </div>
                            )}
                            {scan.type === "text" && (
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <AlertCircle size={20} />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                    {scan.type.charAt(0).toUpperCase() + scan.type.slice(1)}: {scan.data.substring(0, 30)}
                                    {scan.data.length > 30 ? "..." : ""}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(scan.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>

                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-6 font-nunito">

            {/* Mode indicator */}
            {isLoggedIn && (
                <div className="mb-6 p-4 bg-background rounded-xl border border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="font-medium font-onest">
                                    Welcome, <span className="text-accent">User</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Mode:{" "}
                                    <span className="font-medium">{scannerMode.charAt(0).toUpperCase() + scannerMode.slice(1)}</span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModeSelection(true)}
                            className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent"
                        >
                            Change Mode
                        </button>
                    </div>
                </div>
            )}

            {/* Main scanner area */}
            <div className="w-full flex flex-col items-center">
                <div
                    ref={scanAreaRef}
                    className="relative w-full max-w-md aspect-square overflow-hidden rounded-xl bg-background border border-border shadow-sm transition-colors duration-200"
                >
                    {/* Video element for QR scanning */}
                    <video ref={videoRef} className="h-full w-full object-cover" />

                    {cameraPermission === "pending" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                            <span className="ml-2 text-lg font-onest">Initializing camera...</span>
                        </div>
                    )}

                    {cameraPermission === "denied" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background p-4 text-center">
                            <CameraOff size={48} className="text-destructive mb-4" />
                            <h3 className="text-xl font-bold mb-2 font-onest">Camera Access Required</h3>
                            <p className="mb-4">Please allow camera access to scan QR codes.</p>
                            <button
                                onClick={() => setCameraPermission("pending")}
                                className="bg-primary hover:bg-darkBlue text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {isScanning && (
                        <>
                            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-secondary rounded-lg pointer-events-none z-20 w-[70%] h-[70%] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-secondary"></div>
                                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-secondary"></div>
                                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-secondary"></div>
                                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-secondary"></div>
                            </div>
                            <div className="absolute left-0 right-0 h-0.5 bg-secondary z-30 animate-scanline"></div>
                        </>
                    )}

                    {isInitializing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30 rounded-xl">
                            <div className="bg-gray-600 p-4 rounded-lg flex items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mr-2"></div>
                                <span className="font-onest">Starting camera...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scanner controls */}
                <div className="flex items-center justify-between w-full max-w-md mt-4 gap-2">
                    <button
                        onClick={() => setIsScanning(!isScanning)}
                        className={`flex-1 h-14 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-200 ${isScanning
                            ? "bg-destructive hover:bg-destructive/90 text-white"
                            : "bg-gray-900 hover:bg-darkBlue text-white"
                            }`}
                        disabled={cameraPermission !== "granted" || isInitializing}
                    >
                        {isScanning ? (
                            <>
                                <CameraOff size={20} /> Stop Scanning
                            </>
                        ) : (
                            <>
                                <Camera size={20} /> Start Scanning
                            </>
                        )}
                    </button>

                </div>

                <div className="text-center text-sm text-muted-foreground mt-4">
                    <p>Point your camera at a QR code to scan</p>
                    <div className="mt-6 w-full max-w-md">
                        <Link
                            to="/batch/scanner"
                            className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium transition-colors duration-200"
                        >
                            <Layers size={20} />
                            Switch to Batch Scanning Mode
                        </Link>
                    </div>
                </div>

                {/* Recent scans section */}
                {renderRecentScans()}

                {/* Feature cards */}
                <div className="mt-8 w-full max-w-md">
                    <h2 className="text-lg font-bold mb-3 font-onest text-primary">Available Features</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background rounded-xl p-4 border border-border">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
                                <Scan size={20} />
                            </div>
                            <h3 className="font-medium font-onest">Smart Detection</h3>
                            <p className="text-sm text-muted-foreground mt-1">Auto-detects QR code types</p>
                        </div>

                        <div className="bg-background rounded-xl p-4 border border-border">
                            <div className="w-10 h-10 rounded-full bg-mainOrange/10 flex items-center justify-center text-mainOrange mb-3">
                                <LayoutGrid size={20} />
                            </div>
                            <h3 className="font-medium font-onest">Multiple Modes</h3>
                            <p className="text-sm text-muted-foreground mt-1">Specialized scanning modes</p>
                        </div>

                        <div className="bg-background rounded-xl p-4 border border-border">
                            <div className="w-10 h-10 rounded-full bg-mainOrange/10 flex items-center justify-center text-mainOrange mb-3">
                                <History size={20} />
                            </div>
                            <h3 className="font-medium font-onest">Scan History</h3>
                            <p className="text-sm text-muted-foreground mt-1">Track all previous scans</p>
                        </div>

                        <div className="bg-background rounded-xl p-4 border border-border">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
                                <Shield size={20} />
                            </div>
                            <h3 className="font-medium font-onest">Secure Access</h3>
                            <p className="text-sm text-muted-foreground mt-1">Role-based permissions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            {showModal && renderResultModal()}
        </div>
    )
}

export default ScanPage
