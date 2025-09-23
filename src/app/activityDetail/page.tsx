import React from "react";
import styles from "./activity-detail.module.css";
import ClientActivityDetail from "./ClientActivityDetail";

export default function ActivityDetailPage() {
  return (
    <div className={styles.page}>
      <React.Suspense fallback={<div />}> 
        <ClientActivityDetail />
      </React.Suspense>
    </div>
  );
}