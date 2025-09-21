"use client";
import React from "react";
import { useAppContext } from "@/Context/AppContext";
import { Divider } from "@mui/joy";
import style from "./card-profile.module.css";
import Clipboard from "../../../../public/copy.svg";

type CardProfileProps = {
  onSave?: (updates: Record<string, unknown>) => Promise<void> | void;
};

export default function CardProfile({ onSave }: CardProfileProps) {
  const { userInfo } = useAppContext();

  const cvu = userInfo?.cvu ?? "No disponible";
  const alias = userInfo?.alias ?? "No disponible";

  const [editing, setEditing] = React.useState(false);
  const firstname = userInfo?.name ?? "";
  const lastname = userInfo?.lastname ?? "";
  const [firstValue, setFirstValue] = React.useState(firstname);
  const [lastValue, setLastValue] = React.useState(lastname);
  const [cvuCopied, setCvuCopied] = React.useState(false);
  const [aliasCopied, setAliasCopied] = React.useState(false);

  React.useEffect(() => {
    setFirstValue(firstname);
    setLastValue(lastname);
  }, [firstname, lastname]);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {
      console.debug(
        "navigator.clipboard failed, falling back to execCommand",
        e,
      );
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.width = "1px";
      textarea.style.height = "1px";
      textarea.style.padding = "0";
      textarea.style.border = "none";
      textarea.style.outline = "none";
      textarea.style.boxShadow = "none";
      textarea.style.background = "transparent";
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      return successful;
    } catch (e) {
      console.error("execCommand copy failed", e);
      return false;
    }
  };

  const saveNames = async () => {
    if (onSave) {
      await onSave({ firstname: firstValue, lastname: lastValue });
    }
    setEditing(false);
  };

  return (
    <div className={style.container}>
      <h2>
        Copia tu cvu o alias para ingresar o transferir dinero desde otra cuenta
      </h2>

      <div>
        <div className={style["cvu-container"]}>
          <p>CVU</p>
          <button
            title="Copiar CVU"
            aria-label="Copiar CVU"
            onClick={async () => {
              try {
                const ok = await copyToClipboard(String(cvu));
                if (ok) {
                  setCvuCopied(true);
                  setTimeout(() => setCvuCopied(false), 2000);
                } else {
                  console.error("Copy failed");
                }
              } catch (e) {
                console.error("Copy failed", e);
              }
            }}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <Clipboard fontSize="24" />
          </button>
          {cvuCopied && (
            <span style={{ marginLeft: 8, color: "var(--dark)", fontSize: 12 }}>
              Copiado
            </span>
          )}
        </div>
        <div>{cvu}</div>
      </div>
      <br />

      <Divider
        sx={{
          width: "100%",
          height: "1px",
          backgroundColor: "var(--lightGrey)",
        }}
      />
      <br />

      <div>
        <div className={style["cvu-container"]}>
          <p>Alias</p>
          <button
            title="Copiar Alias"
            aria-label="Copiar Alias"
            onClick={async () => {
              try {
                const ok = await copyToClipboard(String(alias));
                if (ok) {
                  setAliasCopied(true);
                  setTimeout(() => setAliasCopied(false), 2000);
                } else {
                  console.error("Copy failed");
                }
              } catch (e) {
                console.error("Copy failed", e);
              }
            }}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <Clipboard fontSize="24" />
          </button>
          {aliasCopied && (
            <span style={{ marginLeft: 8, color: "var(--dark)", fontSize: 12 }}>
              Copiado
            </span>
          )}
        </div>
        <div>{alias}</div>
      </div>
      <br />

      <div style={{ marginTop: 12 }}>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "transparent",
              border: "1px solid var(--lima)",
              padding: "6px 10px",
              borderRadius: 6,
            }}
          >
            Editar nombre
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={saveNames}
              style={{
                background: "var(--lima)",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6,
              }}
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setFirstValue(firstname);
                setLastValue(lastname);
              }}
              style={{
                background: "#eee",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6,
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
