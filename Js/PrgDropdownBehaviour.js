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

    static GetDropdownByElement(element)
    {
        for(let f = 0; f < dropdownList.length; f++)
        {
            if(dropdownList[f].btnHtmlObj == element)
                return dropdownList[f];

            let childrenCache = dropdownList[f].children;

            for(let q = 0; q < childrenCache.length; q++)
            {
                if(childrenCache[q] == element)
                    return dropdownList[f];
            }
                
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

    UpdateChildren(visible)
    {
        let childrenCache = this.GetChildren();

        if(visible)
        {
            for(let i = 0; i < childrenCache.length; i++)
            {
                childrenCache[i].style.visibility = this.childrenStyleList[i];
            }

            this.childrenStyleList = [];
        }
        else
        {
            for(let i = 0; i < childrenCache.length; i++)
            {
                let currentChild = childrenCache[i];

                this.childrenStyleList[i] = currentChild.style.visibility;
                currentChild.style.visibility = "hidden";
            }
        }
    }

    UpdateVisibility(visible)
    {
        this.UpdateChildren(visible);

        if(!visible)
        {
            
        }
        else
        {

        }
    }

    OnClick()
    {
        console.log("clicked item with ID: " + this.selfHtmlObj.id);
        console.log("show item? : " + this.active);

        this.UpdateVisibility(this.active);

        this.active = !this.active;
    }
}

function collectPrgDropdowns()
{
    const elements = document.querySelectorAll('.PrgLanguage');

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
    let dropdowncurrent = Drowpdown.GetDropdownByElement(self);

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