"use client"
import ErrorComponent from "@/Components/ErrorComponent";
import styles from './styles/ErrorInvoice.module.css'
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import { useRouter } from "next/navigation";

export default function Error() {
    const router = useRouter();

    const errorTitle1 = "No encontramos facturas asociadas a este dato";
    const errorMessage1 = "Revisá el dato ingresado. Si es correcto, es posible";
    const errorMessage2 = "que la empresa aún no haya cargado tu factura.";
    return (


        <div className={styles.container}>
            <PageHeader nombre="Precio servicios" />
            <ErrorComponent title1={errorTitle1} message1={errorMessage1} message2={errorMessage2} />
            <div className={styles["button-container"]}>
                <Button 
                    height="50px"
                    label="Revisar dato"
                    backgroundColor="var(--lima)"
                    onClick={() => { router.push('/services') }}
                />
            </div>
        </div>
    )
}
