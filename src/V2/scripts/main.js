(()=>{
    const keys = {
        gameProgression: "SQLQ_PROGRESSION",
        p: "SQLQ_P",
        q: "SQLQ_Q"
    };
    window.keys = keys;

    buildMain = () => {
        let contentBox = new UIElement("div");
        contentBox.classList().add("content-box");
        contentBox.appendTo("body");
    
        let mainWindow = new UIWindow(null, null, null, null, "SQL Quest: Injection Mayhem", false);
        mainWindow.appendTo(contentBox);
        mainWindow.onclose(() => {window.close()});
        
        return mainWindow;
    };

    buildTitleScreen = () => {
        let titleScreen = new UIWindow(0, 0, 400, 300, "injection.exe", true);
        titleScreen.classList().add("title-screen");
        titleScreen.toggleFlex();
        titleScreen.alignement(ALIGNEMENT.CENTER, ALIGNEMENT.CENTER);

        let controls = new UIElement("div");
        controls.classList().add("controls");

        let startButton = new UIElement("button", "[Start new game]");
        startButton.appendTo(controls);
        startButton.addEvent("click", startNewGame);

        if (LocalStorageHandler.exists(keys.gameProgression))
        {
            let continueButton = new UIElement("button", "[Continue last game]");
            continueButton.appendTo(controls);
        }

        let helpButton = new UIElement("button", "[Help]");
        helpButton.appendTo(controls);
        helpButton.addEvent("click", () => {
            let helpWindow = buildHelpWindow();
            mainWindow.addContent(helpWindow);
            helpWindow.centerToParent();
        });

        titleScreen.onclose(() => {
            let state = controls.classList().toggle("sudo");
            let cheatButton = new UIElement("button", "sudo su");

            if (!state) // Cheat exists already
            {
                controls.element.lastChild.remove();
            }
            else
            {
                cheatButton.classList().add("warning");
                cheatButton.addEvent("click", () => {
                    let alertNoti = new UIPopUp(null, null,
                        "Security Alert!",
                        "",
                        POPUPTYPES.ALERT);
                    FancyText.slowPrint(
                        "This action has been prohibited by the system administrator. Incident will be reported ...",
                        alertNoti.content.element);
                    mainWindow.addContent(alertNoti);
                    alertNoti.centerToParent();
                });
            }

            setTimeout(() => {
                if (state) cheatButton.appendTo(controls);
                mainWindow.addContent(titleScreen);
            }, 2000);
        });

        titleScreen.addContent(controls);
        return titleScreen;
    };

    buildHelpWindow = () => {
        let text = new UIElement("p",
            "An SQL injection is a type of cyber attack where malicious SQL code "+
            "is inserted into a query to manipulate a database. This can allow "+
            "attackers to access, modify, or delete data they shouldn’t be able "+
            "to. It’s like tricking the database into running harmful commands.<hr>"+
            "Imagine a website login form where you enter your username and password. "+
            "The website might use an SQL query like this to check your credentials:<br>"+
            "<code>SELECT * FROM users WHERE username = 'user' AND password = 'pass';</code><br>"+
            "If an attacker enters <code>user' OR '1'='1'; --</code> as the username and "+
            "anything as the password, the query becomes:<br>" +
            "<code>SELECT * FROM users WHERE username = 'user' OR '1'='1'; --' AND password = 'anything';</code>"+
            "<br>The condition <code>'1'='1'</code> is always true and the second part has been commented be the '--', so the query returns all users, potentially "+
            "giving the attacker access to the database.<hr>");

        let link = new UIElement("button", "[Wiki]");
        link.classList().add("link");
        link.attr("href", "https://de.wikipedia.org/wiki/SQL-Injection");
        link.addEvent("click", () => {window.open(link.attr("href"), "_blank")});
        return new UIPopUp(null, null, "What are SQL-Injections?", [text, link]);
    };

    startNewGame = () => {
        // TODO: Replace level0 with level1
        LocalStorageHandler.set(keys.gameProgression, 0);
        titleScreen.destroy();
        let levelScript = new UIElement("script");
        levelScript.attr("src", "levels/level0.js");
        levelScript.appendTo("head");
    };

    let mainWindow = buildMain();

    let titleScreen = buildTitleScreen();
    mainWindow.addContent(titleScreen);
    titleScreen.centerToParent();

    window.mainWindow = mainWindow;
    window.titleScreen = titleScreen;
})();
