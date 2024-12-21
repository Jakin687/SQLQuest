class UIElement
{
    constructor (e)
    {
        this.element = e;

        if (typeof e === "string")
        {
            this.element = (UIElement.validElements.includes(e)) ? document.createElement(e) : document.querySelector(e);
        }
        else if (e instanceof HTMLElement)
        {
            this.element = e;
        }
    }

    setAttribute(name, value)
    {
        this.element.setAttribute(name, value);
    }

    setId(id)
    {
        this.setAttribute("id", id);
    }

    classList()
    {
        return this.element.classList;
    }
    
    style()
    {
        return this.element.style;
    }

    remove()
    {
        this.element.remove();
    }
    
    innerHTML(content)
    {
        if (content === undefined)
        {
            return this.element.innerHTML;
        }

        this.element.innerHTML = content;
    }

    static appendThisTo(child, parent)
    {
        if (child instanceof UIElement)
        {
            child = child.element;
        }
        else if (child instanceof UIUtils)
        {
            child = child.element.element;
        }

        if (parent instanceof UIElement)
        {
            parent.element.appendChild(child);
        }
        else if (parent instanceof HTMLElement)
        {
            parent.appendChild(child);
        }
        else if (typeof parent === "string")
        {
            document.querySelector(parent).appendChild(child);
        }
        else if (parent instanceof UIUtils)
        {
            parent.element.element.appendChild(child);
        }
    }

    static appendToThis(parent, child)
    {
        UIElement.appendThisTo(child, parent);
    }

    appendTo(parent)
    {
        UIElement.appendThisTo(this, parent);
    }

    appendChild(child)
    {
        UIElement.appendToThis(this.element, child)
    }

    addEvent(name, f)
    {
        this.element.addEventListener(name, f);
    }

    removeEvent(name, f)
    {
        this.element.removeEventListener(name);
    }

    parentElement()
    {
        return this.element.parentElement;
    }

    children()
    {
        return this.element.children();
    }
}
UIElement.validElements=["html","title","header","main","footer","p","a","b","br","button","div","footer","h1","img","ol","ul","li","script","span","table","td","th","tr"];

class UIUtils
{
    remove()
    {
        this.element.remove();
    }

    appendTo(parent)
    {
        UIElement.appendThisTo(this.element, parent);
    }

    appendChild(child)
    {
        UIElement.appendToThis(this.element, child);
    }
}

class UIBar extends UIUtils
{
    constructor (title) {
        super();

        this.element = new UIElement("div");
        this.element.classList().add("title-bar");
        this.title = new UIElement("span");
        this.title.innerHTML(title);
        this.title.appendTo(this.element);
        this.close = new UIElement("span");
        this.close.innerHTML("[X]");
        this.close.addEvent("click", () => {this.element.parentElement().remove()});
        this.close.appendTo(this.element);
    }

    toggleMoveable()
    {
        this.element.classList().toggle("moveable");
    }
}

class UIWindow extends UIUtils
{
    constructor (x, y, width, height, title, moveable)
    {
        super();

        this.element = new UIElement("div");
        this.element.classList().add("window");
        if (x !== null)
        {
            this.element.style().top = `${x}px`;
        }
        if (y !== null)
        {
            this.element.style().left = `${y}px`;
        }

        this.bar = new UIBar(title);
        this.bar.appendTo(this.element);
        if (moveable)
        {
            this.bar.toggleMoveable();
        }

        this.content = new UIElement("div");
        this.content.classList().add("window-content");
        this.content.appendTo(this.element);

        if (width !== null)
        {
            this.element.style().width = `${width}px`;
            this.element.style().height = `${height}px`;

            width -= 2;
            height -= 2;

            this.content.style().width = `${width}px`;
            this.content.style().height = `calc(${height}px - 25px)`;
        }
        else
        {
            this.content.style().width = `calc(100% - 2px)`;
            this.content.style().height = `calc(100% - 27px)`;
            this.element.style().width = `100%`;
            this.element.style().height = `100%`;
        }

        this._flexMode = false;
    }

    toggleFlex()
    {
        if (this._flexMode)
        {
            this._flexMode = false;
            this.content.style().display = "block";
            return;
        }
        
        this._flexMode = true;
        this.content.style().display = "flex";
    }

    alignement(horizontal, vertical)
    {
        this.content.style()["justify-content"] = horizontal;
        this.content.style()["align-items"] = vertical;
    }

    addContent(element)
    {
        this.content.appendChild(element);
    }
}
ALIGNEMENT = {TOP: "top", CENTER: "center", BOTTOM: "bottom", LEFT: "left", RIGHT: "right"};
