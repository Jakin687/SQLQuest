(()=>{
    const info = {
        level: 0,
        name: "Level 0",
        story: "Du befindest dich auf der Webseite einer kleinen Bibliothek. Du siehst ein Suchfeld, in das du den Namen eines Buches eingeben kannst. Dein Ziel ist es, durch eine SQL-Injection Zugriff auf die Datenbank der Bibliothek zu erhalten und die Liste aller Bücher auszulesen. <b>Wie viele Bücher gibt es?</b>",
        tips: [
            "Ein Fehler erscheint in der Browser-Konsole, der dir den Tabellennamen verrät: 'books'",
            "Du bemerkst, dass die Eingaben im Suchfeld nicht richtig gefiltert werden. Versuche, eine einfache SQL-Injection wie \"' OR '1'='1\" einzugeben."
        ],
        json: `{"name": "BibDB","tables": [{"name": "books","columns": ["bookId", "title", "authorId", "year", "genre", "isbn"],"rows": [[1, "Der Alchemist", 1, 1988, "Fiction", "978-0061122415"],[2, "Siddhartha", 2, 1922, "Philosophical Fiction", "978-0553208849"],[3, "1984", 3, 1949, "Dystopian", "978-0451524935"],[4, "Die Verwandlung", 4, 1915, "Novella", "978-0140184787"],[5, "Harry Potter und der Stein der Weisen", 5, 1997, "Fantasy", "978-3551551672"]]},{"name": "authors","columns": ["authorId", "name", "year", "nationality"],"rows": [[1, "Paulo Coelho", 1947, "Brasilianisch"],[2, "Hermann Hesse", 1877, "Deutsch"],[3, "George Orwell", 1903, "Britisch"],[4, "Franz Kafka", 1883, "Österreichisch-Ungarisch"],[5, "J.K. Rowling", 1965, "Britisch"]]}]}`,
        solution: "5"
    }

    const db = SQLDatabase.fromJsonString(info.json);

    buildSuccessWindow = () => {
        return new UIPopUp(
            0, 0,
            "Correct!",
            "Correct, the database contains 5 books. The next level will be loaded in a few seconds ..."
        );
    };

    buildFailWindow = () => {
        return new UIPopUp(
            0, 0,
            "Incorrect!",
            "Incorrect, the database dosen't contain that amount of books.",
            POPUPTYPES.WARNING
        );
    };

    buildLevelWindow = () => {
        let levelWindow = new UIWindow(null, null, 800, 700, info.name, true);
        levelWindow.onclose(() => {
            window.mainWindow.addContent(window.titleScreen);
            window.titleScreen.centerToParent();
            document.head.lastChild.remove();
        });
        return levelWindow;
    };

    buildWebsiteWindow = () => {
        let challengeContainer = new UIElement("div");
        challengeContainer.style("width", "calc(100% - 0px)");
        challengeContainer.style("height", "calc(100% - 0px)");
        challengeContainer.style("grid-column", "1");
        challengeContainer.style("grid-row", "1");
        challengeContainer.style("display", "flex");
        challengeContainer.style("justify-content", "center");
        challengeContainer.style("border-bottom", "1px solid var(--secondary-color)");
        challengeContainer.style("border-right", "1px solid var(--secondary-color)");

        let challengeInnerContainer = new UIElement("div");
        challengeInnerContainer.style("width", "100%");
        challengeInnerContainer.style("margin", "20px 30px");
        challengeInnerContainer.appendTo(challengeContainer);

        let inputContainer = new UIElement("div");
        inputContainer.style("width", "100%");
        inputContainer.style("height", "min-content");
        inputContainer.style("display", "flex");
        inputContainer.style("justify-content", "space-between");
        inputContainer.appendTo(challengeInnerContainer);

        let input = new UIElement("input");
        input.attr("type", "text");
        input.attr("placeholder", "Enter name of a book")
        input.appendTo(inputContainer);

        function log(str)
        {
            (new UIElement("#console")).appendChild(new UIElement("span", str));
        }

        let searchButton = new UIElement("button", "Search");
        searchButton.appendTo(inputContainer);
        searchButton.addEvent("click", () => {
            console.log(input.element.value);
            let statement = `select title, year, genre, isbn from books where title = '${input.element.value}';`;
            try
            {
                let result = db.execute(statement);

                console.log(result);

                if (!result.empty())
                {
                    log("Executed SQL-Statement: Found Results");


                }
                else
                {
                    log("Executed SQL-Statement: Nothing was found");
                }
            } catch (e)
            {
                log(e.toString());   
            }
        });

        let results = new UIElement("table");

        return challengeContainer;
    };

    buildStoryWindow = () => {
        let storyContainer = new UIElement("div");
        storyContainer.style("display", "flex");
        storyContainer.style("flex-direction", "column");
        storyContainer.style("width", "100%");
        storyContainer.style("height", "100%");
        storyContainer.style("grid-column", "1");
        storyContainer.style("grid-row", "2");
        storyContainer.style("border-top", "1px solid var(--secondary-color)");
        storyContainer.style("border-right", "1px solid var(--secondary-color)");

        let storyInnerContainer = new UIElement("div");
        storyInnerContainer.style("max-width", "100%");
        storyInnerContainer.style("margin", "20px 30px");
        storyInnerContainer.appendTo(storyContainer);

        let textConainer = new UIElement("p");
        textConainer.appendTo(storyInnerContainer);

        (new UIElement("hr")).appendTo(storyInnerContainer);

        let inputContainer = new UIElement("div");
        inputContainer.style("width", "100%");
        inputContainer.style("height", "min-content");
        inputContainer.style("display", "flex");
        inputContainer.style("justify-content", "space-between");
        inputContainer.appendTo(storyInnerContainer);

        let solutionInput = new UIElement("input");
        solutionInput.attr("type", "text");
        solutionInput.appendTo(inputContainer);
        solutionInput.attr("placeholder", "Solution is a number")

        let solutionButton = new UIElement("button", "Submit");
        solutionButton.appendTo(inputContainer);
        solutionButton.addEvent("click", () => {
            let popUp;

            if (solutionInput.element.value == info.solution)
            {
                popUp = buildSuccessWindow();
                setTimeout(() => {
                    LocalStorageHandler.set(window.keys.gameProgression, info.level+1);
                    levelWindow.destroy();
                    document.head.lastChild.remove();
                    let levelScript = new UIElement("script");
                    levelScript.attr("src", `levels/level${info.level+1}.js`);
                    levelScript.appendTo("head");
                }, 2000);
            }
            else
            {
                popUp = buildFailWindow();
            }

            mainWindow.addContent(popUp);
            popUp.centerToParent();
        });

        FancyText.slowPrint(info.story, textConainer.element);

        return storyContainer;
    };

    buildBrowserConsole = () => {
        let browserConsoleContainer = new UIElement("div");
        browserConsoleContainer.style("display", "flex");
        browserConsoleContainer.style("flex-direction", "column");
        browserConsoleContainer.style("width", "100%");
        browserConsoleContainer.style("height", "100%");
        browserConsoleContainer.style("grid-column", "2");
        browserConsoleContainer.style("grid-row-start", "1");
        browserConsoleContainer.style("grid-row-end", "3");
        browserConsoleContainer.style("border-left", "1px solid var(--secondary-color)");

        let browserConsoleInnerContainer = new UIElement("div");
        browserConsoleInnerContainer.attr("id", "console");
        browserConsoleInnerContainer.style("display", "flex");
        browserConsoleInnerContainer.style("flex-direction", "column");
        browserConsoleInnerContainer.style("max-width", "100%");
        browserConsoleInnerContainer.style("height", "100%");
        browserConsoleInnerContainer.style("overflow-y", "scroll");
        browserConsoleInnerContainer.style("margin", "20px 30px");
        browserConsoleInnerContainer.appendTo(browserConsoleContainer);

        return browserConsoleContainer;
    };

    buildLevel = () => {
        let grid = new UIElement("div");
        grid.style("display", "grid");
        grid.style("grid-template-columns", "60% 40%");
        grid.style("grid-template-rows", "50% 50%");
        grid.style("width", "100%");
        grid.style("height", "100%");

        let challenge = buildWebsiteWindow();
        challenge.appendTo(grid);

        let story = buildStoryWindow();
        story.appendTo(grid);

        let browserConsole = buildBrowserConsole();
        browserConsole.appendTo(grid);

        return grid;
    };

    let mainWindow = window.mainWindow;
    let levelWindow = buildLevelWindow();
    mainWindow.addContent(levelWindow);
    levelWindow.centerToParent();
    levelWindow.addContent(buildLevel());
})();
