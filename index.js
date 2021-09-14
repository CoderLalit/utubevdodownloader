async function getVideo(vID){
    try {
        const response =  await fetch(`https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${vID}&geo=DE`, {
	        "method": "GET",
	        "headers": {
		        "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
		        "x-rapidapi-key": "71479d4288msh5a7421b1b5a6678p148662jsn0975ec3fe4de"
	        }
        });
        const response_1 = await response.json();
        // console.log(response_1);
        return response_1; 
    }

    catch (err) {
        console.error(err);
      }
}

var links = {
    videoFormat : {
        small: [],
        medium: [],
        hd: [],
        fhd: []
    },

    audioFormat : {
        small: [],
        medium: [],
        hd: [],
        fhd: []
    }
}


async function searchVideo(){

    var iframe = document.getElementById("iframe");
    iframe.style.display="block";
    document.getElementById("info").style.display="none";

    var videoURL = document.getElementById("search-bar").value;

    var index = videoURL.indexOf("=");
    var urlLen = videoURL.length;
    var vID = videoURL.substring(index+1,urlLen+1);

    var result = await getVideo(vID);
    if(result["status"] == 'fail'){
        window.alert(result["msg"],vID);
    }

    // small = 144p     // medium = 360p    // hd = 720p    // fullhd = 1080p

    var sizeCode = {
        0: "small",
        1: "medium",
        2: "hd",
        3: "fhd"
    };

    
    //get download url
    var link = await extractLink(vID);
    console.log(link);

    // hide the size which is not available
    hide(link);


    var btn = document.getElementsByClassName("link-btn");
    for(var i=0 ; i<btn.length ; i++){
        var size = sizeCode[i];
        btn[i].addEventListener("click", function () {
            var ID = parseInt(this.id, 10)
            size = sizeCode[ID];
            window.open(link["videoFormat"][size][0], "_blank");
        });
    }

    //set iframe src to videoURL
    setIframe(vID);

}

function setIframe(id){
    document.getElementById("video-frame").src =`https://www.youtube.com/embed/${id}`;
}

async function  extractLink(vID){

    var result = await getVideo(vID);

    for (i in result["link"]){
        if(result["link"][i][3] == "144p"){
            links["videoFormat"]["small"].push(result["link"][i][0]); 
        }
        else if(result["link"][i][3] == "360p"){
            links["videoFormat"]["medium"].push(result["link"][i][0]); 
        }
        else if(result["link"][i][3] == "720p"){
            links["videoFormat"]["hd"].push(result["link"][i][0]); 
        }
        else if(result["link"][i][3] == "1080p"){
            links["videoFormat"]["fhd"].push(result["link"][i][0]); 
        }
    }
    
    return links;


}

function hide(link){
    for(var i in link["videoFormat"]){
        if(link["videoFormat"][i].length == 0){
            document.getElementById(`${i}`).style.display="none";
        }
    }
}

function loadFun(){
    document.getElementById("loader").style.display="none";
    document.getElementById("iframe").style.display="block";
    document.getElementById("table").style.display="block";
}
//https://www.youtube.com/watch?v=XnPl8Mm3E_g
//https://www.youtube.com/watch?v=pwzE4swak7s