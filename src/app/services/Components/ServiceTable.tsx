"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/joy/Table";
import Image from "next/image";
import styles from "./ServiceTable.module.css"
import { Sheet } from "@mui/joy";
import { useRouter } from "next/navigation";

type Service = {
    id: number;
    name: string;
    date: string;
    invoice_value?: number | string;
    amount_invoice?: number | string;
};

export default function ServiceTable({ filter }: { filter?: string }) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        fetch("/api/service")
            .then(async (response) => {
                if (response.status === 404) throw new Error("No services found");
                if (!response.ok) throw new Error(await response.text().catch(() => "Error"));
                return response.json();
            })
            .then((data) => {
                if (!mounted) return;
                if (Array.isArray(data)) setServices(data as Service[]);
                else setError("Invalid response");
            })
            .catch((error) => {
                if (!mounted) return;
                setError(String(error.message || error));
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    if (error) return <div>Error: {error}</div>;
    const query = (filter || "").trim().toLowerCase();
    const visibleServices = query
        ? services.filter((s) => s.name.toLowerCase().includes(query))
        : services;

    return (

        <Sheet sx={{ height: '500px', overflow: 'auto' }}>
            <Table className={styles.table}  >
                <thead>
                    <tr>
                        <th>
                            <div className={styles["card-header"]}>Más recientes</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (<tr><><td>Cargando...</td></></tr>) :
                        (<>
                            {visibleServices.map((s) => (
                                <tr key={s.id} className={styles["row-content"]} role="button" tabIndex={0}>
                                    <td className={styles["cell-overall"]}>
                                        <div className={styles["cell-content"]}>
                                            <div className="flex items-center justify-center gap-4">
                                                <Image
                                                    src={`/${s.id}.png`}
                                                    alt={s.name}
                                                    width={60}
                                                    height={60}
                                                    className={styles.logo}
                                                    unoptimized
                                                />
                                                <div className={styles["service-name"]}>{s.name}</div>
                                            </div>
                                            <div className={styles.right}>
                                                <button
                                                    type="button"
                                                    className={styles["select-button"]}
                                                    onClick={() => {
                                                      
                                                        const invoiceValue = (s as Service).invoice_value ?? (s as Service).amount_invoice;
                                                        if (invoiceValue === undefined || invoiceValue === null) {
                                                            router.push(`/services/invoice?serviceId=${s.id}`);
                                                            return;
                                                        }
                                                        const parsedValue = typeof invoiceValue === 'number' ? invoiceValue : Number(String(invoiceValue).replace(/[^0-9.-]+/g, ''));
                                                        const finalInvoiceAmount = Number.isFinite(parsedValue) ? parsedValue : 0;
                                                        if (finalInvoiceAmount === 0) {
                                                            router.push('/error/errorInvoice');
                                                            return;
                                                        }
                                                        router.push(`/services/invoice?serviceId=${s.id}`);
                                                    }}
                                                >
                                                    Seleccionar
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </>)
                    }

                </tbody>
            </Table>
        </Sheet >

    );
}