<?php
ini_set('display_errors',1);

class UsersController
{
  public $code = 200;
  public $url;
  public $request_body;

  function __construct()
  {
    $this->url = (empty($_SERVER['HTTPS']) ? 'http://' : 'https://').$_SERVER['HTTP_HOST'].mb_substr($_SERVER['SCRIPT_NAME'],0,-9).basename(__FILE__, ".php")."/";
    $this->request_body = json_decode(mb_convert_encoding(file_get_contents('php://input'),"UTF8","ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN"),true);
  }

  /**************************************************************************** */
  /**
   * GETメソッド
   * @param array $args
   * @return array レスポンス
   */
  public function get($args) {
    if(!array_key_exists("userIdToken",$_GET)){
      $this->code = 400;
      return ["error" => [
        "type" => "invalid_param"
      ]];
    }
    try{
      $userId = $this->verifyLine($_GET["userIdToken"])["sub"];
      $res = $this->getUserInfo($userId);
      return $res;
    }catch(Exception $error){
      $this -> code = $error->getCode() || 500;
      return json_decode($error->getMessage(),true);
    }
  }

  /**
   * DBからユーザ情報を取得する
   * @param string $userUid LINEのユーザID
   * @return array 
   */
  public function getUserInfo($userUid) {
    $db = new DB();
    $pdo = $db -> pdo();
    try{
      // 教員・TAか確認する
      $stmt = $pdo -> prepare(
        "SELECT *
        FROM `Users` 
        WHERE userUid = :userUid"
      );
      $stmt->bindValue(':userUid', $userUid, PDO::PARAM_STR);
      $res = $stmt->execute();
  
      if($res){
        $user = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
        if($user){
          return $user;
        }else{ //存在しない場合
          throw new Exception(json_encode(["message" => "user not found"]), 404);
        }
      }else{
        throw new Exception(json_encode(["message" => "pdo not response"]), 500);
      }
    } catch(PDOException $error){
      if($error->getMessage()["message"] == "user not found"){
        throw new Exception(json_encode( ["error" => [
          "type" => "not_in_sample"
        ]]), 404);
      }else{
        throw new Exception(json_encode( ["error" => [
            "type" => "pdo_exception",
            "message" => json_decode($error->getMessage()),
          ],
          "verifiedId" => $userUid,]), 500);
      }
    }
  }

  /**
   * 質問者のLINE IDを取得する
   * @param int $questionId 質問ID
   * @return string 質問者のLINE ID
   */
  public function getQuestionerLineId($questionIndex){
    $db = new DB();
    $pdo = $db -> pdo();
    
    try{
      // mysqlの実行文
      $stmt = $pdo -> prepare(
        "SELECT questionerId
        FROM `Questions` 
        WHERE `Questions`.`index` = :questionId"
      );
      //データの紐付け
      $stmt->bindValue(':questionId', $questionIndex, PDO::PARAM_INT);
      // 実行
      $res = $stmt->execute();

      if(!$res){
        throw new Exception('pdo not response');
      }else{
        $questionerId = $stmt->fetchAll(PDO::FETCH_COLUMN)[0];
        return [ "lineId" => $questionerId ];
      }
    } catch(PDOException $error){
      $this -> code = 500;
      return [
        "error" => [
          "type" => "pdo_exception",
          "message" => $error->getMessage()
        ],
      ];
    } finally{
      //echo "finally!!";
    } 
  }


  /**************************************************************************** */
  /**
   * POSTメソッド
   * @param array $args
   * @return array レスポンス
   */
  public function post($args) {
    $post = $this->request_body;
    if(!array_key_exists("userIdToken",$post)){
      $this->code = 400;
      return ["error" => [
        "type" => "invalid_param"
      ]];
    }
    try{
      $verifyResult = $this->verifyLine($post["userIdToken"]);
      $userId = $verifyResult["sub"];
    }catch(Exception $error){
      $this -> code = $error->getCode() || 500;
      return ["error" => json_decode($error->getMessage(),true)];
    }

    switch($args[0]){
      // 学生を実験協力者としてDBのリストに追加する
      case "new_subject":
        // パラメータの存在確認
        if(!array_key_exists("answerList",$post)){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }
        return $this->insertAcceptedUserData($userId, $post["name"], $post["type"], $post["canAnswer"], $post["age"], $post["gender"]);
        break;

      // 無効なアクセス
      default:
        $this -> code = 400;
        return ["error" => [
          "type" => "invalid_access"
        ]];
    }
  }

  /**
   * 実験同意者のリストにユーザを追加
   * @param string $lineId ユーザのLINE固有id
   * @param array $questionnaire アンケートへの回答
   * @return array $result DB追加の成功/失敗
   */
  private function insertAcceptedUserData($lineId, $name, $userType, $canAnswer, $age, $gender) {
    $db = new DB();
    $pdo = $db -> pdo();

    try{
      // mysqlの実行文の記述
      $stmt = $pdo -> prepare(
        "INSERT INTO Users (userUid, name, type, canAnswer, age, gender)
        VALUES (:userUid, :name, :type, :canAnswer, :age, :gender)"
      );
      //データの紐付け
      // TODO: php7
      $stmt->bindValue(':userUid', $lineId, PDO::PARAM_STR);
      $stmt->bindValue(':name', $name, PDO::PARAM_STR);
      $stmt->bindValue(':type', $userType, PDO::PARAM_STR);
      $stmt->bindValue(':canAnswer', $canAnswer, PDO::PARAM_INT);
      $stmt->bindValue(':age', $age, PDO::PARAM_INT);
      $stmt->bindValue(':gender', $gender , PDO::PARAM_STR);
      // 実行
      $res = $stmt->execute();
      $lastIndex = $pdo->lastInsertId();
      if($res){
        $this->code = 201;
        //header("Location: ".$this->url.$lastIndex);
        return [
          "userUid" => $lineId,
          "type" => $userType,
          "canAnswer" => $canAnswer,
        ];
      }else{
        $this->code = 500;
        return ["error" => [
          "type" => "pdo_not_response"
        ]];
      }

    } catch(PDOException $error){
      $this -> code = 500;
      return ["error" => [
        "type" => "pdo_exception",
        "message" => $error
      ]];
    }
  }



  /**************************************************************************** */
  public function options()
  {
    header("Access-Control-Allow-Methods: OPTIONS,GET,HEAD,POST,PUT,DELETE");
    header("Access-Control-Allow-Headers: Content-Type");
    return [];
  }

  private function is_set($value)
  {
    return !(is_null($value) || $value === "");
  }

  public function verifyLine($id_token){
    //  Initiate curl session
    $ch = curl_init();

    $url = 'https://api.line.me/oauth2/v2.1/verify';

    $data = [
      'id_token' => $id_token, // LIFFから送信されたIDトークン
      'client_id' => file_get_contents(dirname( __FILE__).'/../../../envs/line_client_id.txt'), // LIFFアプリを登録したLINEログインチャネルのチャネルID
    ];

    // Set the url
    curl_setopt($ch, CURLOPT_URL, $url);
    // Will return the response, if false it prints the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));

    // Execute the session and store the contents in $response
    $response = curl_exec($ch);
    // Closing the session
    curl_close($ch);

    $result = json_decode($response, true);

    if(array_key_exists("error", $result)){
      throw new Exception(json_encode($result), 400);
    }else if(!array_key_exists("sub", $result)){
      throw new Exception(json_encode($result), 400);
    }
    return $result;
  }
}