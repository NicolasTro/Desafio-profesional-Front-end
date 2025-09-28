"use client"
import PageHeader from "@/Components/PageHeader";
import SearchBar from "@/Components/SearchBar";
import { useState } from "react";
import ServiceTable from "./Components/ServiceTable";
import styles from "./styles/Services.module.css";

export default function Services() {

    const [filter, setFilter] = useState<string>("");

    return (
        <div className={styles.container}>
            <PageHeader nombre="Pagar servicios" />
            <SearchBar width={"100%"} height={"64px"} className={styles["search-bar"]} placeholder="Buscá entre más de 5.000 empresas" onSearch={(q) => setFilter(q)} />
            <div className={styles["table-container"]}>
                <ServiceTable filter={filter} />
            </div>
        </div>
    )
}