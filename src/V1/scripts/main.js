(function () {
    const strings = {
        classes: {
            mainStage: ".main-stage"
        },
        ids: {
            titleScreen: "#title-screen",
            continueBtn: "#btn-continue",
            startBtn: "#btn-start"
        },
        storageKeys: {
            SQLProgression: "SQL_PROGRESSION",
            SQLEncrypt: "SQL_ENCRYPTION_KEY",
            SQLDecrypt: "SQL_DECRYPTION_KEY"
        }
    };

    const stageHandler = new StageHandler(strings.classes.mainStage, strings.ids.titleScreen);

    this.startNew = function() {
        LocalStorageHandler.set(strings.storageKeys.SQLProgression, this.encrypt("0"));
        window.currentLevel = 0;
        this.loadLevel(currentLevel);
    };

    this.loadLevel = function(id) {
        let level = LEVELS[id];
        let stage = new StageBuilder()
            .title(level.title)
            .dom(level.dom)
            .problem(level.problem)
            .tips(level.tips.map(t => this.decrypt(t)))
            .solution(this.decrypt(level.solution))
            .build();
    };

    this.loadMain = function() {
        stageHandler.switchToDefault();
        if (!LocalStorageHandler.exists(strings.storageKeys.SQLProgression))
        {
            document.querySelector(strings.ids.continueBtn).style.display = "none";
        }
    };

    this.decrypt = function(encryptedString) {
        return encryptedString;
    };

    this.encrypt = function(string) {
        return string;
    };

    this.extend = function() {
        window.createPopUp = function(message, text) {
            let popup = document.createElement("div");
            popup.classList.add("popup");

            let titlebar = window.createTitleBar(message).titlebar;

            let content = document.createElement("div");
            content.classList.add("popup-content");
            content.innerHTML = text;

            popup.appendChild(titlebar);
            popup.appendChild(content);
            document.querySelector(".content-box").appendChild(popup);

            return popup;
        };

        window.createWarning = function(message, text) {
            window.createPopUp(message, text).classList.add("popup-warning");
        };

        window.createTitleBar = function(text) {
            let titlebar = document.createElement("div");
            titlebar.classList.add("title-bar");
            let title = document.createElement('span');
            title.innerHTML = text;
            let closeBtn = document.createElement('span');
            closeBtn.innerHTML = "[X]";
            closeBtn.onclick = function() {
                this.parentElement.parentElement.remove();
            };

            titlebar.appendChild(title);
            titlebar.appendChild(closeBtn);

            return {titlebar: titlebar, title: title, closeBtn: closeBtn};
        }
    };

    this.extend();
    this.loadMain();
})();

function moveWindowEvent(event) {
    
}