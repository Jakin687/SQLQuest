(()=>{
    const info = {
        name: "Level 0",
        story: "Du befindest dich auf der Webseite einer kleinen Bibliothek. Du siehst ein Suchfeld, in das du den Namen eines Buches eingeben kannst. Dein Ziel ist es, durch eine SQL-Injection Zugriff auf die Datenbank der Bibliothek zu erhalten und die Liste aller Bücher auszulesen.",
        tips: [
            "Ein Fehler erscheint in der Browser-Konsole, der dir den Tabellennamen verrät: 'books'",
            "Du bemerkst, dass die Eingaben im Suchfeld nicht richtig gefiltert werden. Versuche, eine einfache SQL-Injection wie \"OR '1'='1\" einzugeben."
        ]
    }

    buildLevelWindow = () => {
        let levelWindow = new UIWindow(null, null, 800, 700, info.name, true);
        levelWindow.onclose(() => {
            window.mainWindow.addContent(window.titleScreen);
            document.head.lastChild.remove();
        });
        return levelWindow;
    };

    buildLevel = () => {
        let grid = new UIElement("div");
        grid.style("display", "grid");
        grid.style("grid-template-columns", "60% 40%");
        grid.style("grid-template-rows", "50% 50%");
        grid.style("width", "100%");
        grid.style("height", "100%");

        let challengeContainer = new UIElement("div");
        challengeContainer.style("background-color", "blue");
        challengeContainer.style("width", "calc(100% - 40px)");
        challengeContainer.style("height", "calc(100% - 60px)");
        challengeContainer.style("grid-column", "1");
        challengeContainer.style("grid-row", "1");
        challengeContainer.style("display", "flex");
        challengeContainer.style("justify-content", "center");
        challengeContainer.style("padding", "20px 30px");
        challengeContainer.appendTo(grid);

        let inputContainer = new UIElement("div");
        inputContainer.style("width", "100%");
        inputContainer.style("height", "min-content");
        inputContainer.style("display", "flex");
        inputContainer.style("justify-content", "space-between");
        inputContainer.appendTo(challengeContainer);

        let input = new UIElement("input");
        input.attr("type", "text");
        //input.style("width", "calc(100% - 22px)");
        input.appendTo(inputContainer);

        let searchButton = new UIElement("button", "Search");
        searchButton.appendTo(inputContainer);

        return grid;
    };

    let mainWindow = window.mainWindow; // Get Top Window
    let levelWindow = buildLevelWindow();
    mainWindow.addContent(levelWindow);
    levelWindow.centerToParent();
    levelWindow.addContent(buildLevel());
})();
