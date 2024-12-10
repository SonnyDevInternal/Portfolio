let dropdownList = [];

class Drowpdown
{
    constructor(selfHtml) 
    {
        this.selfHtmlObj = selfHtml;
        this.active = false;

        this.children = this.GetChildren();
        this.btnHtmlObj = this.GetButtonObject();

        this.childrenStyleList = [];
    }

    static GetDropdownByBtn(element)
    {
        for(let f = 0; f < dropdownList.length; f++)
        {
            if(dropdownList[f].btnHtmlObj == element)
                return dropdownList[f];
        }

        return null;
    }

    GetChildren()
    {
        if(this.children == null)
        {
            this.children = Array.from(this.selfHtmlObj.querySelectorAll('*'));
        }

        return this.children;
    }

    GetButtonObject()
    {
        if(this.btnHtmlObj == null)
        {
            for(let f = 0; f < this.children.length; f++)
            {
                if(this.children[f].id === "PrgButton")
                {
                    let objOut = this.children[f];
                    removeFromList(this.children, f);
    
                    return objOut;
                }
            }
        }

        return this.btnHtmlObj;
    }

    UpdateVisibility()
    {
        if(this.active)
        {

        }
        else
        {

        }
    }

    OnClick()
    {
        console.log("clicked item with ID: " + this.selfHtmlObj.id);

        this.UpdateVisibility();

        this.active = !this.active;
    }
}

function collectPrgDropdowns()
{
    const elements = document.querySelectorAll('#PrgCplusplus, #PrgCSharp, #PrgJs, #PrgPhp');

                elements.forEach(element => 
                {
                    let dropdown = new Drowpdown(element);

                    dropdown.GetButtonObject().addEventListener('click', function(event) 
                    {
                        OnClickDropdown(event.target);
                    });

                    dropdownList.push(dropdown); 
                }
                );
}

function OnClickDropdown(self)
{
    let dropdowncurrent = Drowpdown.GetDropdownByBtn(self);

    if(dropdowncurrent)
    {
        dropdowncurrent.OnClick();
    }
    else
    {
        console.log("Drop down class Object wasnt found!");
    }
    
}

collectPrgDropdowns();