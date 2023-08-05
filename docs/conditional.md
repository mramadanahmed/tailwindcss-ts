# Variants
Following is example for using variants:

- Tailwind-ts Stylesheet object 
```
    import { twStyleSheet } from "./tws";

    export const styles = twStyleSheet({
         title: {
            type:'callback'
            callbackParameters:{disabled:""}
            callback({disabled}) => ({
                default:[{test:disabled,value:["text-green-300"]}]
            })
        },
        subtitle: {
            type:'callback'
            callbackParameters:{disabled:""}
            callback({disabled}) => ({
                default:[{test:disabled,value:["text-green-300"]}]
                variants: {
                    primary:[
                        {test:disabled,value:["text-green-200"]},{test:!disabled,value:["text-green-400"]}
                    ]
                }
            })
        },
    });

   ```
- Start using your styles as following
   ```
    import { styles } from "./App.tws";

    function App() {
        const [disabled,setIsDisabled] = useState(false);
        return (
            <div className={styles.title({disabled})}>
            Hello World
            <div className={styles.subtitle({disabled})["primary"]}>Subtitle</div>
            <button onClick={() => setIsDisabled(disabled)}>Toggle Disable</button>
            </div>
        );
    }

    export default App;
   ```