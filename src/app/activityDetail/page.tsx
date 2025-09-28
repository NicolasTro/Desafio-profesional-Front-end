import React, { Suspense } from "react";
import styles from "./styles/ActivityDetail.module.css";
import ClientActivityDetail from "./ClientActivityDetail";
import Spinner from "@/Components/Spinner";

export default function ActivityDetailPage() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<Spinner />}>
        <ClientActivityDetail />
      </Suspense>
    </div>
  );
}