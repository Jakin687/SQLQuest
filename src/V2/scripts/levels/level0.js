(()=>{
    const info = {
        name: "Level 0"
    }

    buildLevelWindow = () => {
        let levelWindow = new UIWindow(null, null, 800, 700, info.name, true);
        return levelWindow;
    };

    let mainWindow = new UIElement(".window").element.uiUtils; // Get Top Window
    let levelWindow = buildLevelWindow();
    mainWindow.addContent(levelWindow);
    levelWindow.centerToParent();
})();
