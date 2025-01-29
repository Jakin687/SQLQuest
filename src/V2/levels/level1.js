(()=>{
    const info = {
        level: 1,
        name: "Operation: TechSolutions Breach",
        story: "You have been hired by a small business named 'TechSolutions' as an ethical hacker. You need to see if you can bypass the user login. On the page, there are only two input fields username and password. <b>With what message are you greeted after a successful login?</b>",
        tips: [],
        json: `{"name":"TechSolutionsDB","tables":[{"name":"users","columns":["username","password"],"rows":[["Bob","1234"],["admin","oaWdf)/(1+2s"]]}]}`,
        solution: "So einfach mache ich dir das nicht! xD"
    }

    const db = SQLDatabase.fromJsonString(info.json);

    function buildSuccessWindow() {
        return new UIPopUp(
            0, 0,
            "Correct!",
            `Correct, you may now proceed to the next level!`
        );
    }

    function buildFailWindow() {
        return new UIPopUp(
            0, 0,
            "Incorrect!",
            "Incorrect, the message says something different",
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
        inputContainer.classList().add("inputContainer-col");
        inputContainer.appendTo(challengeInnerContainer);

        let username = new UIElement("input");
        username.attr("type", "text");
        username.attr("placeholder", "Enter username");
        username.appendTo(inputContainer);

        let password = new UIElement("input");
        password.attr("type", "text");
        password.attr("placeholder", "Enter password");
        password.appendTo(inputContainer);

        function log(str)
        {
            let entry = new UIElement("span", str);

            if (str.startsWith("SQLError"))
            {
                entry.classList("error");
            }

            (new UIElement("#console")).appendChild(entry);
        }

        let message = new UIElement("h2");

        let searchButton = new UIElement("button", "Login");
        searchButton.appendTo(inputContainer);
        searchButton.addEvent("click", () => {
            let statement = `select username from users where username = '${username.element.value}' and password = '${password.element.value}';`;
            try
            {
                let result = db.execute(statement);

                if (!result.empty())
                {
                    log("Login Successful!");
                    inputContainer.remove();
                    info.solution = `Hi there ${result.rows[0]._get("username")}!`;
                    message.innerHTML(info.solution);
                    message.appendTo(challengeInnerContainer);
                }
                else
                {
                    log("Wrong username or password");
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
        solutionInput.attr("placeholder", "Solution is a string");

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
                    window.loadLevel(info.level+1);
                    document.head.lastChild.remove;
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
