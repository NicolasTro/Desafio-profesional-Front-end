export default function NameTag({ name, className }: { name: string; className?: string }) {
  return (
    <div className={`${className ?? ''}`}>
      <span className="name">{name}</span>
    </div>
  );
}
