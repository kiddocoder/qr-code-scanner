"use client"

import type React from "react"

import { useState } from "react"
import {
    Globe,
    Wifi,
    Mail,
    Calendar,
    UserSquare,
    Briefcase,
    MapPin,
    Phone,
    Twitter,
    Instagram,
    FileImage,
    FileIcon as FilePdf,
    Copy,
    Check,
    ChevronLeft,
    MessageSquare,
} from "lucide-react"
import QrCodeWithLogo from "../components/QrCodeWithLogo"
import QRCodeGenerator from "../components/QrCodeGenerator"

type QRType =
    | "url"
    | "wifi"
    | "email"
    | "event"
    | "contact"
    | "business"
    | "location"
    | "whatsapp"
    | "sms"
    | "twitter"
    | "instagram"
    | "phone"

interface QROption {
    type: QRType
    icon: React.ReactNode
    label: string
    fields: Array<{
        name: string
        label: string
        type: string
        placeholder: string
    }>
}

export default function Generate() {
    const [selectedType, setSelectedType] = useState<QRType | null>(null)
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [generatedQR, setGeneratedQR] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [useLogo, setUseLogo] = useState(false)
    const [logoUrl, setLogoUrl] = useState("/abstract-logo.png")

    const qrOptions: QROption[] = [
        {
            type: "url",
            icon: <Globe className="h-6 w-6" />,
            label: "URL",
            fields: [{ name: "url", label: "Website URL", type: "url", placeholder: "https://example.com" }],
        },
        {
            type: "wifi",
            icon: <Wifi className="h-6 w-6" />,
            label: "Wi-Fi",
            fields: [
                { name: "ssid", label: "Network Name", type: "text", placeholder: "Your Wi-Fi Name" },
                { name: "password", label: "Password", type: "text", placeholder: "Wi-Fi Password" },
                { name: "encryption", label: "Encryption", type: "select", placeholder: "WPA/WPA2" },
            ],
        },
        {
            type: "email",
            icon: <Mail className="h-6 w-6" />,
            label: "Email",
            fields: [
                { name: "email", label: "Email Address", type: "email", placeholder: "example@email.com" },
                { name: "subject", label: "Subject", type: "text", placeholder: "Email Subject" },
                { name: "body", label: "Body", type: "textarea", placeholder: "Email Body" },
            ],
        },
        {
            type: "event",
            icon: <Calendar className="h-6 w-6" />,
            label: "Event",
            fields: [
                { name: "title", label: "Event Title", type: "text", placeholder: "Meeting" },
                { name: "start", label: "Start Date & Time", type: "datetime-local", placeholder: "" },
                { name: "end", label: "End Date & Time", type: "datetime-local", placeholder: "" },
                { name: "location", label: "Location", type: "text", placeholder: "Event Location" },
            ],
        },
        {
            type: "contact",
            icon: <UserSquare className="h-6 w-6" />,
            label: "Contact",
            fields: [
                { name: "name", label: "Name", type: "text", placeholder: "John Doe" },
                { name: "phone", label: "Phone", type: "tel", placeholder: "+1234567890" },
                { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
                { name: "address", label: "Address", type: "text", placeholder: "123 Main St" },
            ],
        },
        {
            type: "business",
            icon: <Briefcase className="h-6 w-6" />,
            label: "Business",
            fields: [
                { name: "company", label: "Company", type: "text", placeholder: "Company Name" },
                { name: "name", label: "Your Name", type: "text", placeholder: "John Doe" },
                { name: "title", label: "Job Title", type: "text", placeholder: "CEO" },
                { name: "phone", label: "Phone", type: "tel", placeholder: "+1234567890" },
                { name: "email", label: "Email", type: "email", placeholder: "john@company.com" },
                { name: "website", label: "Website", type: "url", placeholder: "https://company.com" },
            ],
        },
        {
            type: "location",
            icon: <MapPin className="h-6 w-6" />,
            label: "Location",
            fields: [
                { name: "latitude", label: "Latitude", type: "text", placeholder: "40.7128" },
                { name: "longitude", label: "Longitude", type: "text", placeholder: "-74.0060" },
            ],
        },
        {
            type: "whatsapp",
            icon: <MessageSquare className="h-6 w-6" />,
            label: "WhatsApp",
            fields: [
                { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1234567890" },
                { name: "message", label: "Message", type: "textarea", placeholder: "Hello!" },
            ],
        },
        {
            type: "sms",
            icon: <MessageSquare className="h-6 w-6" />,
            label: "SMS",
            fields: [
                { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1234567890" },
                { name: "message", label: "Message", type: "textarea", placeholder: "Hello!" },
            ],
        },
        {
            type: "twitter",
            icon: <Twitter className="h-6 w-6" />,
            label: "Twitter",
            fields: [
                { name: "username", label: "Username", type: "text", placeholder: "@username" },
                { name: "tweet", label: "Tweet", type: "textarea", placeholder: "Check out this QR code!" },
            ],
        },
        {
            type: "instagram",
            icon: <Instagram className="h-6 w-6" />,
            label: "Instagram",
            fields: [{ name: "username", label: "Username", type: "text", placeholder: "@username" }],
        },
        {
            type: "phone",
            icon: <Phone className="h-6 w-6" />,
            label: "Phone",
            fields: [{ name: "phone", label: "Phone Number", type: "tel", placeholder: "+1234567890" }],
        },
    ]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const generateQRData = () => {
        if (!selectedType) return null

        switch (selectedType) {
            case "url":
                return formData.url || ""
            case "wifi":
                return `WIFI:S:${formData.ssid};T:${formData.encryption || "WPA"};P:${formData.password};;`
            case "email":
                return `mailto:${formData.email}?subject=${encodeURIComponent(formData.subject || "")}&body=${encodeURIComponent(formData.body || "")}`
            case "event":
                const start = formData.start ? new Date(formData.start).toISOString() : ""
                const end = formData.end ? new Date(formData.end).toISOString() : ""
                return `BEGIN:VEVENT\nSUMMARY:${formData.title || ""}\nLOCATION:${formData.location || ""}\nDTSTART:${start}\nDTEND:${end}\nEND:VEVENT`
            case "contact":
                return `BEGIN:VCARD\nVERSION:3.0\nN:${formData.name || ""}\nTEL:${formData.phone || ""}\nEMAIL:${formData.email || ""}\nADR:${formData.address || ""}\nEND:VCARD`
            case "business":
                return `BEGIN:VCARD\nVERSION:3.0\nORG:${formData.company || ""}\nN:${formData.name || ""}\nTITLE:${formData.title || ""}\nTEL:${formData.phone || ""}\nEMAIL:${formData.email || ""}\nURL:${formData.website || ""}\nEND:VCARD`
            case "location":
                return `geo:${formData.latitude || "0"},${formData.longitude || "0"}`
            case "whatsapp":
                return `https://wa.me/${formData.phone?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(formData.message || "")}`
            case "sms":
                return `sms:${formData.phone}${formData.message ? `?body=${encodeURIComponent(formData.message)}` : ""}`
            case "twitter":
                return `https://twitter.com/${formData.username?.replace("@", "")}${formData.tweet ? `?text=${encodeURIComponent(formData.tweet)}` : ""}`
            case "instagram":
                return `https://instagram.com/${formData.username?.replace("@", "")}`
            case "phone":
                return `tel:${formData.phone}`
            default:
                return ""
        }
    }

    const handleGenerate = () => {
        const qrData = generateQRData()
        if (qrData) {
            setGeneratedQR(qrData)
        }
    }

    const handleCopyQR = async () => {
        if (generatedQR) {
            await navigator.clipboard.writeText(generatedQR)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const downloadQRCode = (format: "png" | "jpeg" | "pdf") => {
        const canvas = document.querySelector("canvas")
        if (!canvas) return

        if (format === "pdf") {
            // This is a simplified version - in a real app you'd use a PDF library
            const dataUrl = canvas.toDataURL("image/png")
            const link = document.createElement("a")
            link.href = dataUrl
            link.download = `qrcode.${format}`
            link.click()
        } else {
            const dataUrl = canvas.toDataURL(`image/${format}`)
            const link = document.createElement("a")
            link.href = dataUrl
            link.download = `qrcode.${format}`
            link.click()
        }
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    setLogoUrl(event.target.result as string)
                    setUseLogo(true)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-6">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        {selectedType && (
                            <button
                                onClick={() => {
                                    setSelectedType(null)
                                    setGeneratedQR(null)
                                }}
                                className="mr-3 p-1 rounded-full hover:bg-gray-800"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <h1 className="text-xl font-bold">Generate QR</h1>
                    </div>
                </header>

                <main>
                    {!selectedType && (
                        <div className="grid grid-cols-3 gap-4">
                            {qrOptions.map((option) => (
                                <button
                                    key={option.type}
                                    onClick={() => setSelectedType(option.type)}
                                    className="flex flex-col items-center justify-center p-4 border border-yellow-600 rounded-lg bg-black hover:bg-gray-900 transition-colors"
                                >
                                    <div className="bg-yellow-600 p-3 rounded-lg mb-2">{option.icon}</div>
                                    <span className="text-sm text-yellow-500">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {selectedType && !generatedQR && (
                        <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
                            <h2 className="text-lg font-bold mb-4 text-yellow-500">
                                {qrOptions.find((o) => o.type === selectedType)?.label} QR Code
                            </h2>

                            <form className="space-y-4">
                                {qrOptions
                                    .find((o) => o.type === selectedType)
                                    ?.fields.map((field) => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium mb-1 text-gray-300">{field.label}</label>

                                            {field.type === "textarea" ? (
                                                <textarea
                                                    name={field.name}
                                                    placeholder={field.placeholder}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                                                    rows={3}
                                                />
                                            ) : field.type === "select" ? (
                                                <select
                                                    name={field.name}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                                                >
                                                    <option value="WPA">WPA/WPA2</option>
                                                    <option value="WEP">WEP</option>
                                                    <option value="nopass">No Password</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    placeholder={field.placeholder}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                                                />
                                            )}
                                        </div>
                                    ))}

                                <div className="pt-2">
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={useLogo}
                                            onChange={(e) => setUseLogo(e.target.checked)}
                                            className="rounded border-gray-700 text-yellow-600 focus:ring-yellow-600"
                                        />
                                        <span>Add Logo to QR Code</span>
                                    </label>

                                    {useLogo && (
                                        <div className="mt-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="block w-full text-sm text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-medium
                          file:bg-gray-800 file:text-yellow-500
                          hover:file:bg-gray-700"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-black font-medium rounded-md transition-colors"
                                >
                                    Generate QR Code
                                </button>
                            </form>
                        </div>
                    )}

                    {generatedQR && (
                        <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
                            <h2 className="text-lg font-bold mb-4 text-yellow-500">Your QR Code</h2>

                            <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
                                {useLogo ? (
                                    <QrCodeWithLogo
                                        data={generatedQR}
                                        Logo={logoUrl}
                                        position={{ center: true, right: "0", left: "0", bottom: "0" }}
                                    />
                                ) : (
                                    <QRCodeGenerator data={generatedQR} />
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
                                    <div className="truncate max-w-[250px] text-sm text-gray-300">{generatedQR}</div>
                                    <button onClick={handleCopyQR} className="p-1 rounded-md hover:bg-gray-700" aria-label="Copy QR data">
                                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-400" />}
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => downloadQRCode("png")}
                                        className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        <FileImage className="h-5 w-5 mb-1 text-yellow-500" />
                                        <span className="text-xs">PNG</span>
                                    </button>
                                    <button
                                        onClick={() => downloadQRCode("jpeg")}
                                        className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        <FileImage className="h-5 w-5 mb-1 text-yellow-500" />
                                        <span className="text-xs">JPEG</span>
                                    </button>
                                    <button
                                        onClick={() => downloadQRCode("pdf")}
                                        className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                        <FilePdf className="h-5 w-5 mb-1 text-yellow-500" />
                                        <span className="text-xs">PDF</span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => setGeneratedQR(null)}
                                    className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
                                >
                                    Edit QR Code
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
