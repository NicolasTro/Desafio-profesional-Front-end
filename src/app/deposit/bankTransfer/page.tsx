import PageHeader from "@/Components/PageHeader";
import banktrasfer from "./styles/bankTransfer.module.css";

import CardProfile from "@/app/profile/Components/CardProfile";

export default function BankTransfer() {
  return (
    <main className={banktrasfer.container}>
      <PageHeader nombre="Cargar dinearo" />

      <div className={banktrasfer.blocks}>
        <CardProfile />
      </div>
    </main>
  );
}
