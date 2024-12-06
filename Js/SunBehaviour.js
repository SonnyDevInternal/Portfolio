var rays = document.getElementById("Sunrays");

let hasHiddenSun = false;

let sizeReverse = false;

let raysAngle = 0;
let raysSize = 1;

let raysSizingSpeed = 0.2;
let raysAngleSpeed = 2;

let TickCount = new Date().getTime();

function UpdateRays()
{
    const raySizeMax = 1.4;
    const raySizeMin = 1;

    let currentTick = new Date().getTime();

    let deltaTime = (currentTick - TickCount) / 1000;

    TickCount = currentTick;

    if(sizeReverse)
    {
        if(raysSize <= raySizeMin)
        {
            raysSize = raySizeMin;
            sizeReverse = false;
        }
        else
        {
            raysSize -= ((raysSizingSpeed) * deltaTime);
            
            if(raysSize <= raySizeMin)
            {
                raysSize = raySizeMin;
                sizeReverse = false;
            }
        }
    }
    else
    {
        if(raysSize >= raySizeMax)
        {
            raysSize = raySizeMax;
            sizeReverse = true;
        }
        else
        {
            raysSize += ((raysSizingSpeed) * deltaTime);

            if(raysSize >= raySizeMax)
            {
                raysSize = raySizeMax;
                sizeReverse = true;
            }
        }
    }

    rays.style.transform = `rotate(${raysAngle}deg) scale(${raysSize})`;

    raysAngle += ((raysAngleSpeed * 100) * deltaTime);

    if(raysAngle >= 360)
    {
        raysAngle = 0;
    }
}

setInterval(UpdateRays, 1000 / 80);