function OnCallbackPrg(item, active)
{
    item.RemoveOnReadyCallback(OnCallbackPrg);

    item.active = !item.active;

    item.UpdateVisibility(active);
}

class ScrollItemPrgs
{
    constructor()
    {
        const MaxYPercantage = 30; //%
        const SpacingItems = 40; //in px

        this.dropdownList = Drowpdown.GetAllDropdowns();

        let DropdownsParent = this.dropdownList[0].selfHtmlObj.parentElement;

        let dimensions = getAbsolutePosition(DropdownsParent);

        this.yPos = dimensions.top;

        this.itemsActivated = 0;
        this.maxItems = this.dropdownList.length;

        this.distancePerItem = (((dimensions.height / 100) * MaxYPercantage) / this.dropdownList.length) + SpacingItems;
    }

    OnScroll()
    {
        const OffsetY = window.scrollY;
        const YPosOffset = -500;

        const YViewportPos = (OffsetY - (this.yPos + YPosOffset));

        if(YViewportPos > 0)
        {
            Log("YViewport Pos: " + YViewportPos);

            let itemsToActivate = Math.abs(Math.trunc(YViewportPos / this.distancePerItem) - this.itemsActivated);

            itemsToActivate = Math.max(0, Math.min(itemsToActivate, this.maxItems));

            /*
            if(itemsToActivate - this.itemsActivated < 0 )
            {
                for(; this.itemsActivated > itemsToActivate; this.itemsActivated--)
                {
                    let cachedDrop = this.dropdownList[this.itemsActivated];

                    if(!cachedDrop.active && cachedDrop.IsReady())
                        cachedDrop.UpdateVisibility(false);
                    else
                        cachedDrop.AddOnReadyCallback(OnCallbackPrg);
                }
            }*/
            {
                for(; this.itemsActivated < itemsToActivate; this.itemsActivated++)
                {
                    let cachedDrop = this.dropdownList[this.itemsActivated];

                    if(!cachedDrop.firstTime)
                    {
                        this.itemsActivated = 0;
                        return;
                    }

                    if(cachedDrop.active && cachedDrop.IsReady())
                    {
                        cachedDrop.active = false;
                        cachedDrop.UpdateVisibility(true);
                    }
                    else
                        cachedDrop.AddOnReadyCallback(OnCallbackPrg);
                }

                if(this.itemsActivated >= this.maxItems)
                {
                    Log("Removed event listener to Scroll!");

                    window.removeEventListener("resize", eventScroll);
                    window.removeEventListener("scroll", eventScroll);
                }
                    
            }
        }/*
        else
        {
            for(; this.itemsActivated < itemsToActivate; this.itemsActivated++)
            {
                let cachedDrop = this.dropdownList[this.itemsActivated];

                if(cachedDrop.active && cachedDrop.IsReady())
                    cachedDrop.UpdateVisibility(true);
                else
                    cachedDrop.AddOnReadyCallback(() => this.OnCallbackPrg());
            }
        }*/
    }
}

let scrollitemPrgs = new ScrollItemPrgs();
let eventScroll = () => scrollitemPrgs.OnScroll();

window.addEventListener("resize", eventScroll);
window.addEventListener("scroll", eventScroll);