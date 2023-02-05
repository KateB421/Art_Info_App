const root=document.querySelector('.root');
const theSearchButton=document.querySelector('#theSearchButton');
const theRandomButton=document.querySelector('#theRandomButton');
const theInput=document.querySelector('#userSearch');
let objectID='';
let searchTerm='';
let theWikiSearchTerm='';
let theWikiURL=`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${theWikiSearchTerm}&format=json`;
let theObjectMuseumURL=`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
let theSearchMuseumURL=`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
let allMuseumObjectsURL=`https://collectionapi.metmuseum.org/public/collection/v1/objects`;
let theObjects;

async function ListOfObjects(){
    theObjects=await fetch(allMuseumObjectsURL);
    theObjects=await theObjects.json();
}

ListOfObjects();

function addWikiInfo(anObject){
    let sectionHeader=document.createElement('h3');
    root.append(sectionHeader);
    sectionHeader.innerText='Artist Info:';
    let theArtistInfo=document.createElement('p');
    root.append(theArtistInfo);
    theArtistInfo.innerHTML=(anObject.query.search[0].snippet)+'... ';
    let wikiLink=document.createElement('a');
    theArtistInfo.append(wikiLink);
    let theTitle=anObject.query.search[0].title;
    wikiLink.href=`https://en.wikipedia.org/wiki/${theTitle}`;
    wikiLink.innerText='Read more here.';
}

async function GetWikiInfo(){
    let theResponse=await fetch(theWikiURL);
    theResponse=await theResponse.json();
    console.log(theResponse);
    addWikiInfo(theResponse);
}

function AddToPage(anObject){
    root.innerHTML='';
    let objectTitle=document.createElement('h2');
    root.append(objectTitle);
    objectTitle.innerText=anObject.title;
    objectTitle.className='title'
    if(anObject.primaryImage){
        let theImage=document.createElement('img');
        root.append(theImage);
        theImage.src=anObject.primaryImage;
        theImage.className='primaryImage';
    }
    else{
        let placeholderImage=document.createElement('p');
        root.append(placeholderImage);
        placeholderImage.innerText='No Image Available'
        placeholderImage.className='noImage';
    }
    if(anObject.objectDate){
        let theObjectDate=document.createElement('p');
        root.append(theObjectDate);
        theObjectDate.innerText=anObject.objectDate;
        theObjectDate.className='date'
    }
    if (anObject.artistDisplayName){
        let objectArtist=document.createElement('p');
        root.append(objectArtist);
        objectArtist.innerText=anObject.artistDisplayName;
        objectArtist.className='artist';
    }
    if (anObject.medium){
        let objectMedium=document.createElement('p');
        root.append(objectMedium);
        objectMedium.innerText=anObject.medium;
        objectMedium.className='medium'
    }
    if (anObject.dimensions){
        let objectDimensions=document.createElement('p');
        root.append(objectDimensions);
        objectDimensions.innerText=anObject.dimensions;
        objectDimensions.className='dimensions';
    }
    theWikiSearchTerm=anObject.artistDisplayName;
    theWikiSearchTerm=theWikiSearchTerm.replace(/ /g,"%20");
    theWikiURL=`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${theWikiSearchTerm}&format=json`;
    GetWikiInfo();
}

async function GetObject(){
    let theResponse=await fetch(theObjectMuseumURL);
    theResponse=await theResponse.json();
    console.log(theResponse);
    AddToPage(theResponse);
}

async function SearchForObject(){
    let theResponse=await fetch(theSearchMuseumURL);
    theResponse=await theResponse.json();
    let res=theResponse.objectIDs[Math.floor(Math.random()*theResponse.total)];
    objectID=res.toString();
    theObjectMuseumURL=`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
    GetObject();
}

async function GetRandomObject(){
    let aNumber=Math.floor(Math.random() * theObjects.objectIDs.length);
    objectID=theObjects.objectIDs[aNumber];
    theObjectMuseumURL=`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`;
    let theResponse=await fetch(theObjectMuseumURL);
    theResponse=await theResponse.json();
    console.log(theResponse);
    AddToPage(theResponse);
}

theSearchButton.addEventListener('click', function(event){
    event.preventDefault();
    searchTerm=theInput.value;
    searchTerm=searchTerm.replace(/ /g,"%20")
    theSearchMuseumURL=`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
    SearchForObject();
})

theRandomButton.addEventListener('click', function(event){
    event.preventDefault();
    GetRandomObject();
})