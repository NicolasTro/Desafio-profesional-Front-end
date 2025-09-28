"use client";
import React from "react";
import { useAppContext } from "@/Context/AppContext";
import { Divider } from "@mui/joy";
import style from "./CardProfile.module.css";
import Clipboard from "../../../../public/copy.svg";
import SnackBar from "@/Components/SnackBar";

export default function CardProfile() {
  const { account } = useAppContext();
  const cvu = account?.cvu ?? "No disponible";
  const alias = account?.alias ?? "No disponible";

  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState("");

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
            className={style.clipboard}
            onClick={async () => {
              try {
                const ok = await copyToClipboard(String(cvu));
                if (ok) {
                  setSnackMessage("CVU copiado");
                  setSnackOpen(true);
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
            className={style.clipboard}
            onClick={async () => {
              try {
                const ok = await copyToClipboard(String(alias));
                if (ok) {
                  setSnackMessage("Alias copiado");
                  setSnackOpen(true);
                } else {
                  console.error("Copy failed");
                }
              } catch (e) {
                console.error("Copy failed", e);
              }
            }}
          >
            <Clipboard fontSize="24" />
          </button>

        </div>
        <div>{alias}</div>
      </div>
      <br />

      <SnackBar
        open={snackOpen}
        setOpen={() => setSnackOpen(false)}
        message={snackMessage}
        width={"20px"}
        height={"50px"}
      />
    </div>
  );
}
