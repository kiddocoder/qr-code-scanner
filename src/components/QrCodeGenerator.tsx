import { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = ({ data }: any) => {
    const qrCodeValue = useMemo(() => {
        return `${data}`;
    }, [data]);

    return (
        <QRCodeCanvas
            value={qrCodeValue}
            size={224}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            level="H"
        />
    );
};

export default QRCodeGenerator;
