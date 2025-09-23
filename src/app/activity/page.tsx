import React from "react";
import PageHeader from "@/Components/PageHeader";
import styles from "./styles/activity.module.css";
import ClientActivity from "./ClientActivity";

export default function ActivityPage() {
  return (
    <div className={styles.container}>
      <PageHeader nombre="Tu actividad" />
      <React.Suspense fallback={<div />}> 
        <ClientActivity />
      </React.Suspense>
    </div>
  );
}
