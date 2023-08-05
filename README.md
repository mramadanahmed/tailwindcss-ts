# ⚠️ Important note
The package still in its early stage and not ready for large scale use. The current versions only for testing the feasibility of that package

We are happy to hear from you all! For any recommendation or feedback, please find me on twitter [@mramadanahmed](https://twitter.com/mramadanahmed)

# 📚 Tailwindcss-ts
Tailwindcss-ts follow the simple concept of tailwind of generate the utility classes on demand to create a type-safe for it. In addition to utility functions help you to implement your tailwindcss and never use 'className' prop as normal string. The main focus of tailwindcss-ts library is consider your custom tailwindcss configuration [...Read more](./docs/introduction.md)

# 🚀 Get Started
1. Once you have your website ready with tailwindcss installed
2. Install and run tailwind-ts 
   ```
   npm i tailwindcss-ts@latest
   ```
3. Run generate clis
   ```
   npx tailwindcss-ts
   ```
4. Once it is done, `src/tws` folder will be generated on the root with the tailwind types and utilities for creating your classes
5. In `tailwind.config.js` modify the content property to watch only the files of type `./src/**/*.tws.ts`
6. Create as many as tws.ts files as following
   ```
    import tws from "./tws";

    export const styles = tws.twsCreateStyleSheet({
        title: ["p-9", "text-amber-400"],
        subTitle: {
            default: ["text-green-300"],
            hover: ["hover:text-amber-700"],
            md: ["md:!text-black"],
            "2xl": ["2xl:mb-1"],
        },
    });

   ```
7. Start using your styles as following
   ```
    import { styles } from "./App.tws";

    function App() {
        return (
            <div className={styles.title}>
            Hello World
            <div className={styles.subTitle}>Subtitle</div>
            </div>
        );
    }

    export default App;
   ```

# 🎛️ Features
1. Type-safe
2. Tailwind Custom Configuration
3. [Variants](./docs/variants.md)
4. [Conditional Styles](./docs//conditional.md)
  

# ⚙️ Configuration
Create a file with name `tws.json` so you can customize tailwindcss-ts main functionality as following
```
{
  "tailwindConfig": "./tailwind.config.js",
  "tempDir":"./tws-temp"
  "outputSrc": "./src/tws",
  "customClasses": [
    "pt-[150px]"
  ]
}
```

# 🥷 Contributions
Every one is welcomed to contribute on that package by raising a PR. Here is steps to run it locally
1. Clone the [github repo](https://github.com/mramadanahmed/tailwindcss-ts)
2. Run `pnpm i`
3. Run `pnpm start`
   

# 🧵 Bugs, Issues and Feedback
Please submit [a new issue](https://github.com/mramadanahmed/tailwindcss-ts/issues/new) at github for any kind of discussion related to that package. Looking forward to get in touch very soon
