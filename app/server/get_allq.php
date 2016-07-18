<?php
header('Access-Control-Allow-Origin: *');
error_reporting(E_ALL);
ini_set('display_errors', 1);
$host = "localhost";
// $username = "root";
// $password = "";
// $database = "poweroil";
// $username = "funqui_marketpla";
// $password = "Asdf1234!";
// $database = "funqui_poweroilmarketplace";
// $con=mysqli_connect($host,$username,$password, $database);
$t=time();

if($_POST['action']=='additem'){
    $sqlu="Insert into item values ( NULL,
    '".$_POST['cat']."',
    '".$_POST['itype']."',
    '".mysqli_real_escape_string($con, $_POST['itext'])."',
    '".$_POST['Nrate']."',
    '".$_POST['discount']."',
    '".mysqli_real_escape_string($con,$_POST['desc'])."',
    '".$_POST['lowest_quantity']."',
    '".$_POST['max_quantity']."',
    '".$_POST['batch_quantity']."',
    '".$_POST['measuring_metric']."',
    '".$_POST['itag']."',
    '".$_POST['profile_pic']."',
    '".$_POST['all_pics']."',
    '".$_POST['icon']."',
    '".$_POST['reward']."',
    '".$t."',
    '".$t."')";
    $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new Item" . mysqli_error());
    $item_no = mysqli_insert_id($con);
    echo $_POST['callback'].$item_no;
}
else if($_POST['action'] =='cartoonImage'){


    $file_path = dirname(__DIR__)."/uploadedPicture/".$_POST['uploadedImageUrl'];
    $output_path= dirname(__DIR__)."/proccessedCartoon/".$_POST['uploadedImageUrl'];

    function toon($output_path){
      exec("bash " . __DIR__ . "/toon.sh -m 1 -c pegtoplight " . $output_path . " " .  $output_path, $output, $return);
      processLog($return, 'toon');
    }

    function crossHatch($output_path){
      exec("bash " . __DIR__ . "/crosshatch.sh -l 7 -s 20 -g 0 -a 1 " . $output_path . " " .  $output_path);
    }

    function daveHill($output_path){
      exec("bash " . __DIR__ . "/davehilleffect.sh " . $output_path . " " .  $output_path);
    }
    function draganeffect($file_path, $output_path){
      exec("bash " . __DIR__ . "/draganeffect.sh " . $file_path . " " .  $output_path, $output, $return);
      processLog($return, 'draganeffect');
    }

    function cartoonImage($pattern, $numlevels, $edgemethod, $edgeamount, $brightness, $saturation, $output_path){
         exec( "bash " . __DIR__ . "/cartoon.sh -p " . $pattern . " -n " . $numlevels . " -m " . $edgemethod . " -e " . $edgeamount . " -b " . $brightness . " -s " . $saturation . " " . $output_path . " " .  $output_path, $output, $return);
         processLog($return, 'cartoonImage');
    }
    function processLog($return, $from){
        if (!$return){
               echo "Successfully $from";
           } else {
               echo "Error $from";
           }
    }

    draganeffect($file_path, $output_path);
    cartoonImage(70, 6, 1, 4, 100, 150, $output_path);
    toon($output_path);

}
else if ($_POST['action']=='editI'){
    $t=time();
  $sqlu="Update `item` set
        `item_category`='".mysqli_real_escape_string($con, $_POST['1'])."',
        `item_type`='".$_POST['2']."',  `item_name` ='".$_POST['3']."',
        `item_rate`='".mysqli_real_escape_string($con, $_POST['4'])."',
        `item_discount`='".$_POST['5']."',
        `item_description`='".mysqli_real_escape_string($con, $_POST['6'])."',
        `item_lowest_quantity`='".$_POST['7']."',
        `item_max_quantity`='".$_POST['8']."',
        `item_batch_quantity`='".$_POST['9']."',
        `item_measuring_metric`='".$_POST['10']."',
        `item_tag`='".$_POST['11']."',
        `item_profile_img`='".$_POST['13']."',
        `item_images`='".$_POST['12']."',
        `item_icons`='".$_POST['14']."',
        `item_points`='".$_POST['15']."',
        `last_updated`='".$t."' where `item_no`=".$_POST['0'];
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new item" . mysqli_error($con));
  if($rsu){ echo $_POST['callback'].'item Updated'; }
  }
else if($_POST['action'] =='deleteq'){
  $sqlu="Delete from `item`  where `item_no`=".$_POST['data'];
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error($con));
  if($rsu){echo $_POST['callback'].'Deleted';}
  else{echo $_POST['callback'].'Error Deleting item';}
}
else if($_POST['action'] =='addc'){
  $t=time();
  $sqlu="Insert into category values ( NULL, '".mysqli_real_escape_string($con, $_POST['title'])."','".mysqli_real_escape_string($con, $_POST['desc'])."', '', '".$t."', '".$t."')";
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Add new Category" . mysqli_error($con));
  $c_id = mysqli_insert_id();
  if($rsu){ echo $_POST['callback'].'Category Added';}
}
else if($_POST['action'] =='updatec'){
  $t=time();
  $sqlu="Update `category` set `category_title` ='".mysqli_real_escape_string($con, $_POST['c_name'])."', `category_descripiton`='".mysqli_real_escape_string($con, $_POST['c_desc'])."', `category_update`='$t' where `category_id`=".mysqli_real_escape_string($con, $_POST['c_id']);
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error($con));
  $c_id = mysqli_insert_id();
  if($rsu){}
}
else if($_POST['action'] =='deletec'){
  $sqlu="Delete from category  where `category_id`=".$_POST['data'];
  $rsu=mysqli_query($con, $sqlu) or die ("Error : could not Update Category" . mysqli_error($con));
  if($rsu){echo $_POST['callback'].'Deleted';}
  else{echo $_POST['callback'].'Error Deleting category';}
}
elseif ($_POST['action']=='getallc') {
  $a_json[0]=array('c_id' => '', 'c_name'=>'Select a category' );
  $sqlcheck = "SELECT category_id, category_title, category_descripiton FROM `category` order by category_id";
  $rescheck = mysqli_query($con, $sqlcheck) or die ("Error : could not Select category ". mysqli_error());;
  while($info= mysqli_fetch_array($rescheck)){
    $qobject = array('c_id' => $info[0], 'c_name'=>$info[1], 'c_desc'=>$info[2] );
    array_push($a_json, $qobject);
  }
  echo $_POST['callback'].json_encode($a_json);
}
else if($_POST['action']=='viewI'){

  //retrieve all the item's data
  $sqlQ = "SELECT * FROM `item` where item_no='".$_POST['data']."' ";
  $resQ=mysqli_query($con, $sqlQ) or die ("Error : could not Select category" . mysqli_error($con));;
  $infoQ= mysqli_fetch_array($resQ);

  //select the category name from the database//
  $sqlQc = "SELECT category_title FROM `category` where category_id='".$infoQ[1]."' ";
  $resQc=mysqli_query($con, $sqlQc) or die ("Error : could not Select category" . mysqli_error($con));
  $infoQc= mysqli_fetch_array($resQc);
  $a_json['item_data']= $infoQ;
  $a_json['category_name']=$infoQc[0];
  echo $_POST['callback'].json_encode($a_json);
}
else if($_POST['action']=='viewallI'){
  //retrieve all the Categories
  $a_json=array();
  $sqlCAT = "SELECT * FROM `category` order by `category_title` asc";
  $resCAT=mysqli_query($con, $sqlCAT) or die ("Error : could not Select Categories" . mysqli_error($con));
  while($infoCAT= mysqli_fetch_array($resCAT)){
    $a_sub_json['categoryname']= $infoCAT[1];
    $a_sub_json['items']=array();
    //select the item with the category_id//
    $sqlAQ = "SELECT * FROM `item` where `item_category` = $infoCAT[0] order by `item_no` asc";

    $resAQ=mysqli_query($con, $sqlAQ) or die ("Error : could not Select items" . mysqli_error($con));;
    while($infoAQ= mysqli_fetch_array($resAQ)){
      $qobject = array('i_id' => $infoAQ[0], 'i_title'=>$infoAQ[3] );

      array_push($a_sub_json['items'], $qobject);
    }

    array_push($a_json, $a_sub_json);
  }
 // print_r($a_json);
  echo $_POST['callback'].json_encode($a_json);
}
elseif ($_POST['action']=='getallqinc') {
  $a_json[0]=array('q_id' => '', 'q_text'=>'Select a item' );
  $sqlAQ = "SELECT * FROM `item` where `item_category` = '$data' order by `item_order` asc";
  $resAQ=mysqli_query($con, $sqlAQ) or die ("Error : could not Select items" . mysqli_error($con));
  while($infoAQ= mysqli_fetch_array($resAQ)){
    $qobject = array('q_id' => $infoAQ[0], 'q_text'=>$infoAQ[1] );
    array_push($a_json, $qobject);
  }
  echo $_POST['callback'].json_encode($a_json);
}
else{
    $sql='Select * from item  order by item_no Desc';
    $rs=mysqli_query($con, $sql) or die ("Error : could not Fetch items" . mysqli_error());
    $total_rows= mysqli_num_rows($rs);
    $info=mysqli_fetch_array($rs);
    $a_json['total_items']= $total_rows;
    $a_json['last_update']=gmdate("F j, Y, g:i a",$info[11]);
    echo $_POST['callback'].json_encode($a_json);
}

 ?>
