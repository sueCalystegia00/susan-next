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
      $verifyResult = $this->verifyLine($_GET["userIdToken"]);
      $userId = $verifyResult["sub"];
    }catch(Exception $error){
      $this -> code = 400;
      return ["error" => [
        "type" => "failed_to_verify_line", 
        "message" => $error->getMessage()
      ]];
    }

    switch($args[0]){
      // 学生か教員・TAか確認する
      case "position":
        return $this->checkUserPosition($userId);
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
   * DBからユーザが学生か，教員・TAであるか確認する
   * @param string $lineId LINEのユーザID
   * @return array 
   */
  private function checkUserPosition($lineId) {
    $db = new DB();
    $pdo = $db -> pdo();
    try{
      // 教員・TAか確認する
      $stmt1 = $pdo -> prepare(
        "SELECT COUNT(*)
        FROM `instructor_list` 
        WHERE LineId = :lineId"
      );
      $stmt1->bindValue(':lineId', $lineId, PDO::PARAM_STR);
      $res1 = $stmt1->execute();
  
      if(!$res1){
        throw new Exception('pdo not response (check instructor)');
      }else{
        if($stmt1->fetchColumn() > 0) return ["verifiedId" => $lineId, "position" => "instructor"];
      }

      // 教員・TAでなければ，学生(実験協力者)かどうか確認する
      $stmt2 = $pdo -> prepare(
        "SELECT COUNT(*)
        FROM `tester_list` 
        WHERE LineId = :lineId"
      );
      $stmt2->bindValue(':lineId', $lineId, PDO::PARAM_STR);
      // 実行
      $res2 = $stmt2->execute();
  
      if(!$res2){
        throw new Exception('pdo not response (check student)');
      }else{
        if($stmt2->fetchColumn() > 0) return ["verifiedId" => $lineId, "position" => "student"];
      }

      return ["verifiedId" => $lineId, "position" => "Non-experimenter"];
  
    } catch(PDOException $error){
      $this -> code = 500;
      return [
        "error" => [
          "type" => "pdo_exception",
          "message" => $error->getMessage()
        ],
        "verifiedId" => $lineId,
      ];
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
      $this -> code = 400;
      return ["error" => [
        "type" => $error["error"], 
        "message" => $error["error_description"]
      ]];
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
        }else{
          return $this->insertAcceptedUserData($userId, $post["answerList"]);
        }
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
  private function insertAcceptedUserData($lineId, $questionnaire) {
    $db = new DB();
    $pdo = $db -> pdo();

    try{
      // mysqlの実行文の記述
      $stmt = $pdo -> prepare(
        "INSERT INTO tester_list (LineId, Age, Gender)
        VALUES (:LineId, :Age, :Gender)"
      );
      //データの紐付け
      $stmt->bindValue(':LineId', $lineId, PDO::PARAM_STR);
      $stmt->bindValue(':Age', $questionnaire['Age'], PDO::PARAM_INT);
      $stmt->bindValue(':Gender', $questionnaire['Gender'], PDO::PARAM_STR);
      //$stmt->bindValue(':moodleFrequency', $questionnaire['moodleFrequency'], PDO::PARAM_INT);
      //$stmt->bindValue(':moodleReason', $questionnaire['moodleReason'], PDO::PARAM_STR);
      // 実行
      $res = $stmt->execute();
      $lastIndex = $pdo->lastInsertId();
      if($res){
        $this->code = 201;
        header("Location: ".$this->url.$lastIndex);
        return [];
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

    if(!array_key_exists("sub", $result)){
      throw new Exception($result["message"]);

    }else if(array_key_exists("error", $result)){
      throw new Exception($result["error_description"]);
    }
    return $result;
  }
}