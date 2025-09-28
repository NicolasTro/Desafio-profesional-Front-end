"use client";
import TransferModule from "@/Components/TransferModule";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import CardsSelector from "@/app/deposit/cardTransfer/Components/CardsSelector";
import { getAccountForService } from "@/lib/serviceAccounts";
import PageHeader from "@/Components/PageHeader";
import ConfirmCard from "@/app/deposit/cardTransfer/Components/ConfirmCard";
import styles from "./styles/Invoice.module.css";
import Button from "@/Components/Button";
import { useAppContext } from '@/Context/AppContext';
import Success from "../../../../public/Success.svg";

type Service = {
    id: number | string;
    name?: string
    date?: string
    description?: string | null
    invoice_value?: string | number
};

type Card = {
    id: number;
    account_id: number;
    number_id: number | string;
    first_last_name?: string;
    cod?: number;
    expiration_date?: string;
};

export default function Invoice() {
    const [service, setService] = useState<Service | null>(null);
    const [accountInput, setAccountInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<number>(1);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [paymentDate, setPaymentDate] = useState<string | null>(null);
    const [serviceId, setServiceId] = useState<string | null>(null);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            setServiceId(params.get("serviceId"));
        } catch {
            setServiceId(null);
        }
    }, []);
    const { account, refreshSession } = useAppContext();
    const router = useRouter();

    const invoiceValue = (() => {
        const rawInvoiceValue = service?.invoice_value;
        if (rawInvoiceValue == null) return 0;
        const parsedNumber = typeof rawInvoiceValue === 'number' ? rawInvoiceValue : Number(String(rawInvoiceValue).replace(/[^0-9.-]+/g, ''));
        return Number.isFinite(parsedNumber) ? parsedNumber : 0;
    })();

    const walletBalance = Number(account?.available_amount ?? 0);
    const walletSufficient = walletBalance >= invoiceValue;
    const accountDigits = accountInput.replace(/\D/g, '');
    const isAccountValid = accountDigits.length >= 11;

    useEffect(() => {
        if (!serviceId) return;
        let mounted = true;
        setLoading(true);
        setError(null);
        (async () => {
            try {
                const res = await fetch(`/api/service/${encodeURIComponent(String(serviceId))}`);
                if (!mounted) return;
                if (res.ok) {
                    const data = await res.json();
                    const svc: Service = Array.isArray(data) ? data.find((x: Service) => String(x.id) === String(serviceId)) || data[0] : data;
                    setService(data);
                    const defaultAccount = getAccountForService(svc?.id ?? serviceId);
                    if (defaultAccount) setAccountInput(defaultAccount);
                } else {
                    setError("Servicio no encontrado");
                    setService(null);
                }
            } catch {
                if (!mounted) return;
                setError("Error al cargar servicio");
                setService(null);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [serviceId]);

    useEffect(() => {
        if (loading || error || !service) return;
        const rawInvoiceValue = service?.invoice_value;
        const parsedInvoiceValue = rawInvoiceValue == null ? 0 : (typeof rawInvoiceValue === 'number' ? rawInvoiceValue : Number(String(rawInvoiceValue).replace(/[^0-9.-]+/g, '')));
        const finalInvoiceValue = Number.isFinite(parsedInvoiceValue) ? parsedInvoiceValue : 0;
        if (finalInvoiceValue === 0) {
            try {
                
                if (router && typeof router.push === 'function') {
                    router.push('/error/errorInvoice');
                } else {
                    
                    try { router.push('/error/errorInvoice'); } catch (err) { console.warn('router.push failed', err); }
                }
            } catch (e) {
                console.warn('Redirect to /error/errorInvoice failed', e);
            }
        }
    }, [loading, error, service, router]);

    return (
        <div className={styles.container}>
            <PageHeader nombre="Pagar servicios" />
            <TransferModule
                header={
                    step === 3 ? (<>
                        <div className={styles.successHeader}>
                            <Success fontSize={40} color="dark" />
                            <div>Ya realizamos tu pago</div>
                        </div>
                    </>) : (null)
                }
                main={
                    step === 1 ? (
                        <>
                            <div className={styles.step1}>
                                <label>Número de cuenta <br />
                                    sin el primer 2</label>
                                <div
                                    className={styles["input-account"]}
                                >
                                    <input
                                        value={accountInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const digits = e.target.value.replace(/\D/g, '');
                                            setAccountInput(digits);
                                        }}
                                        onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                                            const pasted = e.clipboardData.getData('text');
                                            const digits = pasted.replace(/\D/g, '');
                                            e.preventDefault();
                                            setAccountInput((prev) => (prev + digits));
                                        }}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                    />
                                </div>

                                <p style={{ color: 'white', fontSize: 12 }}>Son 11 números sin espacios, sin el “2” inicial. Agregá ceros adelante si tenés menos. </p>
                                {loading && <div style={{ marginTop: 8 }}>Cargando...</div>}
                                {!isAccountValid && accountInput.length > 0 && (
                                    <div style={{ marginTop: 8, color: 'red' }}>El número de cuenta debe tener al menos 11 dígitos</div>
                                )}
                                {error && <div style={{ marginTop: 8, color: 'red' }}>{error}</div>}
                                <div className={`${styles["button-container"]}`}>
                                    <Button
                                        label="Continuar"
                                        height="50px"
                                        width="165px"
                                        backgroundColor="var(--lima)"
                                        className={`${styles["button-service"]}`}
                                        onClick={() => {
                                            if (!isAccountValid) return;
                                            setStep(2);
                                        }}
                                        disabled={!isAccountValid}
                                    />
                                </div>
                            </div>
                        </>

                    ) : step === 2 ? (
                        <div >
                            <div className={styles.step2}>
                                <div className={styles.title}>
                                    <div className={styles["title-left"]}>
                                        <h2>{service?.name}</h2>
                                    </div>
                                    <div className={styles["title-right"]}>
                                        Ver detalles del pago
                                    </div>
                                </div>
                                <hr />
                                <div className={styles.total}>
                                    <div>Total a pagar</div>
                                    <div>{`$ ${service?.invoice_value}`}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ConfirmCard
                                amount={invoiceValue}
                                cvu={accountInput}
                                variant={success ? "success" : "confirm"}
                                dated={paymentDate ?? (success ? new Date().toISOString() : undefined)}
                                isSubmitting={processing}
                                paymentMethod={paymentMethod}
                                walletBalance={walletBalance}
                                cardBrand={selectedCard ? "visa" : undefined}
                                cardLast4={selectedCard ? String(selectedCard.number_id).slice(-4) : undefined}
                                onBack={() => setStep(2)}
                                onConfirm={async () => {
                                    setProcessing(true);
                                    setSuccess(null);
                                    try {
                                        await new Promise((r) => setTimeout(r, 900));
                                        setSuccess("Pago realizado con éxito");
                                    } catch (e) {
                                        console.error(e);
                                        setSuccess("Error al procesar el pago");
                                    } finally {
                                        setProcessing(false);
                                    }
                                }}
                                serviceName={service?.name}
                                description={service?.description ?? null}
                            />
                        </>
                    )
                }
                aside={
                    <div className={styles.aside}>

                        {step === 1 ? (
                            <Button
                                label="Continuar"
                                height="50px"
                                width="165px"
                                backgroundColor="var(--lima)"
                                className={`${styles["button-service"]} ${styles["button-hide-tablet"]}`}
                                onClick={() => {
                                    if (!isAccountValid) return;
                                    setStep(2);
                                }}
                                disabled={!isAccountValid}
                            />

                        ) : step === 2 ?

                            <div className={styles["step2-aside"]} >
                                <div className={styles["confirm-container"]}>
                                    <CardsSelector
                                        showWalletOption
                                        selectedId={selectedCard?.id ?? null}
                                        selectedWallet={paymentMethod === 'wallet'}
                                        onSelect={(c, wallet) => {
                                            if (wallet) {
                                                setPaymentMethod('wallet');
                                                setSelectedCard(null);
                                            } else {
                                                setPaymentMethod('card');
                                                setSelectedCard(c ?? null);
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <Button
                                        label={processing ? "Procesando..." : "Pagar"}
                                        height="50px"
                                        width="165px"
                                        backgroundColor="var(--lima)"
                                        className={styles["button-service"]}
                                        onClick={async () => {
                                            if (!(paymentMethod === 'wallet' || selectedCard)) return;
                                            // Only redirect to insufficient funds when the wallet is selected and NO card is selected.
                                            if (!selectedCard && paymentMethod === 'wallet' && !walletSufficient) {
                                                try {
                                                    if (router && typeof router.push === 'function') {
                                                        router.push('/error/insuficientFounds');
                                                    } else if (typeof window !== 'undefined') {
                                                        window.location.href = '/error/insuficientFounds';
                                                    }
                                                } catch (e) {
                                                    console.warn('Redirect to /error/insuficientFounds failed', e);
                                                }
                                                return;
                                            }
                                            setProcessing(true);
                                            setSuccess(null);
                                            try {
                                                if (paymentMethod === 'wallet') {
                                                    const accountId = account?.account_id;
                                                    if (!accountId) throw new Error("Cuenta no disponible");
                                                    const payload = {
                                                        amount: -Math.abs(invoiceValue),
                                                        dated: new Date().toISOString(),
                                                        description: `Pago servicio ${service?.name ?? ''}`,
                                                    };
                                                    const res = await fetch(`/api/accounts/${encodeURIComponent(String(accountId))}/transactions`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(payload),
                                                    });

                                                    if (!res.ok) {
                                                        const txt = await res.text().catch(() => "");
                                                        throw new Error(`Error en pago: ${res.status} ${txt}`);
                                                    }
                                                    setPaymentDate(payload.dated);
                                                    setSuccess("Pago realizado con éxito");

                                                    try {
                                                        const currentBalance = Number(account?.available_amount ?? 0);
                                                        const rawNewBalance = currentBalance + Number(payload.amount);
                                                        const newBalance = Number(rawNewBalance.toFixed(2));

                                                        const patchRes = await fetch(`/api/accounts/${encodeURIComponent(String(accountId))}`, {
                                                            method: 'PATCH',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ available_amount: newBalance }),
                                                        });
                                                        if (!patchRes.ok) {
                                                            const txt = await patchRes.text().catch(() => '');
                                                            const errMsg = `Error actualizando saldo: ${patchRes.status} ${txt}`;
                                                            console.error(errMsg);
                                                            setError(errMsg);
                                                            setSuccess(null);
                                                            return;
                                                        }
                                                        try {
                                                            if (typeof refreshSession === 'function') await refreshSession();
                                                        } catch (e) {
                                                            const errMsg = 'Error al refrescar sesión después del pago';
                                                            console.warn(errMsg, e);
                                                            setError(errMsg);
                                                            setSuccess(null);
                                                            return;
                                                        }
                                                        setStep(3);
                                                    } catch (err) {
                                                        console.error('Error updating balance after payment:', err);
                                                        setError('Error actualizando saldo');
                                                        setSuccess(null);
                                                        return;
                                                    }
                                                } else {
                                                    if (!selectedCard) throw new Error('No se seleccionó tarjeta');
                                                    const cardAccountId = selectedCard.account_id ?? account?.account_id;
                                                    if (!cardAccountId) throw new Error('Cuenta de tarjeta no disponible');

                                                    const payload = {
                                                        amount: -Math.abs(invoiceValue),
                                                        dated: new Date().toISOString(),
                                                        description: `Pago servicio ${service?.name ?? ''} (tarjeta)`,
                                                    };

                                                    const res = await fetch(`/api/accounts/${encodeURIComponent(String(cardAccountId))}/transactions`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(payload),
                                                    });

                                                    if (!res.ok) {
                                                        const txt = await res.text().catch(() => '');
                                                        const lowered = String(txt).toLowerCase();
                                                        const insufficientStatus = [402, 409];
                                                        const indicatesInsufficient = insufficientStatus.includes(res.status) || /insuf|fondo|funds|insufficient/.test(lowered);
                                                        if (indicatesInsufficient) {
                                                            try {
                                                                if (router && typeof router.push === 'function') {
                                                                    router.push('/error/insuficientFounds');
                                                                } else if (typeof window !== 'undefined') {
                                                                    window.location.href = '/error/insuficientFounds';
                                                                }
                                                            } catch (e) {
                                                                console.warn('Redirect to /error/insuficientFounds failed', e);
                                                            }
                                                            return;
                                                        }
                                                        throw new Error(`Error en pago con tarjeta: ${res.status} ${txt}`);
                                                    }
                                                    setPaymentDate(payload.dated);
                                                    setSuccess('Pago realizado con éxito');
                                                    try {
                                                        if (typeof refreshSession === 'function') await refreshSession();
                                                    } catch (e) {
                                                        console.warn('refreshSession failed after card payment', e);
                                                    }
                                                    setStep(3);
                                                }
                                            } catch (e) {
                                                console.error(e);
                                                const msg = e instanceof Error ? e.message : String(e);
                                                setError(msg);
                                                setSuccess(null);
                                            } finally {
                                                setProcessing(false);
                                            }
                                        }}
                                        disabled={!(paymentMethod === 'wallet' || selectedCard) || processing}
                                    />
                                </div>

                            </div>
                            : null}
                        {step === 3 && (

                            <div className={styles["button-group"]}>
                                <button
                                    style={{ backgroundColor: 'var(--editGrey)', color: 'black' }}
                                    onClick={() => {
                                        router.push('/home');
                                    }}
                                >
                                    Ir al inicio
                                </button>
                                <button
                                    className={styles["button-service"]}
                                    onClick={() => {
                                        console.log('Descargar comprobante');
                                    }}
                                >
                                    Descargar comprobante
                                </button>
                            </div>
                        )}
                    </div>
                }
            />
        </div >
    );
}