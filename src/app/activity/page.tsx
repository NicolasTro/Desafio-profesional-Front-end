import React, { Suspense } from "react";
import PageHeader from "@/Components/PageHeader";
import styles from "./styles/activity.module.css";
import ClientActivity from "./ClientActivity";
import Spinner from "@/Components/Spinner";

export default function ActivityPage() {
  return (
    <div className={styles.container}>
      <PageHeader nombre="Tu actividad" />
      <Suspense fallback={<Spinner />}>
        <ClientActivity />
      </Suspense>
    </div>
  );
}
