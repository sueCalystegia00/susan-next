<?php
ini_set('display_errors',1);

class QuestionnairesController
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
    return [];
  }

  /**************************************************************************** */
  /**
   * POSTメソッド
   * @param array $args 追加情報のタイプ
   * @return array レスポンス
   */
  public function post($args) {
    $post = $this->request_body;
    if(!array_key_exists("userId",$post)){
      $this->code = 400;
      return ["error" => [
        "type" => "invalid_param"
      ]];
    }
    switch($args[0]){
      // 閲覧ログを記録する
      case "evaluation":
        if(!array_key_exists("answers",$post)){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else{
          return $this->insertEvaluationQuestionnaire($post["userId"], $post["answers"]);
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
   * 実験評価アンケートの回答をDBに追加
   * @param string $lineId ユーザのLINE固有id
   * @param array $questionnaire アンケートへの回答
   * @return array DB追加の成功/失敗
   */
  function insertEvaluationQuestionnaire($lineId, $questionnaire) {
    $db = new DB();
    $pdo = $db -> pdo();

    try{
      // mysqlの実行文の記述
      $stmt = $pdo -> prepare(
        "INSERT INTO evaluationQuestionnaire (LineId, FirstQuestion, FirstReason, SecondQuestion, SecondReason, ThirdQuestion, ThirdReason, FourthQuestion, FourthReason, FifthQuestion, FifthReason, SixthQuestion, SixthReason, SeventhQuestion, SeventhReason, EighthQuestion, EighthReason, goodPoint, improvementPoint, additionalFunction, AnyImpressions)
        VALUES (:LineId, :FirstQuestion, :FirstReason, :SecondQuestion, :SecondReason, :ThirdQuestion, :ThirdReason, :FourthQuestion, :FourthReason, :FifthQuestion, :FifthReason, :SixthQuestion, :SixthReason, :SeventhQuestion, :SeventhReason, :EighthQuestion, :EighthReason, :goodPoint, :improvementPoint, :additionalFunction, :AnyImpressions)"
      );
      //データの紐付け
      $stmt->bindValue(':LineId', $lineId, PDO::PARAM_STR);
      $stmt->bindValue(':FirstQuestion', $questionnaire['question1']["answers"]['licart'], PDO::PARAM_INT);
      $stmt->bindValue(':FirstReason', $questionnaire['question1']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':SecondQuestion', $questionnaire['question2']["answers"]['licart'], PDO::PARAM_INT);
      $stmt->bindValue(':SecondReason', $questionnaire['question2']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':ThirdQuestion', $questionnaire['question3']["answers"]['licart'], PDO::PARAM_INT);
      $stmt->bindValue(':ThirdReason', $questionnaire['question3']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':FourthQuestion', $questionnaire['question4']["answers"]['licart'], PDO::PARAM_INT);
      $stmt->bindValue(':FourthReason', $questionnaire['question4']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':FifthQuestion', $questionnaire['question5']["answers"]['licart'], PDO::PARAM_INT);
      $stmt->bindValue(':FifthReason', $questionnaire['question5']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':SixthQuestion', $questionnaire['question6']["answers"]['licart'], PDO::PARAM_INT);
      $stmt->bindValue(':SixthReason', $questionnaire['question6']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':SeventhQuestion', $questionnaire['question7']["answers"]['licart'], PDO::PARAM_INT);
      $stmt->bindValue(':SeventhReason', $questionnaire['question7']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':EighthQuestion', $questionnaire['question8']["answers"]['licart'], PDO::PARAM_INT);
      $stmt->bindValue(':EighthReason', $questionnaire['question8']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':goodPoint', $questionnaire['question9']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':improvementPoint', $questionnaire['question10']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':additionalFunction', $questionnaire['question11']["answers"]['text'], PDO::PARAM_STR);
      $stmt->bindValue(':AnyImpressions', $questionnaire['question12']["answers"]['text'], PDO::PARAM_STR);

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
  /**
   * PUTメソッド
   * @param array $args
   * @return array レスポンス
   */
  public function put($args) {
    return [];
  }

  /**************************************************************************** */
  /**
   * DELETEメソッド
   * @param array $args
   * @return array レスポンス
   */
  public function delete($args) {
    return [];
  }

  /**************************************************************************** */
  public function options(){
    header("Access-Control-Allow-Methods: OPTIONS,GET,HEAD,POST,PUT,DELETE");
    header("Access-Control-Allow-Headers: Content-Type");
    return [];
  }

  private function is_set($value){
    return !(is_null($value) || $value === "");
  }
}