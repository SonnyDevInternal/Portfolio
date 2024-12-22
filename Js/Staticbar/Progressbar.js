class Progressbar
{
    static colorExplored = new Color(255, 255, 255, 255).getString();
    static colorTrackline = new Color(162, 162, 162, 255).getString();
    static colorBackground = new Color(62, 62, 62, 255).getString();

    constructor(bar)
    {
        this.self = bar;
        this.context2D = bar.getContext("2d");

        this.progressPerc = 0;

        this.goalsActive = 0;

        this.progressGoals = [];
        this.icons = [];

        this.lastActivated = 0;
    }

    AddGoal(yPos, self, icon)
    {
        let Goal = {y: yPos, self: self};

        this.progressGoals.push(Goal);
        this.icons.push(icon);
    }

    CalculateIcons() // Call after all Goals have been added
    {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

        let selfDimension = getAbsolutePosition(this.self);

        for(let l = 0; l < this.progressGoals.length; l++)
        {
            let cachedGoal = this.progressGoals[l];
            let style = this.icons[l].style;

            let sum =  selfDimension.width * Math.min(1, (cachedGoal.y / scrollableHeight));

            style.left = `${sum}px`;
            style.bottom = '-3px';
        }
    }

    CalculateGoals(ScrollY)
    {
        if(this.progressGoals <= 0)
            return;

        let wasAdded = false;

        while(this.lastActivated < this.progressGoals.length || this.lastActivated >= 0)
        {
            if(!wasAdded && this.progressGoals[this.lastActivated].y > ScrollY)
            {
                this.lastActivated--;
                
                if(this.lastActivated < 0)
                {
                    this.goalsActive = 0;

                    this.lastActivated = 0;
                    break;
                }
            }
            else
            {
                
                if(this.lastActivated + 1 < this.progressGoals.length && this.progressGoals[this.lastActivated + 1].y <= ScrollY)
                {
                    this.lastActivated++;

                    if(this.lastActivated >= this.progressGoals.length)
                    {
                        this.lastActivated = this.progressGoals.length - 1;

                        this.goalsActive = this.progressGoals.length;
                        break;
                    }

                    wasAdded = true;
                }
                else
                {
                    this.goalsActive = this.lastActivated + 1;
                    break;
                }
            }
        }
    }

    DrawBar()
    {
        const LineWidthPerc = 50; //%
        const OffsetLineStartXPerc = 0; //%

        this.context2D.clearRect(0, 0, this.self.width, this.self.height);

        let startPosY = (this.self.height / 100) * LineWidthPerc;
        let startPosX = (this.self.width / 100) * OffsetLineStartXPerc;

        let addX = (this.self.width + startPosX);

        this.context2D.fillStyle = Progressbar.colorBackground;

        this.context2D.fillRect(startPosX, startPosY, addX * 1, startPosY);

        this.context2D.fillStyle = Progressbar.colorTrackline;

        this.context2D.fillRect(startPosX, startPosY, ((addX - startPosX ) * this.progressPerc) , startPosY);
    }

    UpdateBar(ScrollY) //Called on Scroll or on Load
    {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

        this.progressPerc = ScrollY / scrollableHeight;

        this.CalculateGoals(ScrollY);
        requestAnimationFrame(() => this.DrawBar());
    }
}

let progressbar = new Progressbar(document.getElementById("StaticProgressbar"));

progressbar.UpdateBar(window.scrollY);

function CollectProgressGoals()
{
    const goals = document.getElementsByClassName('ProgressGoal');
    const icons = document.getElementsByClassName('ProgressIcon');

    for(let y = 0; y < goals.length; y++)
    {
        let curGoal = goals[y];

        let goalsDim = getAbsolutePosition(curGoal);
        
        progressbar.AddGoal(goalsDim.top, curGoal, icons[y]);

        icons[y].addEventListener("click", (event) => {
            window.scrollTo({
                top: goalsDim.top,   
                left: 0,
                behavior: 'smooth'
            });
        });
    }

    progressbar.CalculateIcons();
}

function PgBarOnScroll()
{
    progressbar.UpdateBar(window.scrollY);
}

CollectProgressGoals();

window.addEventListener("resize", () => {
    PgBarOnScroll();
    progressbar.CalculateIcons();
});
window.addEventListener("scroll", PgBarOnScroll);