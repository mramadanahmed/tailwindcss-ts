class TWSFactory {
    constructor() {
        this.twStyle = (...classNames) => {
            if (typeof classNames === "string")
                return classNames;
            else
                return classNames.join(" ");
        };
        this.twClasses = (classes) => {
            return Object.keys(classes)
                .map((key) => {
                return classes[key].join(" ");
            })
                .join(" ");
        };
        this.twCreateStyleSheet = (styleSheet) => {
            const result = {};
            Object.keys(styleSheet).forEach((key) => {
                if (Array.isArray(styleSheet[key])) {
                    result[key] = this.twStyle(...styleSheet[key]);
                }
                else {
                    result[key] = this.twClasses(styleSheet[key]);
                }
            });
            return result;
        };
    }
}

export { TWSFactory };
