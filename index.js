const colorsDiv = document.querySelectorAll('.colors--container');
const addCreativeBtn = document.querySelector('#add--creative');
const drawer = document.querySelector('#creative--drawer ');
const done = document.querySelector('#done--drawer');
const form = document.querySelector('#form--drawer');
const titleDrawer = document.querySelector('#title--drawer');
const subtitleDrawer = document.querySelector('#subtitle--drawer');
const previewContainer = document.querySelector('#preview--container');
const progress = document.querySelector('#fill--progress');
const progressHeading = document.querySelector('#heading--progress');
const filterContainer = document.querySelector('#filtered--content');

let pro = 0;
let bg;

let checkitycheck = false;
let lastSelected0 = [];
let lastSelected1;
let Nodes;
let previewed = {};
let filtered = {};


function toggleDrawer() {
    if(addCreativeBtn.disabled && pro < 5) {
        drawer.style.display = 'none';
        addCreativeBtn.disabled = false;
    }   else    {
        drawer.style.display = 'block';
        addCreativeBtn.disabled = true;
    }
}

function updatePreview(e) {
    e.preventDefault();
    previewContainer.style.display = 'block';
    filterContainer.style.display = 'none';
    let div = document.createElement("div");
    div.className = "previews";
    let title = document.createElement("h2");
    let subtitle = document.createElement("h3");
    title.textContent = titleDrawer.value;
    subtitle.textContent = subtitleDrawer.value;
    titleDrawer.value = "";
    subtitleDrawer.value = "";
    lastSelected= "";
    checkitycheck = false;
    Nodes.forEach((n) => n.previousSibling.checked = false);
    div.style.backgroundColor = bg;
    div.setAttribute('data-color', bg);
    div.appendChild(title);
    div.appendChild(subtitle);
    done.disabled = true;
    previewContainer.appendChild(div);
    previewed[`${bg}-${title.textContent}-${subtitle.textContent}`] = div;
    pro = previewContainer.childNodes.length - 1;
    progressHeading.textContent = `${pro} / 5 Creatives`;
    progress.style.width = `${20 * pro}%`;
    toggleDrawer();
}
function filterator() {
    filtered = {};
    if(lastSelected0.length > 0)   {
            previewContainer.style.display = 'none';
            filterContainer.style.display = 'block';
             Object.keys(previewed).forEach((key) => {
                 if(lastSelected0.includes(key.match(/#[0-9a-z]+/g)[0]))   filtered[key] = previewed[key];
                 });
             filterContainer.innerHTML = '';
            for(const property in filtered)    {
               filterContainer.appendChild(filtered[property].cloneNode(true));
            }
    }    else    {
           previewContainer.style.display = 'block';
           filterContainer.style.display = 'none';
   }
}
function doneButtonHandler() {
    if(titleDrawer.value != "" && subtitleDrawer.value != "" && checkitycheck)   done.disabled = false;
    else    done.disabled = true;
}

function isChecked(e)    {
    let inputEle = e.target;
        if(lastSelected0.includes(inputEle.value))  {
            lastSelected0.splice(lastSelected0.indexOf(inputEle.value), 1);
            inputEle.checked = false;
            filterator();
        } else if(inputEle.id == lastSelected1)   {
                inputEle.checked = false;
                lastSelected1 = "";
                checkitycheck = false;
                if(!done.disabled) done.disabled = true;
        }   else {
                if(inputEle.id.charAt(inputEle.id.length -1) === '1')   {
                        bg = e.target.value;
                        checkitycheck = true;
                        lastSelected1 = inputEle.id;
                }   else    {
                    lastSelected0.push(inputEle.value);
                    filterator();
                }
        }
}

function populateColors(colors) {
    let i = 0;
    for(let color of colors)    {
    let j = 0;
        for(const div of colorsDiv.values())  {
            const labelo = document.createElement("label");
            const option = document.createElement("input");
            labelo.className =`colors--button`;
            labelo.setAttribute('for',`colors--button${i}${j}`);
            option.type = 'radio';
            if(j == 1)  option.name = 'colors';
            option.id = `colors--button${i}${j}`;
            labelo.style.backgroundColor = color;
            option.value =  color;
            div.appendChild(option);
            div.appendChild(labelo);
            j ++;
        }
        i++;
    }
}

(async function fetchColor() {
    const colors = await fetch('https://random-flat-colors.vercel.app/api/random?count=8').then((data) => data.json()).then((json) => json['colors']);
    populateColors(colors);
    Nodes = document.querySelectorAll('.colors--button');
    Nodes.forEach((n) => n.previousSibling.addEventListener('click', isChecked))
})();

addCreativeBtn.addEventListener('click', toggleDrawer);
form.addEventListener('change', doneButtonHandler);
form.addEventListener('keydown', doneButtonHandler);
done.addEventListener('click', (e) =>  updatePreview(e,bg));
