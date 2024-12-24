class FancyText
{
    static slowPrint(text, element)
    {       
        setTimeout((text, element) => {
            element.innerHTML += text.charAt(0);
            text = text.slice(1);
            if (text.length > 0 && document.body.contains(element))
            {
                FancyText.slowPrint(text, element);
            }
        }, 50, text, element);
    }
}
