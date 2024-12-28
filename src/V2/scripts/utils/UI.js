class UIElement
{
    constructor (e, inner)
    {
        this.element = e;

        if (typeof e === "string")
        {
            if (UIElement.validElements.includes(e))
            {
                this.element = document.createElement(e);
                if (e == "button")
                {
                    this.attr("type", "button");
                }
            }
            else
            {
                this.element = document.querySelector(e);
            }
        }
        else if (e instanceof HTMLElement)
        {
            this.element = e;
        }

        if (inner !== undefined)
        {
            this.innerHTML(inner);
        }

        this.element.uiElement = this;
    }

    setId(id)
    {
        this.setAttribute("id", id);
    }

    classList()
    {
        return this.element.classList;
    }
    
    style(attribute, value)
    {
        if (attribute !== undefined && value !== undefined)
        {
            this.element.style[attribute] = value;
            return;
        }
        else if (attribute !== undefined)
        {
            return this.element.style[attribute];
        }
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

    outerHTML()
    {
        return this.element.outerHTML;
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

    uiParent()
    {
        return new UIElement(this.parentElement());
    }

    children()
    {
        return this.element.children;
    }

    boundingRect()
    {
        return this.element.getBoundingClientRect();
    }

    left(x)
    {
        if (x !== undefined)
        {
            this.element.style.left = `${x}px`;
            return;
        }

        return this.boundingRect().left;
    }

    top(y)
    {
        if (y !== undefined)
        {
            this.element.style.top = `${y}px`;
            return;
        }

        return this.boundingRect().top;
    }

    width()
    {
        return this.boundingRect().width;
    }

    height()
    {
        return this.boundingRect().height;
    }

    attr(name, value)
    {
        if (value === undefined)
        {
            return this.element.getAttribute(name);
        }

        this.element.setAttribute(name, value);
    }

    clear()
    {
        for (let child of this.children())
        {
            child.remove();
        }
    }
}
UIElement.validElements=["html","title","header","main","footer","p","a","b","br","button","div","footer","h1","img","ol","ul","li","script","span","table","td","th","tr","input","hr"];

class UIUtils
{
    constructor (element)
    {
        this.element = element;

        if (this.element === undefined)
        {
            this.element = new UIElement("div");
        }

        this.element.element.uiUtils = this; // Replace UIElement with this
    }

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

    classList()
    {
        return this.element.classList();
    }
}

class UIBar extends UIUtils
{
    constructor (title) {
        super();

        this.element.classList().add("title-bar");
        this.title = new UIElement("span");
        this.title.innerHTML(title);
        this.title.appendTo(this.element);
        this.close = new UIElement("span");
        this.close.innerHTML("[X]");
        this.close.addEvent("click", this.destroy);
        this.close.appendTo(this.element);
    }

    destroy()
    {
        let bar = this.element; // JS CloseEvent bar.destroy()

        if (!(bar instanceof UIElement)) // HTML CloseEvent (User Click)
        {
            bar = this.uiElement.parentElement().uiElement;
        }

        bar.parentElement().classList.add("closing");
        bar.uiParent().addEvent("animationend", () => {
            bar.parentElement().classList.remove("closing");
            bar.parentElement().remove();
        });
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

        this.element.classList().add("window");
        if (x !== null)
        {
            this.element.style().left = `${x}px`;
        }
        if (y !== null)
        {
            this.element.style().top = `${y+25}px`;
        }

        this.bar = new UIBar(title);
        this.bar.appendTo(this.element);

        this.content = new UIElement("div");
        this.content.classList().add("window-content");
        this.content.appendTo(this.element);

        if (width !== null && height !== null)
        {
            this.element.style().width = `${width}px`;
            this.element.style().height = `${height}px`;

            width -= 2;
            height -= 2;

            this.content.style().width = `${width}px`;
            this.content.style().height = `calc(${height}px - 25px)`;
        }
        else if (width !== null)
        {
            this.element.style().width = `${width}px`;
            width -= 2;
            this.content.style().width = `${width}px`;
        }
        else
        {
            this.content.style().width = `calc(100% - 2px)`;
            this.content.style().height = `calc(100% - 27px)`;
            this.element.style().width = `100%`;
            this.element.style().height = `100%`;
        }

        this._flexMode = false;

        if (moveable)
        {
            this.toggleMoveable();
        }
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

    centerToParentHorizontal()
    {
        if (this.element.parentElement() === null) return;
        this.element.style().left = `${this.element.uiParent().width() / 2 - this.element.width() / 2}px`;
    }

    centerToParentVertical()
    {
        if (this.element.parentElement() === null) return;
        this.element.style().top = `${this.element.uiParent().height() / 2 - this.element.height() / 2}px`;
    }

    centerToParent()
    {
        this.centerToParentHorizontal();
        this.centerToParentVertical();
    }

    toggleMoveable()
    {
        this.bar.toggleMoveable();

        if (this.bar.classList().contains("moveable"))
        {
            this.bar.element.addEvent("mousedown", (event) => {
                event.preventDefault();

                let target = event.target;

                if (target.innerHTML == "[X]") // TODO: find better way to do this
                {
                    target.click();
                    return;
                }

                if (target.tagName == "SPAN")
                {
                    target = target.parentElement;
                }

                target.boundary = new UIElement(target.parentElement.parentElement);
                target.uiElement = new UIElement(target);

                target.boundary.appendChild(target.parentElement);

                target.mx = event.clientX;
                target.my = event.clientY;
                target.px = target.uiElement.left();
                target.py = target.uiElement.top();

                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };

                document.onmousemove = (event) => {
                    event.preventDefault();                    

                    let x = event.clientX - target.boundary.left();
                    let y = event.clientY - target.boundary.top();
                    
                    target.parentElement.style.left = `${Math.min(Math.max(target.px - (target.mx - x), 0), target.boundary.width() - target.uiElement.width())}px`;
                    target.parentElement.style.top = `${Math.min(Math.max(target.py - (target.my - y), 0), target.boundary.height() - target.uiElement.height())}px`;
                };
            });

            return true;
        }

        this.bar.element.removeEvent("mousedown");

        return false;
    }

    onclose(f)
    {
        this.bar.close.addEvent("click", f);
    }

    destroy()
    {
        this.bar.destroy(); // Close window without triggering additional onCloseEvents
    }
}
ALIGNEMENT = {TOP: "top", CENTER: "center", BOTTOM: "bottom", LEFT: "left", RIGHT: "right", SPACE_AROUND: "space-around", SPACE_BETWEEN: "space-between"};

class UIPopUp extends UIWindow
{
    constructor (x, y, title, message, type)
    {
        super(x, y, 460, null, title, true);

        this.element.classList().add("popup");
        this.content.style().width = "unset";
        this.content.style().maxWidth = "458px";

        if (type !== undefined)
        {
            this.element.classList().add(type);
        }

        this.message = new UIElement("div");
        if (typeof message === "string")
        {
            this.message.innerHTML(message);
        }
        else if (message instanceof Array)
        {
            message.forEach(e => this.message.appendChild(e));
        }
        else
        {
            this.message.appendChild(message);
        }

        this.addContent(this.message);
    }
}
POPUPTYPES = {INFO: "", WARNING: "warning", ALERT: "alert", TIP: "tip"};

