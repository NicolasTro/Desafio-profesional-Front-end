import styles from "./Error.module.css"
import ErrorSign from "../../public/Error.svg"

type ErrorProps = {
    title1?: string;
    message1?: string;
    message2?: string;
}
export default function Error({ title1, message1, message2 }: ErrorProps) {

    return (

        <div className={styles.content}>
            <div><ErrorSign fontSize={40} color="red" /></div>
            <div className={styles.title}>
                {title1}
            </div>
            <hr className={styles.divider2} />
            <div className={styles.message}>{message1} <br />
                {message2}
            </div>
        </div>
    )
}