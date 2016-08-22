var scope, ctrack, cc, overlay, overlayCC, drawRequest;
function activateDraggables(){
    scope = angular.element(document.getElementById('create-avartar')).scope();
    $( ".drag" ).draggable({
    stop: function(){
    				var finalOffset = $(this).offset();
    				var finalxPos = finalOffset.left;
    				var finalyPos = finalOffset.top;
                    console.log($(this));
                    console.log($(this).attr('name'));
    				$('#finalX').text('Final X: ' + finalxPos);
    				$('#finalY').text('Final X: ' + finalyPos);
                    scope.costumes[$(this).attr('name')].image_Xposition= finalxPos;
                    scope.costumes[$(this).attr('name')].image_Yposition=finalyPos;
                    scope.$apply();
    			}
            });
    $( ".resize" ).resizable({
			stop: function(event, ui) {
				var w = $(this).width();
				var h = $(this).height();
				console.log('StopEvent fired')
				console.log('Width:'+w);
				console.log('Height:'+h)
                scope.costumes[$(this).parent().attr('name')].image_width= w;
                scope.costumes[$(this).parent().attr('name')].image_height=h;
                scope.$apply();
			}
        });
}
function generateImagePreview(file){
    scope = angular.element(document.getElementById('create-avartar')).scope();

    $('#image_container').droppable({
			accept: '.props',
			over : function(){
				$(this).animate({
					'border-width' : '5px',
					'border-color' : '#0f0'
				}, 500);
				$('.props').draggable('option','containment',$(this));
			}
		});
    //$( ".props" ).resizable();

    overlay = document.getElementById('overlay');
    overlayCC = overlay.getContext('2d');
    positions=[];
    ctrack = new clm.tracker({stopOnConvergence : true});
    ctrack.init(pModel);

    console.log(scope.user);
    var imgHolder = parent.document.getElementById('user_image');
    if(file.files.length==1){
        var fReader = new FileReader();
        fReader.readAsDataURL(file.files[0]);
        fReader.onload = function (fReaderEvent) {
            var w = this.width;
            var h = this.height;
            imgHolder.src = fReaderEvent.target.result;
            // try{jQuery('.rect').remove();}
            // catch(e){}
            try{jQuery('#user_image').cropper('destroy')}
            catch(e){}
            loadImage(file.files, 0)

            //start face detection
            // var tracker = new tracking.ObjectTracker(['face']);
            // tracker.setStepSize(1.7);
            // tracking.track('#user_image', tracker);
            // tracker.on('track', function(event) {
            //     console.log(event)
            //     event.data.forEach(function(rect) {
            //         console.log(rect);
            //         facePlot(rect.x, rect.y, rect.width, rect.height);
            //     });
            // });
            // var ctracker = new clm.tracker();
            // ctracker.init(pModel);
            // ctracker.start(videoInput);

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
function startCrop(overlay){
    jQuery('#user_image').cropper({
        //aspectRatio: 16/9,
        // data:{
        //     x:  x,
        //     y: y,
        //     height:h,
        //     width: w
        // },
        viewMode:0,
        zoomOnWheel:false,
        crop:function(e){
            // console.log(e.x);
            // console.log(e.y);
            // console.log(e.width);
            // console.log(e.height);
            // console.log(e.rotate);
            // console.log(e.scaleX);
            // console.log(e.scaleY);
            scope.cordX = e.x;
            scope.cordY = e.y;
            scope.cropWidth = e.width;
            scope.cropHeight = e.height;
            scope.$apply();
            // console.log(jQuery('.cropper-canvas').width());
            overlay.setAttribute('width', jQuery('.cropper-canvas').width());
            overlay.setAttribute('height', jQuery('.cropper-canvas').height())
        }
    })
}



function useImageFromWebcam(){
    scope = angular.element(document.getElementById('create-avartar')).scope();
    cc = document.getElementById('user_image').getContext('2d');
    overlay = document.getElementById('overlay');
    overlayCC = overlay.getContext('2d');
    startCrop(overlay);
    overlayCC.clearRect(0, 0, 720, 576);
    document.getElementById('convergence').innerHTML = "";
    ctrack = new clm.tracker({stopOnConvergence : true});
    ctrack.init(pModel);
    ctrack.reset();
    animateClean();
}
function facePlot(x, y, w, h){
    // var rect = document.createElement('div');
    var overlay = document.getElementById('overlay');
    var img = document.getElementsByClassName('cropper-canvas')[0];
    // document.getElementById('image_container').appendChild(rect);
    // rect.classList.add('rect');
    // rect.style.width = w + 'px';
    // rect.style.height = h + 'px';
    // rect.style.left = (img.offsetLeft + x) + 'px';
    // rect.style.top = (img.offsetTop + y) + 'px';
    scope.cordX = x;
    scope.cordY = y;
    scope.cropWidth = w;
    scope.cropHeight = h;
    scope.$apply();
    var data={ x:  x,  y: y,  height:h,  width: w };

    overlay.style.left=img.offsetLeft+'px';
    overlay.style.top=img.offsetTop;

    jQuery('#user_image').cropper('setData', data);
}

// var img = new Image();
// img.onload = function() {
// 	cc.drawImage(img,0,0,625, 500);
// };
// img.src = '../images/test.jpg';

function animateClean() {
	ctrack.start(document.getElementById('user_image'));
	drawLoop();
}
function animate(box) {
	ctrack.start(document.getElementById('user_image'), box);
	drawLoop();
}

function drawLoop() {
	drawRequest = requestAnimationFrame(drawLoop);
    positions=ctrack.getCurrentPosition();
	overlayCC.clearRect(0, 0, 720, 576);
	if (ctrack.getCurrentPosition()) {
		ctrack.draw(overlay);
	}
}

// detect if tracker fails to find a face
document.addEventListener("clmtrackrNotFound", function(event) {
	ctrack.stop();
    document.getElementById('convergence').style.display='block';
    document.getElementById('convergence').style.backgroundColor = "#FF0000";
	document.getElementById('convergence').innerHTML = "The tracking had problems with finding a face in this image. Try selecting the face in the image manually."
}, false);

// detect if tracker loses tracking of face
document.addEventListener("clmtrackrLost", function(event) {
	ctrack.stop();
    document.getElementById('convergence').style.display='block';
    document.getElementById('convergence').style.backgroundColor = "#FF0000";
	document.getElementById('convergence').innerHTML = "The tracking had problems converging on a face in this image. Try selecting the face in the image manually.";
}, false);

// detect if tracker has converged
document.addEventListener("clmtrackrConverged", function(event) {
	document.getElementById('convergence').innerHTML = "A face has been detected; however, you can manually improve the face found by dragging the crop handles.";
    document.getElementById('convergence').style.display='block';
	document.getElementById('convergence').style.backgroundColor = "#00FF00";
	// stop drawloop
    window.cancelAnimationFrame(drawRequest);
    console.log(positions);
    var x=positions[1][0]-10;
    var y=positions[20][1]-10;
    var w=(positions[12][0]+20) - (positions[1][0]);
    var h= (positions[6][1]+20) - (positions[20][1]);
    facePlot(x,y,w,h);
	//cancelRequestAnimFrame(drawRequest);
}, false);

// update stats on iteration
document.addEventListener("clmtrackrIteration", function(event) {
}, false);
// manual selection of faces (with jquery imgareaselect plugin)
function selectBox() {
	overlayCC.clearRect(0, 0, 720, 576);
	document.getElementById('convergence').innerHTML = "";
	ctrack.reset();
	$('#overlay').addClass('hide');
	$('#image').imgAreaSelect({
		handles : true,
		onSelectEnd : function(img, selection) {
			// create box
			var box = [selection.x1, selection.y1, selection.width, selection.height];
			// do fitting
			animate(box);
			$('#overlay').removeClass('hide');
		},
		autoHide : true
	});
}
// function to start showing images
function loadImage(fileList, fileIndex) {
	//if (fileList.indexOf(fileIndex) < 0) {
     cc = document.getElementById('user_image').getContext('2d');

		var reader = new FileReader();
		reader.onload = (function(theFile) {
		        return function(e) {
				// check if positions already exist in storage
				// Render thumbnail.
				var canvas = document.getElementById('user_image')
				var cc = canvas.getContext('2d');
				var img = new Image();
				img.onload = function() {
					if (img.height > 500 || img.width > 700) {
						var rel = img.height/img.width;
						var neww = 700;
						var newh = neww*rel;
						if (newh > 500) {
							newh = 500;
							neww = newh/rel;
						}
						canvas.setAttribute('width', neww);
						canvas.setAttribute('height', newh);
                        // overlay.setAttribute('width', neww);
                        // overlay.setAttribute('height', newh);
						cc.drawImage(img,0,0,neww, newh);
					} else {
						canvas.setAttribute('width', img.width);
						canvas.setAttribute('height', img.height);
                        // overlay.setAttribute('width', img.width);
                        // overlay.setAttribute('height', img.height);
						cc.drawImage(img,0,0,img.width, img.height);
					}
                    startCrop(overlay);
                    // jQuery('#overlay').css({left:jQuery('#user_image').offset().left})
                    // jQuery('#overlay').css({top:jQuery('#user_image').offset().top})
				}
				img.src = e.target.result;

			};
		})(fileList[fileIndex]);
		reader.readAsDataURL(fileList[fileIndex]);
		overlayCC.clearRect(0, 0, 720, 576);
		document.getElementById('convergence').innerHTML = "";
		ctrack.reset();

        animateClean();
//	}
}
// set up file selector and variables to hold selections
var fileList, fileIndex;
if (window.File && window.FileReader && window.FileList) {
	function handleFileSelect(evt) {
		var files = evt.target.files;
		fileList = [];
		for (var i = 0;i < files.length;i++) {
			if (!files[i].type.match('image.*')) {
				continue;
			}
			fileList.push(files[i]);
		}
		if (files.length > 0) {
			fileIndex = 0;
		}
		loadImage();
	}
	document.getElementById('imageUploader').addEventListener('change', handleFileSelect, false);
 } else {
// 	$('#files').addClass("hide");
// 	$('#loadimagetext').addClass("hide");
 }
