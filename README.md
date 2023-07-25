# ⚠️ Important note
The package still in its early stage and not ready for large scale use. The current versions only for testing the feasibility of that package

We are happy to hear from you all! For any recommendation or feedback, please find me on twitter [@mramadanahmed](https://twitter.com/mramadanahmed)


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
1. Clone the [https://github.com/mramadanahmed/tailwindcss-ts](github repo) 
2. Run `pnpm i`
3. Run `pnpm start`
   

# 🧵 Bugs, Issues and Feedback
Please submit a [https://github.com/mramadanahmed/tailwindcss-ts/issues/new](issue) at github for any kind of discussion related to that package. Looking forward to get in touch very soon


# 📚 Tailwindcss-ts

The tailwindcss library is amazing solution to manage your css files, you will need only minimum to none of css files. In fact tailwindcss not only for manage how you implement your websites css but it provide you a full design system where you can control your standard spacing, coloring schemes, fonts, responsive screens, ....etc. The simple idea of tailwindcss is making a big impact on your website. It is managing style through utility classes and generate it for you on demand, that noticeably enhance your website pages' performance

The alternative prior technology to tailwindcss was styled-components. We can't deny the popularity and advantages of styled-components. It gives you also a complete design system if you are using through framework like Chakra UI. 

## Problem
Although Tailwindcss give you that power over css, it is lack visibility over team work. Developers easily will start have their own px generated classes and by the time your design system become obsolete and hard to manage. Specially when the projects scaled up and tight time of delivery is always their to push team member to just do their job no matter how. 

styled-components like Chakra UI provide a solution for that by providing a type safe props to the components to give the style, however it add a very overhead on your pages' bundles and the performance for your website goes down. 

For both solutions if you decide your design system for example by removing some colors, there is no visibility which components will get effected and it might fail to get its right style until it reaches the production

## Solution
There are many trial to make tailwindcss type-safe or having linting rules for it but its problem it hard to manage your custom tailwindcss configuration to implement your own design system as it is hard to manage all of that through one fixed huge and advanced typescript tricks. 

Tailwindcss-ts follow the simple concept of tailwind of generate the utility classes on demand to create a type-safe for it. In addition to utility functions help you to implement your tailwindcss and never use 'className' prop as normal string. The main focus of tailwindcss-ts library is consider your custom tailwindcss configuration
