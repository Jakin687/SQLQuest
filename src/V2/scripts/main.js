let contentBox = new UIElement("div");
contentBox.classList().add("content-box");
contentBox.appendTo("body");


let mainWindow = new UIWindow(null, null, null, null, "SQL Quest: Injection Mayhem", false);
mainWindow.appendTo(contentBox);
mainWindow.bar.close.addEvent("click", () => {window.close()});
mainWindow.toggleFlex();
mainWindow.alignement(ALIGNEMENT.CENTER, ALIGNEMENT.CENTER)

let titleScreen = new UIWindow(null, null, 500, 500, "injection.exe", false);
mainWindow.addContent(titleScreen);

