"use client";
import React, { useEffect, useMemo, useState } from "react";
import Table from "@mui/joy/Table";

import Pencil from "../../../../public/Pencil.svg";
import style from "./data-profile-table.module.css";

type UserShape = {
  id: string;
  name: string;
  email: string;
  lastname?: string;
  dni?: string | number;
  phone?: string;
};

type tableProps = {
  className?: string;
  userData?: UserShape | null;

  onSave?: (updates: Record<string, unknown>) => Promise<void> | void;
};

export default function DataProfileTable({ userData, onSave }: tableProps) {
  const initialRows = useMemo(
    () =>
      userData
        ? [
            { key: "email", label: "Email", value: userData.email },
            { key: "name", label: "Nombre", value: userData.name },
            { key: "lastname", label: "Apellido", value: userData.lastname },
            { key: "dni", label: "CUIT", value: userData.dni ?? "" },
            { key: "phone", label: "Teléfono", value: userData.phone ?? "" },
            { key: "password", label: "Contraseña", value: "******" },
          ]
        : [],
    [userData],
  );

  const [rows, setRows] = useState(initialRows);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRows(initialRows);
    setEditingKey(null);
    setEditValue("");
  }, [initialRows]);

  const startEdit = (
    key: string,
    value: string | number | null | undefined,
  ) => {
    setEditingKey(key);
    setEditValue(value == null ? "" : String(value));
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const saveEdit = async (rowKey: string) => {
    setRows((prev) =>
      prev.map((r) => (r.key === rowKey ? { ...r, value: editValue } : r)),
    );
    setEditingKey(null);
    setSaving(true);
    try {
      if (onSave && userData) {
        const mapKeyToPayloadField: Record<string, string> = {
          email: "email",

          name: "firstname",
          lastname: "lastname",
          dni: "dni",
          phone: "phone",
          password: "password",
        };
        const payloadField = mapKeyToPayloadField[rowKey];
        if (payloadField) {
          const payload: Record<string, unknown> = {};
          if (payloadField === "dni") {
            const n = Number(editValue.replace(/\D/g, ""));
            payload.dni = Number.isNaN(n) ? editValue : n;
          } else {
            payload[payloadField] = editValue;
          }
          await onSave(payload);
        }
      } else {
        console.log("DataProfileTable: saved", { [rowKey]: editValue });
      }
    } catch (err) {
      console.error("Failed to save profile field", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Table
      aria-label="table with sticky header"
      stickyHeader
      stickyFooter
      className={style["table-background"]}
    >
      <thead>
        <tr>
          <th className={style["table-header"]}>
            <p>Tus datos</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td>
              <div className={style.cells}>
                <div className={style["header-cell-size"]}>
                  <p>{row.label}</p>
                </div>

                <div className={`${style["edit-container"]}`}>
                  <div className={style["content-value"]}>
                    {editingKey === row.key ? (
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={style["inline-input"]}
                        aria-label={`Editar ${row.label}`}
                      />
                    ) : (
                      <p>{row.value}</p>
                    )}
                  </div>

                  <div>
                    {editingKey === row.key ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => saveEdit(row.key)}
                          disabled={saving}
                          title="Guardar"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          title="Cancelar"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : row.key === "email" || row.key === "password" ? (
                      <span style={{ opacity: 0.6, fontSize: 14 }}>
                        No editable
                      </span>
                    ) : (
                      <button
                        title={`Editar ${row.label}`}
                        onClick={() => startEdit(row.key, row.value)}
                      >
                        <Pencil fontSize="22" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        ))}
        <tr />
      </tbody>
    </Table>
  );
}
