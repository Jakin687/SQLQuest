(()=>{
    this.buildMain = () => {
        let contentBox = new UIElement("div");
        contentBox.classList().add("content-box");
        contentBox.appendTo("body");
    
        let mainWindow = new UIWindow(null, null, null, null, "SQL Quest: Injection Mayhem", false);
        mainWindow.appendTo(contentBox);
        mainWindow.bar.close.addEvent("click", () => {window.close()});
        
        return mainWindow;
    };

    this.buildTitleScreen = () => {
        let titleScreen = new UIWindow(0, 0, 750, 500, "injection.exe", true);
        return titleScreen;
    };

    let mainWindow = this.buildMain();

    let titleScreen = this.buildTitleScreen();
    mainWindow.addContent(titleScreen);
    titleScreen.centerToParent();

    let a = new UIWindow(50, 0, 200, 300, "A", true);
    titleScreen.addContent(a);
    a.centerToParentVertical();

    let b = new UIWindow(50, 0, 300, 100, "B", true);
    titleScreen.addContent(b);
    b.centerToParentHorizontal();
})();
