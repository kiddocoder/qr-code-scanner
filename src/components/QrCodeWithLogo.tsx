import QRCodeGenerator from "./QrCodeGenerator";

function QrCodeWithLogo({ data, Logo, position }: { data: any, Logo: string, position: { center: boolean, right: string, left: string, bottom: string } }) {
    return (
        <div className="relative">
            <QRCodeGenerator data={data} />
            <div className={`absolute ${position.center ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : ""} ${position.right ? "right-0" : ""} ${position.left ? "left-0" : ""} ${position.bottom ? "bottom-0" : ""}`}>
                <img
                    src={Logo}
                    alt="Logo"
                    className="rounded-md bg-white p-2"
                    style={{
                        width: "36px",
                    }}
                />
            </div>
        </div>
    )
}

export default QrCodeWithLogo;

