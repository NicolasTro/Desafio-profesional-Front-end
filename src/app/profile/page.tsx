"use client";
import Button from "@/Components/Button";
import { useAppContext } from "@/Context/AppContext";
import { useEffect, useMemo, useCallback } from "react";
import Arrow from "./../../../public/arrow.svg";
import CardProfile from "./Components/CardProfile";
import DataProfileTable from "./Components/DataProfileTable";
import style from "./styles/profile.module.css";
import { useUser } from "@/hooks/useUser";
import { useQueryClient } from '@tanstack/react-query';

interface UserData {
  id: string;
  name: string;
  lastname?: string;
  email: string;
  dni?: string | number;
  phone?: string;

  available_amount?: number | 0;
  cvu: string | 0;
  alias?: string | 0;
}

export default function ProfilePage() {
  const { userInfo, refreshSession } = useAppContext();
  const { data: meData, isLoading: isLoadingMe } = useUser();
  const qc = useQueryClient();

  useEffect(() => {
    if (!userInfo) refreshSession();
  }, [userInfo, refreshSession]);

  const loading = isLoadingMe;

  const userData = useMemo((): UserData | null => {
    if (!meData && !userInfo) return null;
    return {
      ...(meData ?? {}),
      ...(userInfo ?? {}),
    } as UserData;
  }, [meData, userInfo]);

  const handleSave = useCallback(async (updates: Partial<UserData>) => {
  const maybeIdFromMe = meData && typeof meData === 'object' && 'id' in (meData as object) ? (meData as Record<string, unknown>)['id'] : undefined;
  const userId = maybeIdFromMe || userData?.id;
    if (!userId) {
      throw new Error('No user id available to save profile');
    }

    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `HTTP ${res.status}`);
    }

  qc.invalidateQueries({ queryKey: ['me'] });
    refreshSession();
  }, [userData, meData, qc, refreshSession]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.flex}>
          <Arrow />
          <h2>
            <p>Perfil</p>
          </h2>
        </div>
        <div className="">
          
          
          <DataProfileTable userData={userData} onSave={handleSave} />
        </div>
        <div className={style["button-container"]}>
          <Button
            label="Gestioná los medios de pago"
            backgroundColor="var(--lima)"
            width="80%"
            height="67px"
          />
          <Arrow />
        </div>

        <div className={style["card-profile"]}>
          <CardProfile data={userData} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
