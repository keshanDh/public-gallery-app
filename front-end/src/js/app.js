const mainElm = $("main");
const btnUpload = $("#upload");
const overlay = $("#overlay");
const dropZone = $("#drop-zone");
const REST_API_URL = "http://localhost:8080/gallery";
const loader = $(`<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`);

btnUpload.on('click',()=>{
    overlay.removeClass('d-none');
});
overlay.on('click',(event)=>{
    if(event.target === overlay[0]) overlay.addClass("d-none");
});
$(document).on("keydown",(event)=>{
    if (event.key === "Escape" && !overlay.hasClass("d-none")) overlay.addClass("d-none");
});


overlay.on('dragover',(event)=>event.preventDefault());
overlay.on('drop',(event)=>event.preventDefault());

dropZone.on('dragover',(event)=>event.preventDefault());
dropZone.on('drop',(event)=> {
    event.preventDefault();
    const droppedFiles = event.originalEvent.dataTransfer.files;
    const imageFiles = Array.from(droppedFiles).filter(file => file.type.startsWith("image/"));
    if (!droppedFiles.length) return;
    overlay.addClass('d-none');
    uploadImageFile(imageFiles);
});
loadImage();
function loadImage(){
    const jqxhr = $.ajax(`${REST_API_URL}/images`);
    jqxhr.done((imageUrlList) => {
        imageUrlList.forEach((imageUrl)=>{
            const divElm = $(`<div class="image"></div>`);
            divElm.css("background-image",`url('${imageUrl}')`);
            mainElm.append(divElm);
        });
    });

    jqxhr.fail(()=>{});
}
function uploadImageFile(imageFilesList){
    const formData = new FormData();
    imageFilesList.forEach(imageFile=>{
        const divElm = $(`<div class="image loading"></div>`);
        divElm.append(loader);
        mainElm.append(divElm);

        formData.append("images",imageFile);
    });
    const jqxhr = $.ajax(`${REST_API_URL}/images`,{
        method:"POST",
        data: formData,
        processData: false,
        contentType: false
    });
    jqxhr.done((responseImageList)=>{
        responseImageList.forEach(imageUrl =>{
            const divElm = $(".image.loading").first();
            divElm.css("background-image",`url('${imageUrl}')`);
            divElm.empty();
            divElm.removeClass("loading");
        });
    });

}