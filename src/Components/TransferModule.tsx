import TransferModuleStyle from "./TransferModule.module.css";

type Props = {
  main?: React.ReactNode;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
};

export default function TransferModule({ main, aside, footer, header }: Props) {
  return (
    <div className={TransferModuleStyle.container}>
      {header && <div className={TransferModuleStyle.header}>{header}</div>}
      {main && (
        <div className={TransferModuleStyle.content}>
          <div className={TransferModuleStyle.innerContent}>{main}</div>
        </div>
      )}
      {aside && <div className={TransferModuleStyle.aside}>{aside}</div>}
      {footer && <div className={TransferModuleStyle.footer}>{footer}</div>}
    </div>
  );
}
