(()=>{
    const info = {
        level: 0,
        name: "Bibliotheks-Bandit: Einmal alles bitte",
        story: "Du befindest dich auf der Webseite einer kleinen Bibliothek. Du siehst ein Suchfeld, in das du den Namen eines Buches eingeben kannst. Dein Ziel ist es, durch eine SQL-Injection Zugriff auf die Datenbank der Bibliothek zu erhalten und die Liste aller Bücher auszulesen. <b>Wie viele Bücher gibt es?</b>",
        tips: [
            "Ein Fehler erscheint in der Browser-Konsole, der dir den Tabellennamen verrät: 'books'",
            "Du bemerkst, dass die Eingaben im Suchfeld nicht richtig gefiltert werden. Versuche, eine einfache SQL-Injection wie \"' OR '1'='1\" einzugeben."
        ],
        json: `{"name": "BibDB","tables": [{"name": "books","columns": ["bookId", "title", "authorId", "year", "genre", "isbn"],"rows": [[1, "Der Alchemist", 1, 1988, "Fiction", "978-0061122415"],[2, "Siddhartha", 2, 1922, "Philosophical Fiction", "978-0553208849"],[3, "1984", 3, 1949, "Dystopian", "978-0451524935"],[4, "Die Verwandlung", 4, 1915, "Novella", "978-0140184787"],[5, "Harry Potter und der Stein der Weisen", 5, 1997, "Fantasy", "978-3551551672"]]},{"name": "authors","columns": ["authorId", "name", "year", "nationality"],"rows": [[1, "Paulo Coelho", 1947, "Brasilianisch"],[2, "Hermann Hesse", 1877, "Deutsch"],[3, "George Orwell", 1903, "Britisch"],[4, "Franz Kafka", 1883, "Österreichisch-Ungarisch"],[5, "J.K. Rowling", 1965, "Britisch"]]}]}`,
        solution: "So einfach mache ich dir das nicht! xD"
    }

    const db = SQLDatabase.fromJsonString(info.json);

    function buildSuccessWindow() {
        return new UIPopUp(
            0, 0,
            "Correct!",
            "Correct, the database contains 5 books. The next level will be loaded in a few seconds ..."
        );
    }

    function buildFailWindow() {
        return new UIPopUp(
            0, 0,
            "Incorrect!",
            "Incorrect, the database dosen't contain that amount of books.",
            POPUPTYPES.WARNING
        );
    }

    function buildLevelWindow() {
        let levelWindow = new UIWindow(null, null, 800, 700, info.name, true);
        levelWindow.onclose(() => {
            window.mainWindow.addContent(window.titleScreen);
            window.titleScreen.centerToParent();
            document.head.lastChild.remove();
        });
        return levelWindow;
    }

    function buildWebsiteWindow() {
        let websiteContainer = new UIElement("div");
        websiteContainer.classList().add("websiteContainer");

        let challengeInnerContainer = new UIElement("div");
        challengeInnerContainer.classList().add("innerContainer");
        challengeInnerContainer.appendTo(websiteContainer);

        let inputContainer = new UIElement("div");
        inputContainer.classList().add("inputContainer");
        inputContainer.appendTo(challengeInnerContainer);

        let input = new UIElement("input");
        input.attr("value", "' or 1 = 1 --");
        input.attr("type", "text");
        input.attr("placeholder", "Enter name of a book");
        input.appendTo(inputContainer);

        let tableContainer = new UIElement("div");
        tableContainer.classList().add("tableContainer");
        tableContainer.appendTo(challengeInnerContainer);

        function log(str)
        {
            let entry = new UIElement("span", str);

            if (str.startsWith("SQLError"))
            {
                entry.classList("error");
            }

            (new UIElement("#console")).appendChild(entry);
        }

        let searchButton = new UIElement("button", "Search");
        searchButton.appendTo(inputContainer);
        searchButton.addEvent("click", () => {
            console.log(`Searching for: "${input.element.value}"`);
            let statement = `select title, year, genre, isbn from books where title = '${input.element.value}';`;
            try
            {
                let result = db.execute(statement);

                tableContainer.clear();
                tableContainer.appendChild(result.getAsHtmlTable());

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

        return websiteContainer;
    }

    function buildStoryWindow() {
        let storyContainer = new UIElement("div");
        storyContainer.classList("storyContainer");

        let storyInnerContainer = new UIElement("div");
        storyInnerContainer.classList("innerContainer");
        storyInnerContainer.appendTo(storyContainer);

        let textConainer = new UIElement("p");
        textConainer.appendTo(storyInnerContainer);

        (new UIElement("hr")).appendTo(storyInnerContainer);

        let inputContainer = new UIElement("div");
        inputContainer.classList("inputContainer");
        inputContainer.appendTo(storyInnerContainer);

        let solutionInput = new UIElement("input");
        solutionInput.attr("type", "text");
        solutionInput.appendTo(inputContainer);
        solutionInput.attr("placeholder", "Solution is a number")

        let solutionButton = new UIElement("button", "Submit");
        solutionButton.appendTo(inputContainer);
        solutionButton.addEvent("click", () => {
            let popUp;

            if (solutionInput.element.value == db._get("books").rows.length)
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
    }

    function buildBrowserConsole() {
        let browserConsoleContainer = new UIElement("div");
        browserConsoleContainer.classList("browserConsoleContainer");

        let browserConsoleInnerContainer = new UIElement("div");
        browserConsoleInnerContainer.attr("id", "console");
        browserConsoleInnerContainer.appendTo(browserConsoleContainer);

        return browserConsoleContainer;
    }

    function buildLevel() {
        let grid = new UIElement("div");
        grid.classList().add("levelContainer");

        let challenge = buildWebsiteWindow();
        challenge.appendTo(grid);

        let story = buildStoryWindow();
        story.appendTo(grid);

        let browserConsole = buildBrowserConsole();
        browserConsole.appendTo(grid);

        return grid;
    }

    let mainWindow = window.mainWindow;
    let levelWindow = buildLevelWindow();
    mainWindow.addContent(levelWindow);
    levelWindow.centerToParent();
    levelWindow.addContent(buildLevel());
})();
