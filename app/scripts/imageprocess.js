
function generateImagePreview(file){
    var scope= angular.element(document.getElementById('create-avartar')).scope();
    console.log(scope.user);
    var imgHolder = parent.document.getElementById('user_image');
    if(file.files.length==1){
        var fReader = new FileReader();
        fReader.readAsDataURL(file.files[0]);
        fReader.onload = function (fReaderEvent) {
            var w = this.width;
            var h = this.height;
            imgHolder.src = fReaderEvent.target.result;
        }
    }
    else{
        scope.user.status="Error Selecting Picture";
    }



    //console.log($scope.user.previewUrl);
    // NProgress.start();
    // var input = element;

    //let's hold the files in Angular
    // var scope = angular.element(document.querySelector(".hero")).scope();
    //   scope.$apply(function () {
    //             // STORE THE FILE OBJECT IN AN ARRAY.
    //             for (var i = 0; i < input.files.length; i++) {
    //                 scope.files.push(input.files[i]);
    //             }
    //   });




    // var holder = parent.document.getElementById('user_blob');
    // //holder.innerHTML = "";
    // var i;
    // var image = new Image();
    // var w, h;
    // var wrong = false;
    //
    // if (input.files) {
    //
    //     for (i = 0; i < input.files.length; i++) {
    //         var oFReader = new FileReader();
    //         oFReader.readAsDataURL(input.files[i]);
    //         oFReader.onload = function (oFREvent) {
    //             //var preview = document.createElement("div");
    //             //preview.className = "previewUploads";
    //             image.src = oFREvent.target.result;
    //             image.onload = function () {
    //                 w = this.width;
    //                 h = this.height;
    //                 //t = input.files[i].type,                           // ext only: // file.type.split('/')[1],
    //                 //n = input.files[i].name,
    //                 //s = ~ ~(file.size / 1024) + 'KB';
    //                 holder.src = oFREvent.target.result;
    //                 //showTracker();
    //                 $('#user_blob').faceDetection({
    //                    complete: function (faces) {
    //                       console.log(faces.length);
    //                        completed(faces);
    //                    }
    //                });
    //                NProgress.done();
    //             };
    //
    //
    //             //holder.appendChild(preview);
    //         };
    //         /*if (wrong) {
    //            $('.tabheader .content').html("Wrong Image Dimensions");
    //             $('.dialogcontent').html("<div style='padding:15px'>Sorry but the image has to have a width of 284px and a height of 346px</div>");
    //             $('.md-modal').addClass('md-show');
    //         }*/
    //
    //     }
    // }

}
