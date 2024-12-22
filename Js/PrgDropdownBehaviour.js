let dropdownList = [];

class Drowpdown
{
    static hiddenLogoPath = "https://www.svgrepo.com/show/421575/question-mark.svg";
    static grayColor = new Color(209, 209, 209, 255);

    constructor(selfHtml) 
    {
        this.selfHtmlObj = selfHtml;
        this.active = false;

        this.firstTime = false;

        //Read Only style!
        let stylReference = window.getComputedStyle(selfHtml);

        this.originalColor = Color.stringToColor(stylReference.backgroundColor);
        
        this.orignalImgPath = this.GetLanguageLogo().src;
        this.logoStyles = {};

        let logoStyleRef = window.getComputedStyle(this.GetLanguageLogo());

        for (let style of logoStyleRef) {
            this.logoStyles[style] = logoStyleRef.getPropertyValue(style);
        }

        this.children = this.GetChildren();
        this.btnHtmlObj = this.GetButtonObject();

        this.childrenStyleList = [];
        this.callbackList = [];

        this.colorswitcher = new HtmlColorSwitcher(selfHtml, () => this.OnInternalReadyCallback());
    }

    static GetAllDropdowns() //returns a copyied list of all Dropdowns
    {
        let dropdownsOut = [...dropdownList];
        return dropdownsOut;
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

    IsReady()
    {
        return this.colorswitcher.IsReady();
    }

    AddOnReadyCallback(callback)
    {
        if(typeof callback === 'function')
            this.callbackList.push(callback);
        else
            LogError("callback passed wasnt a function! it was: " + typeof callback);
    }

    RemoveOnReadyCallback(callback)
    {
        if(typeof callback === 'function')
            removeFromListSearch(this.callbackList, callback);
        else
        LogError("callback passed wasnt a function! it was: " + typeof callback);
    }

    OnInternalReadyCallback() //when is finished, call all callbacks
    {
        Log("finished Callback!");

        for(let l = 0; l < this.callbackList.length; l++)
        {
            this.callbackList[l](this, this.active);
        }
    }

    GetLanguageLogo()
    {
        return this.selfHtmlObj.parentElement.querySelector('img');
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

                    let buttonChildren = Array.from(objOut.querySelectorAll('*')); //exclude Button Children from list

                    for(let c = 0; c < buttonChildren.length; c++)
                    {
                        removeFromListSearch(this.children, buttonChildren[c]);
                    }
    
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

    UpdateLogo(visible)
    {
        let logo = this.GetLanguageLogo();

        if(!visible)
        {
            logo.src = Drowpdown.hiddenLogoPath;

            //low budget ahhh approach

            logo.style.width = "40px"; 
            logo.style.height = "40px"; 
            logo.style.marginTop = "0px";

            logo.style.filter = ""; 
        }
        else
        {
            logo.src = this.orignalImgPath;

            for (let style of logo.style) 
            {
                logo.style[style] = this.logoStyles[style];
            }

            logo.style.filter = this.logoStyles["filter"];
        }
    }

    UpdateVisibility(visible)
    {
        this.UpdateLogo(visible);
        this.UpdateChildren(visible);
        this.DrawAnimation(visible);
    }

    DrawAnimation(visible)
    {
        if(!visible)
        {
            if(!this.firstTime)
            {
                this.firstTime = true;
                this.colorswitcher.DoAnimation(Drowpdown.grayColor, 0);
            }
            else
                this.colorswitcher.DoAnimation(Drowpdown.grayColor, 800);
        }
        else
        {
            this.colorswitcher.DoAnimation(this.originalColor, 800);
        }
    }

    OnClick()
    {        
        if(!this.colorswitcher.IsReady()) //Animation not finished yet
            return;

        Log("clicked item with ID: " + this.selfHtmlObj.id);
        Log("show item? : " + this.active);

        this.UpdateVisibility(this.active);

        this.active = !this.active;
    }
}

function collectPrgDropdowns()
{
    const elements = document.querySelectorAll('.PrgLanguage');

    elements.forEach(element => {
        let dropdown = new Drowpdown(element);

        dropdown.GetButtonObject().addEventListener('click', function(event) {
            OnClickDropdown(event.target);
        });
        
        dropdown.OnClick();

        dropdown.UpdateVisibility(dropdown.active);
        dropdown.active = !dropdown.active;

        dropdownList.push(dropdown); 
    });
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
        Log("Drop down class Object wasnt found!");
    }
    
}

collectPrgDropdowns();