"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
    Camera,
    CameraOff,
    ZoomIn,
    ZoomOut,
    RefreshCw,
    Zap,
    Trash2,
    Download,
    X,
    Check,
    ChevronLeft,
    Layers,
    Link,
    ShoppingCart,
    User,
    FileText,
    AlertCircle,
    Save,
} from "lucide-react"
import QrScanner from "qr-scanner"

// Define QR code types
type QRCodeType = "url" | "product" | "menu" | "employee" | "procurement" | "text" | "unknown"

// Define scan result type
interface ScanResult {
    id: string
    type: QRCodeType
    data: string
    timestamp: number
}

export default function BatchScanPage() {
    const navigate = useNavigate()
    const [isScanning, setIsScanning] = useState(false)
    const [cameraPermission, setCameraPermission] = useState<"pending" | "granted" | "denied">("pending")
    const [selectedCamera, setSelectedCamera] = useState<QrScanner.Camera | null>(null)
    const [availableCameras, setAvailableCameras] = useState<QrScanner.Camera[]>([])
    const [zoomLevel, setZoomLevel] = useState(1)
    const [isInitializing, setIsInitializing] = useState(false)
    const [batchScans, setBatchScans] = useState<ScanResult[]>([])
    const [flashEnabled, setFlashEnabled] = useState(false)
    const [hasFlash, setHasFlash] = useState(false)
    const [batchId, setBatchId] = useState(`batch-${Date.now()}`)
    const [lastScanned, setLastScanned] = useState<ScanResult | null>(null)
    const [showCameraSelector, setShowCameraSelector] = useState(false)
    const [showConfirmClear, setShowConfirmClear] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const videoRef = useRef<any>(null)
    const scannerRef = useRef<QrScanner | null>(null)
    const scanAreaRef = useRef<HTMLDivElement>(null)

    // Initialize scanner when component mounts
    useEffect(() => {
        let mounted = true

        // Check for camera permission
        const checkPermission = async () => {
            try {
                // First check if permissions are already granted
                const devices = await navigator.mediaDevices.enumerateDevices()
                const hasCamera = devices.some((device) => device.kind === "videoinput")

                if (!hasCamera) {
                    console.error("No camera detected on this device")
                    setCameraPermission("denied")
                    return
                }

                // Request camera access
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                })

                // If we got here, permission is granted
                if (mounted) {
                    setCameraPermission("granted")

                    // Clean up this stream since we'll create a new one when starting the scanner
                    stream.getTracks().forEach((track) => track.stop())

                    // Get available cameras
                    try {
                        const cameras = await QrScanner.listCameras(true)
                        if (mounted) {
                            setAvailableCameras(cameras)

                            if (cameras.length > 0) {
                                // Prefer back camera if available
                                const backCamera = cameras.find(
                                    (camera) =>
                                        camera.label.toLowerCase().includes("back") || camera.label.toLowerCase().includes("rear"),
                                )
                                setSelectedCamera(backCamera || cameras[0])
                            }
                        }
                    } catch (err) {
                        console.error("Error listing cameras:", err)
                        // Even if we can't list cameras, we can still try to use the default one
                        if (mounted) {
                            setSelectedCamera({ id: "default", label: "Default Camera" })
                        }
                    }
                }
            } catch (error) {
                console.error("Camera permission denied or error:", error)
                if (mounted) {
                    setCameraPermission("denied")
                }
            }
        }

        checkPermission()

        // Cleanup on unmount
        return () => {
            mounted = false
            if (scannerRef.current) {
                try {
                    scannerRef.current.stop()
                    scannerRef.current.destroy()
                    scannerRef.current = null
                } catch (e) {
                    console.error("Error cleaning up scanner:", e)
                }
            }
        }
    }, [])

    // Start/stop scanning based on isScanning state
    useEffect(() => {
        if (!videoRef.current) return

        const startScanner = async () => {
            if (!isScanning) return

            setIsInitializing(true)

            try {
                // Destroy existing scanner if it exists
                if (scannerRef.current) {
                    scannerRef.current.stop()
                    scannerRef.current.destroy()
                    scannerRef.current = null
                }

                // Create scanner with more specific options
                const scanner = new QrScanner(
                    videoRef.current,
                    (result: any) => {
                        handleSuccessfulScan(result.data)
                    },
                    {
                        preferredCamera: selectedCamera?.id || "environment",
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        returnDetailedScanResult: true,
                        maxScansPerSecond: 3, // Limit scan rate to reduce CPU usage
                        calculateScanRegion: (video) => {
                            // Use 70% of the center of the video for scanning
                            const smallerDimension = Math.min(video.videoWidth, video.videoHeight)
                            const scanRegionSize = Math.round(smallerDimension * 0.7)

                            return {
                                x: Math.round((video.videoWidth - scanRegionSize) / 2),
                                y: Math.round((video.videoHeight - scanRegionSize) / 2),
                                width: scanRegionSize,
                                height: scanRegionSize,
                            }
                        },
                    },
                )

                scannerRef.current = scanner

                // Start scanning
                await scanner.start()

                // Check if flash is supported
                const hasFlash = await scanner.hasFlash().catch(() => false)
                setHasFlash(hasFlash)

                setIsInitializing(false)
            } catch (error: any) {
                console.error("Error starting scanner:", error)
                setIsInitializing(false)
                setIsScanning(false)

                // If we failed to start the scanner, try to reset camera permission
                if (error.toString().includes("permission")) {
                    setCameraPermission("denied")
                }
            }
        }

        const stopScanner = () => {
            if (scannerRef.current) {
                try {
                    scannerRef.current.stop()
                } catch (error) {
                    console.error("Error stopping scanner:", error)
                }
            }
        }

        if (isScanning) {
            startScanner()
        } else {
            stopScanner()
        }

        return () => {
            stopScanner()
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
        if (/^PROD-\d+$/i.test(data) || /^PRD-\d+$/i.test(data)) {
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
        // Check if this code has already been scanned in this batch
        const isDuplicate = batchScans.some((scan) => scan.data === decodedText)
        if (isDuplicate) {
            // Provide feedback for duplicate scan
            if (navigator.vibrate) {
                // Double vibration for duplicate
                navigator.vibrate([100, 100, 100])
            }
            return
        }

        // Provide haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(200)
        }

        // Detect QR code type
        const qrType = detectQRCodeType(decodedText)

        // Create scan result
        const result: ScanResult = {
            id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            type: qrType,
            data: decodedText,
            timestamp: Date.now(),
        }

        // Add to batch scans
        setBatchScans((prevScans) => [...prevScans, result])
        setLastScanned(result)
    }

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 3))

        // Apply zoom if supported
        if (scannerRef.current) {
            try {
                const videoElem = videoRef.current
                if (videoElem) {
                    const track = videoElem.srcObject instanceof MediaStream ? videoElem.srcObject.getVideoTracks()[0] : null

                    if (track) {
                        const capabilities = track.getCapabilities()
                        if (capabilities.zoom) {
                            const constraints = { advanced: [{ zoom: Math.min(capabilities.zoom.max || 3, zoomLevel + 0.2) }] }
                            track.applyConstraints(constraints)
                        }
                    }
                }
            } catch (error) {
                console.debug("Zoom not supported:", error)
            }
        }
    }

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 1))

        // Apply zoom if supported
        if (scannerRef.current) {
            try {
                const videoElem = videoRef.current
                if (videoElem) {
                    const track = videoElem.srcObject instanceof MediaStream ? videoElem.srcObject.getVideoTracks()[0] : null

                    if (track) {
                        const capabilities = track.getCapabilities()
                        if (capabilities.zoom) {
                            const constraints = { advanced: [{ zoom: Math.max(capabilities.zoom.min || 1, zoomLevel - 0.2) }] }
                            track.applyConstraints(constraints)
                        }
                    }
                }
            } catch (error) {
                console.debug("Zoom not supported:", error)
            }
        }
    }

    const toggleFlash = async () => {
        if (!hasFlash || !scannerRef.current) return

        try {
            const newFlashState = !flashEnabled
            await scannerRef.current.toggleFlash()
            setFlashEnabled(newFlashState)
        } catch (error) {
            console.error("Error toggling flash:", error)
        }
    }

    const clearBatch = () => {
        setBatchScans([])
        setBatchId(`batch-${Date.now()}`)
        setShowConfirmClear(false)
    }

    const removeScan = (scanId: string) => {
        setBatchScans((prevScans) => prevScans.filter((scan) => scan.id !== scanId))
    }

    const downloadBatch = () => {
        const filename = `${batchId}.txt`
        const element = document.createElement("a")
        const text = batchScans.map((scan) => `${scan.type}: ${scan.data}`).join("\n")
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
        element.setAttribute("download", filename)

        element.style.display = "none"
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
    }

    const saveCurrentBatch = async () => {
        if (batchScans.length === 0) {
            alert("No scans to save.")
            return
        }

        setIsSaving(true)

        // Simulate saving to database
        setTimeout(() => {
            // Save to localStorage for demo purposes
            try {
                const existingBatches = JSON.parse(localStorage.getItem("batchScans") || "[]")
                const newBatch = {
                    id: batchId,
                    scans: batchScans,
                    timestamp: Date.now(),
                }
                existingBatches.push(newBatch)
                localStorage.setItem("batchScans", JSON.stringify(existingBatches))

                // Reset after saving
                setBatchScans([])
                setBatchId(`batch-${Date.now()}`)
                setIsSaving(false)

                // Show success feedback
                alert("Batch saved successfully!")
            } catch (error) {
                console.error("Error saving batch:", error)
                setIsSaving(false)
                alert("Failed to save batch. Please try again.")
            }
        }, 1000)
    }

    const switchCamera = (camera: QrScanner.Camera) => {
        if (scannerRef.current) {
            scannerRef.current.stop()
            setSelectedCamera(camera)
            setShowCameraSelector(false)

            // Restart scanner with new camera
            setTimeout(() => {
                if (isScanning) {
                    setIsScanning(true)
                }
            }, 300)
        }
    }

    const getTypeIcon = (type: QRCodeType) => {
        switch (type) {
            case "url":
                return <Link className="h-5 w-5 text-yellow-500" />
            case "product":
                return <ShoppingCart className="h-5 w-5 text-yellow-500" />
            case "employee":
                return <User className="h-5 w-5 text-yellow-500" />
            case "menu":
                return <FileText className="h-5 w-5 text-yellow-500" />
            default:
                return <AlertCircle className="h-5 w-5 text-yellow-500" />
        }
    }

    // const resetCameraPermission = () => {
    //     // Stop any active scanner
    //     if (scannerRef.current) {
    //         try {
    //             scannerRef.current.stop()
    //             scannerRef.current.destroy()
    //             scannerRef.current = null
    //         } catch (e) {
    //             console.error("Error cleaning up scanner:", e)
    //         }
    //     }

    //     // Reset state
    //     setIsScanning(false)
    //     setCameraPermission("pending")

    //     // Force browser to show permission dialog again
    //     navigator.mediaDevices
    //         .getUserMedia({
    //             video: { facingMode: "environment" },
    //         })
    //         .then((stream) => {
    //             // Stop all tracks immediately
    //             stream.getTracks().forEach((track) => track.stop())

    //             // Check for cameras again
    //             QrScanner.listCameras(true)
    //                 .then((cameras) => {
    //                     setAvailableCameras(cameras)
    //                     if (cameras.length > 0) {
    //                         setSelectedCamera(cameras[0])
    //                     }
    //                     setCameraPermission("granted")
    //                 })
    //                 .catch((err) => {
    //                     console.error("Error listing cameras:", err)
    //                     setCameraPermission("granted") // Still try with default camera
    //                     setSelectedCamera({ id: "default", label: "Default Camera" })
    //                 })
    //         })
    //         .catch((err) => {
    //             console.error("Failed to request camera permission:", err)
    //             setCameraPermission("denied")
    //         })
    // }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-800" aria-label="Back">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl font-bold">Batch Scan</h1>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-4">
                {cameraPermission === "granted" ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setIsScanning(!isScanning)}
                                    className={`p-2 rounded-full ${isScanning ? "bg-red-500 text-white" : "bg-yellow-600 text-black"
                                        } hover:bg-yellow-700 focus:outline-none`}
                                    disabled={isInitializing}
                                >
                                    {isScanning ? <CameraOff size={20} /> : <Camera size={20} />}
                                </button>
                                <span className="ml-2">{isScanning ? "Stop Scanning" : "Start Scanning"}</span>
                            </div>

                            <div className="flex items-center">
                                <button
                                    onClick={handleZoomIn}
                                    className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
                                >
                                    <ZoomIn size={20} />
                                </button>
                                <button
                                    onClick={handleZoomOut}
                                    className="bg-gray-800 text-white p-2 rounded-full ml-2 hover:bg-gray-700 focus:outline-none"
                                >
                                    <ZoomOut size={20} />
                                </button>
                                {hasFlash && (
                                    <button
                                        onClick={toggleFlash}
                                        className={`p-2 rounded-full ml-2 ${flashEnabled ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"
                                            } hover:bg-yellow-700 focus:outline-none`}
                                    >
                                        <Zap size={20} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowCameraSelector(true)}
                                    className="bg-gray-800 text-white p-2 rounded-full ml-2 hover:bg-gray-700 focus:outline-none"
                                >
                                    <RefreshCw size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                            <div ref={scanAreaRef} className="w-full h-full">
                                <video ref={videoRef} className="h-full w-full object-cover" />
                            </div>

                            {isInitializing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30 rounded-lg">
                                    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mr-2"></div>
                                        <span>Starting camera...</span>
                                    </div>
                                </div>
                            )}

                            {isScanning && (
                                <>
                                    <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-yellow-500 rounded-lg pointer-events-none z-20 w-[70%] h-[70%] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                                        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-yellow-500"></div>
                                        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-yellow-500"></div>
                                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-yellow-500"></div>
                                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-yellow-500"></div>
                                    </div>
                                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-yellow-500 z-30 animate-pulse"></div>
                                </>
                            )}
                        </div>

                        {/* Batch Info */}
                        <div className="flex justify-between items-center mb-4 bg-gray-900 p-3 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-400">Batch ID: {batchId}</p>
                                <p className="text-lg font-semibold">{batchScans.length} items scanned</p>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => setShowConfirmClear(true)}
                                    className="p-2 text-gray-400 hover:text-red-500"
                                    disabled={batchScans.length === 0}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Last Scanned Item */}
                        {lastScanned && (
                            <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-lg mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-gray-800 p-2 rounded-md mr-3">{getTypeIcon(lastScanned.type)}</div>
                                        <div>
                                            <p className="text-sm font-medium">Last Scanned:</p>
                                            <p className="text-sm text-gray-400">{lastScanned.data}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-600/20 text-yellow-500">
                                            {lastScanned.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Scanned Items List */}
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold mb-2">Scanned Items</h2>
                            {batchScans.length === 0 ? (
                                <div className="p-8 bg-gray-900 rounded-lg border border-gray-800 text-center">
                                    <Layers className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                    <p className="text-gray-400">No items scanned yet.</p>
                                    <p className="text-sm text-gray-500 mt-1">Scan QR codes to add them to this batch.</p>
                                </div>
                            ) : (
                                <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                                    {batchScans.map((scan, index) => (
                                        <div
                                            key={scan.id}
                                            className={`flex items-center justify-between p-3 ${index < batchScans.length - 1 ? "border-b border-gray-800" : ""
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className="bg-gray-800 p-2 rounded-md mr-3">{getTypeIcon(scan.type)}</div>
                                                <div className="max-w-[200px] sm:max-w-[300px]">
                                                    <p className="text-sm font-medium truncate">{scan.data}</p>
                                                    <div className="flex items-center">
                                                        <span className="text-xs text-gray-500 mr-2">
                                                            {new Date(scan.timestamp).toLocaleTimeString()}
                                                        </span>
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                                                            {scan.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeScan(scan.id)}
                                                className="p-2 text-gray-400 hover:text-red-500"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={() => setShowConfirmClear(true)}
                                className="bg-gray-800 text-white mr-2 py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none flex items-center"
                                disabled={batchScans.length === 0}
                            >
                                <X size={18} className="mr-2" />
                                Clear
                            </button>
                            <div className="flex space-x-2">
                                <button
                                    onClick={downloadBatch}
                                    className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none flex items-center"
                                    disabled={batchScans.length === 0}
                                >
                                    <Download size={18} className="mr-2" />
                                    Download
                                </button>
                                <button
                                    onClick={saveCurrentBatch}
                                    className="bg-yellow-600 text-black py-2 px-4 rounded-lg hover:bg-yellow-700 focus:outline-none flex items-center"
                                    disabled={batchScans.length === 0 || isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} className="mr-2" />
                                            Save
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                ) : cameraPermission === "denied" ? (
                    <div className="p-8 bg-gray-900 rounded-lg border border-gray-800 text-center">
                        <CameraOff className="h-12 w-12 mx-auto mb-3 text-red-500" />
                        <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
                        <p className="text-gray-400 mb-4">
                            Please enable camera access in your browser settings to use the batch scanner.
                        </p>
                        <div className="text-sm text-gray-500 mb-4">
                            <p>Common solutions:</p>
                            <ul className="list-disc list-inside mt-2 text-left">
                                <li>Check that your device has a camera</li>
                                <li>Make sure no other app is using your camera</li>
                                <li>Look for the camera permission icon in your browser's address bar</li>
                                <li>Try using a different browser</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => {
                                // Reset state
                                setCameraPermission("pending")
                                setIsScanning(false)

                                // Force browser to show permission dialog again by requesting and immediately stopping
                                navigator.mediaDevices
                                    .getUserMedia({ video: true })
                                    .then((stream) => {
                                        // Stop all tracks immediately
                                        stream.getTracks().forEach((track) => track.stop())
                                    })
                                    .catch((err) => {
                                        console.error("Failed to request camera permission:", err)
                                        setCameraPermission("denied")
                                    })
                            }}
                            className="bg-yellow-600 text-black py-2 px-6 rounded-lg hover:bg-yellow-700 focus:outline-none"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="p-8 bg-gray-900 rounded-lg border border-gray-800 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-3"></div>
                        <p className="text-gray-400">Requesting camera permission...</p>
                    </div>
                )}
            </main>

            {/* Camera Selector Modal */}
            {showCameraSelector && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-lg max-w-md w-full border border-gray-800">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-lg font-medium">Select Camera</h2>
                            <button onClick={() => setShowCameraSelector(false)} className="p-2 rounded-full hover:bg-gray-800">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4">
                            {availableCameras.length === 0 ? (
                                <p className="text-gray-400 text-center py-4">No cameras found</p>
                            ) : (
                                <div className="space-y-2">
                                    {availableCameras.map((camera) => (
                                        <button
                                            key={camera.id}
                                            onClick={() => switchCamera(camera)}
                                            className={`w-full text-left p-3 rounded-lg flex items-center ${selectedCamera?.id === camera.id ? "bg-yellow-600 text-black" : "bg-gray-800 hover:bg-gray-700"
                                                }`}
                                        >
                                            <Camera className="h-5 w-5 mr-3" />
                                            <span className="flex-1">{camera.label || `Camera ${camera.id}`}</span>
                                            {selectedCamera?.id === camera.id && <Check className="h-5 w-5" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Clear Modal */}
            {showConfirmClear && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-lg max-w-md w-full border border-gray-800">
                        <div className="p-4 border-b border-gray-800">
                            <h2 className="text-lg font-medium">Clear Batch?</h2>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-400 mb-4">
                                Are you sure you want to clear all {batchScans.length} scanned items? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowConfirmClear(false)}
                                    className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={clearBatch}
                                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Clear Batch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
