# Variants
Following is example for using variants:

- Tailwind-ts Stylesheet object 
```
    import { twStyleSheet } from "./tws";

    export const styles = twStyleSheet({
        title: {
            default: ["text-green-300"],
            hover: ["hover:text-amber-700"],
            variants:{
                primary:["!text-amber-400"],
                secondary:{
                    default:["!text-amber-200"],
                    "2xl": ["2xl:mb-4"],
                    "md"{
                        default: ["md:text-amber-200"]
                        focus:["md:focus:!text-amber-400"]
                    }
                }
            }
        },
    });

   ```
- Start using your styles as following
   ```
    import { styles } from "./App.tws";

    function App() {
        return (
            <div className={styles.title["primary"]}>
            Hello World
            <div className={styles.title["secondary"]}>Subtitle</div>
            </div>
        );
    }

    export default App;
   ```