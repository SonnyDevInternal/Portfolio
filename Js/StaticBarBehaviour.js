let hidden = false;

let bar = document.getElementById("StaticBar");
let StaticShowHideBtn = document.getElementById("StaticHideShowBtn");

let displayStylesList = [];

function FindDisplayStyleByReference(ref)
{
    for(let j = 0; j < displayStylesList.length; j++)
    {
        if(ref == displayStylesList[j].itemRef)
            return displayStylesList[j].displayStyle;
    }

    return "";
}

function ClickedStaticBar()
{
    bar.style.animation = 'none';
    bar.offsetHeight;

    StaticShowHideBtn.style.backgroundColor = "rgb(131, 131, 131)";

    if(!hidden)
    {
        StaticShowHideBtn.onclick = ()=> {};

        const children = bar.querySelectorAll('*');

        children.forEach(child => 
        {
            if(child.id !== "StaticHideShowBtn" && child.id !==  "DH")
            {
                var displayInfo = {itemRef: child, displayStyle: child.style.display};

                displayStylesList.push(displayInfo);

                child.disabled = true;
                child.style.display = "none";
            }
        });

        bar.style.animation = "StaticBarToggle 1s forwards";
    }
    else
    {
        StaticShowHideBtn.onclick = ()=> {};

        bar.style.animation = "StaticBarToggle 1s reverse";
    }

    hidden = !hidden;
}

function StaticBarAnimEnd()
{
    StaticShowHideBtn.style.backgroundColor = "rgb(46, 46, 46)";
    
    if(!hidden)
    {
        StaticShowHideBtn.onclick = ()=> ClickedStaticBar();

        const children = bar.querySelectorAll('*');

        children.forEach(child => 
        {
            if(child.id !== "StaticHideShowBtn" && child.id !==  "DH")
            {
                child.disabled = false;
                child.style.display = FindDisplayStyleByReference(child);
            }
        });

        displayStylesList = [];
    }
    else
    {
        StaticShowHideBtn.onclick = ()=> ClickedStaticBar();
    }
}

StaticShowHideBtn.onclick = ()=> ClickedStaticBar();

bar.onanimationend = ()=> StaticBarAnimEnd();