class StageHandler
{
    constructor (stageElement, defaultScreen)
    {
        if (typeof stageElement === "string")
        {
            stageElement = document.querySelector(stageElement);
        }

        this.stageElement = stageElement;

        if (typeof defaultScreen === "string")
        {
            defaultScreen = document.querySelector(defaultScreen);
        }

        this.defaultScreen = defaultScreen;
    }

    switchStage(newStage) {}

    switchToDefault()
    {
        this.clear();
        this.defaultScreen.style.display = "block";
    }

    clear()
    {
        /*
        for (let element of this.stageElement.children)
        {
            element.innerHTML = "";
        }
        */

        this.defaultScreen.style.display = "none";
    }
}