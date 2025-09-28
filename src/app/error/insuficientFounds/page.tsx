"use client"

import Error from "@/Components/ErrorComponent";
import PageHeader from "@/Components/PageHeader";
import Button from "@/Components/Button";
import styles from './styles/InsufficientFounds.module.css'
import { useRouter } from 'next/navigation';

export default function InsuficientFounds() {

    const router = useRouter();



    const errorTitle = "Hubo un problema con tu pago";
    const message1 = "Puede deberse a fondos insuficientes";
    const message2 = "Comnicate con la entidad emisora de la tarjeta"

    return (
        <div className={styles.container}>

            <PageHeader nombre="Pagar servicios" />
            <Error title1={errorTitle} message1={message1} message2={message2} />
            <div className={styles["button-container"]}>
                <Button
                    height="50px"
                    label="Revisar dato"
                    backgroundColor="var(--lima)"
                    onClick={() => {
                        try {
                            console.log('InsuficientFounds: navigating to /services');
                            if (router && typeof router.push === 'function') {
                                router.push('/services');
                                return;
                            }
                        } catch (e) {
                            console.warn('router.push failed', e);
                        }
                        router.push('/services');
                    }}
                />
            </div>
        </div>
    )
}
