import QRCodeGenerator from "./QrCodeGenerator";

function QrCodeWithLogo({ data, Logo, position }: { data: any, Logo: any, position: { center: boolean, right: string, left: string, bottom: string } }) {
    return (
        <div className="relative">
            <QRCodeGenerator data={data} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-2">
                <img
                    src={Logo}
                    alt="Logo"
                    style={{
                        width: "36px",
                    }}
                />
            </div>
        </div>
    )
}

export default QrCodeWithLogo;
