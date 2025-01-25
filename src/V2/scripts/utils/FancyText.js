class FancyText
{
    static slowPrint(text, element)
    {       
        setTimeout((text, element) => {
            let char = text.charAt(0);
            let addToText = true;

            if (char == "<")
            {
                char = text.substring(0, text.indexOf(">") + 1);
                addToText = false;
                
                if (char.includes("/"))
                {
                    element = element.parentElement;
                }
                else
                {
                    let newElement;

                    if (char.includes(" "))
                    {
                        newElement = new UIElement(char.substring(1, char.indexOf(" ")));
                        let attributes = char.substring(char.indexOf(" ")+1, char.length-1);

                        for (let attribute of attributes.matchAll(/[a-zA-Z]+ ?= ?["'][a-zA-Z\d\-_: ]+?["']/g))
                        {
                            attribute = attribute[0].split("=");
                            newElement.attr(attribute[0], attribute[1].replaceAll(/["']/g, ""));
                        }
                    }
                    else
                    {
                        newElement = new UIElement(char.substring(1, char.length-1));
                    }

                    newElement.appendTo(element);
                    element = newElement.element;
                }
            }

            text = text.slice(char.length);

            if (addToText)
            {
                element.innerHTML += char;
            }

            if (text.length > 0 && document.body.contains(element))
            {
                FancyText.slowPrint(text, element);
            }
        }, 10, text, element);
    }
}
