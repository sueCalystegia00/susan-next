<?php

include(dirname( __FILE__)."/../envs/dbInfo.php"); //DBに接続するための情報

/**
 * データベースに接続するために利用する
 */
class DB
{
  /**
   * データベース操作用オブジェクトを返す
   * @return mixed PHP Data Objects
   */
  function pdo()
  {
    /**
     * @var string[] $db_setting intelephense(1006)対策用のdocコメント
     */
    global $db_setting;

    try{
      $driver_option = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,// カラム名をキーとする連想配列で取得する
      ];
      $pdo = new PDO($db_setting["dsn"],$db_setting["user"],$db_setting["password"],$driver_option);

    }catch(PDOException $error){
      error_log(print_r($error, true)."\n", 3, dirname( __FILE__).'/debug.log');
      header("Content-Type: application/json; charset=utf-8", true, 500);
      echo json_encode(["error" => ["type" => "server_error","message"=>$error->getMessage()]]);
      die();
    }
    
    return $pdo;
  }
}