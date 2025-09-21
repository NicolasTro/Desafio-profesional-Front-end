import style from "./Card.module.css";

type CardProps = {
  title: string;
  content: string;
};

export default function Card({ title, content }: CardProps) {
  return (
    <div className={style.card}>
      <h2>{title}</h2>
      <hr className={style.divider} />
      <p>{content}</p>
    </div>
  );
}
