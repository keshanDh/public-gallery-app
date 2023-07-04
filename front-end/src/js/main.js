const bodyElm = $('body');
const overlay = $('#overlay');
const btnUpload = $('#btn-upload');
const dropZone = $('#drop-zone');
const mainElm = $('main');
const REST_API_URL = 'http://localhost:8080/gallery';
const cssLoaderHtml = $(`<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`)

loadAllImages();

btnUpload.on('click',()=>overlay.removeClass('d-none'));
bodyElm.on('keydown',(eventData)=>{
    if (eventData.code==="Escape" && !overlay.hasClass('d-none')) overlay.addClass('d-none');
});
overlay.on('click',(event)=>{
    if (event.target===overlay[0]) overlay.addClass('d-none');
});

dropZone.on('dragover',(evt)=>evt.preventDefault());
overlay.on('dragover', (evt) => evt.preventDefault());
overlay.on('drop', (evt) => evt.preventDefault());
dropZone.on('drop',(evt)=>{
    evt.preventDefault();
    const droppedFiles = evt.originalEvent.dataTransfer.files;
    const imageFiles = Array.from(droppedFiles).filter(file=>file.type.startsWith("image/"));
    if (!imageFiles.length) return;
    overlay.addClass("d-none");
    uploadImages(imageFiles);
});
mainElm.on('click','.image',(evt)=>{
    evt.target.requestFullscreen();
})


function loadAllImages() {
    const jqxhr = $.ajax(`${REST_API_URL}/images`);
    jqxhr.done((imageUrlList=>{
        imageUrlList.forEach(imageUrl =>{
            const imgElm = $(`<div class="image">
                                <div class="download-icon"></div>
                            </div>`);
            imgElm.css("background-image",`url("${imageUrl}")`);
            $('main').append(imgElm);
        })
    }))
}

function uploadImages(imageFiles){
    const formData = new FormData();
    imageFiles.forEach(imagFile=>{
        const imgDivElm = $('<div class="image loader"></div>');
        imgDivElm.append(cssLoaderHtml);
        mainElm.append(imgDivElm);
        formData.append("images",imagFile);
    })
    const jqxhr = $.ajax(`${REST_API_URL}/images`,{
        method:'POST',
        data:formData,
        processData:false, //By default, jQuery tries to
        contentType:false //By default, jQuery uses application/x-www-form-urlencoded
    })
    jqxhr.done((imageUrlList)=>{
        imageUrlList.forEach(imageUrl=>{
            const divElm = $(".image.loader").first();
            divElm.css('background-image',`url('${imageUrl}')`);
            divElm.empty();
            divElm.removeClass('loader');
        })
    })
    jqxhr.always(()=>{});
}