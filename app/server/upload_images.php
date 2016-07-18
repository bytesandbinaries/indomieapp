<?php
header('Access-Control-Allow-Origin: *');
error_reporting(E_ALL);
ini_set('display_errors', 1);
$directory="../uploadedPicture";
$z=1;
$pic_upload="";
$prof_pic="";
$t=time();
    $pan="previewUrl";
    if(isset($_FILES["$pan"])){
        $tmp_name1 = $_FILES["$pan"]['tmp_name'];
        if (file_exists($tmp_name1)){
            if(($_FILES["$pan"]["size"]<=2048000)&&($_FILES["$pan"]["size"]>=10240)){
                $name = $_FILES["$pan"]['name'];
                $exp=explode(".",$name);
                $newname=$t.'.'.$exp[count($exp)-1];
                if(is_uploaded_file($tmp_name1)){
                    $move = move_uploaded_file($tmp_name1,"$directory/$newname");
                    chmod ("$directory/$newname",0777);
                }
            }
            else{ echo "Picture is either too Large or too Small, Please Update with a smaller size... Your picture size is: ".$_FILES["$pan"]["size"];}

        }
    }
$a_json=array('uploaded_pic'=>$newname);
echo json_encode($a_json);
?>
