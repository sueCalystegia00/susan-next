<?php
ini_set('display_errors',1);

class QuestionsController
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
    switch($args[0]){
      // 指定のインデックスから最新30件の質疑応答情報を取得
      case "list":
        return $this->getQuestionsData($_GET['startIndex']);
        break;
      
      // 指定のインデックスの質疑応答情報を1件取得
      case is_numeric($args[0]):
        return $this->getSelectedQuestionData($args[0]);
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
   * 指定のインデックスを起点に最新30件の質疑応答情報を取得する
   * TODO: LINEbotから呼び出せるようにpublicだが，privateにしておきたい
   * @param int $startIndex 質疑応答情報のインデックス
   * @return array 質問データ
   */
  public function getQuestionsData($startIndex) {
    if($startIndex == 0) $startIndex = 99999;
    $db = new DB();

    try{
      // mysqlの実行文
      $stmt = $db -> pdo() -> prepare(
        "SELECT `index`,`timestamp`,`lectureNumber`,`questionText`,`answerText`,`broadcast`,`intentName`
        FROM `Questions`
        WHERE `index` < :startIndex
        ORDER BY `Questions`.`index` DESC
        LIMIT 30"
      );
      //データの紐付け
      $stmt->bindValue(':startIndex', $startIndex, PDO::PARAM_INT);
      // 実行
      $res = $stmt->execute();
  
      if($res){
        //$questions = $stmt->fetchAll(PDO::FETCH_ASSOC|PDO::FETCH_UNIQUE);
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $questions;
      }else{
        $this -> code = 500;
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

  /**
   * 指定のインデックスの質疑応答情報を取得する
   * @param int $index 質疑応答情報のインデックス
   */
  private function getSelectedQuestionData($index) {
    $db = new DB();

    try{
      // mysqlの実行文
      $stmt = $db -> pdo() -> prepare(
        "SELECT `index`,`timestamp`,`lectureNumber`,`questionText`,`answerText`,`broadcast`,`intentName`
        FROM `Questions`
        WHERE `index` = :QuestionIndex"
      );
      //データの紐付け
      $stmt->bindValue(':QuestionIndex', $index, PDO::PARAM_INT);
      // 実行
      $res = $stmt->execute();
  
      if($res){
        $question = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!empty($question)){
          return $question[0];
        }else{ //指定したインデックスの質問が存在しない場合
          $this->code = 404;
          return ["error" => [
            "type" => "not_in_sample"
          ]];
        }
      }else{
        $this -> code = 500;
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
   * POSTメソッド
   * @param array $args 追加情報のタイプ
   * @return array レスポンス
   */
  public function post($args) {
    $post = $this->request_body;
    switch($args[0]){
      // 閲覧ログを記録する
      case "view_log":
        if(!array_key_exists("userId",$post) || !array_key_exists("index",$post)){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else{
          return $this->insertQuestionViewLog($post["userId"], $post["index"]);
        }
        break;
      
      // 質問者とユーザが一致するか
      case "questioner":
        if(!array_key_exists("userId",$post) || !array_key_exists("index",$post)){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else{
          return $this->checkIsYourQuestion($post["index"], $post["userId"]);
        }
        break;

      case "new-question":
        if(!array_key_exists("userId",$post) || !array_key_exists("question",$post)){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else{
          return $this->insertQuestionData($post["userId"], $post["question"]);
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
   * 質疑LIFFページの閲覧ログの追加
   * @param string $lineId ユーザのLINE固有id
   * @param int $questionIndex 閲覧した質疑応答情報のインデックス
   * @return array DB追加の成功/失敗
   */
  private function insertQuestionViewLog($lineId, $questionIndex) {
    $db = new DB();
    $pdo = $db -> pdo();

    try{
      // mysqlの実行文の記述
      // 指定されたインデックスの質問が存在しない場合はMySQL#1048エラー
      $stmt = $pdo -> prepare(
        "INSERT INTO question_views (lineId, questionIndex, isQuestioner)
        VALUES (
          :LineId, 
          (SELECT `index` FROM `Questions` WHERE `index` = :questionIndex), 
          (SELECT COUNT(*) FROM `Questions` WHERE `index`=:questionIndex AND `questionerId` = :lineId)
        )"
      );
      //データの紐付け
      $stmt->bindValue(':lineId', $lineId, PDO::PARAM_STR);
      $stmt->bindValue(':questionIndex', $questionIndex, PDO::PARAM_INT);
      
      // 実行
      $res = $stmt->execute();
      $lastIndex = $pdo->lastInsertId();
      if($res){
        $this->code = 201;
        //header("Location: ".$this->url.$lastIndex);
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

  /**
   * 質問がアクセスしたユーザが投稿したものかチェックする
   * @param int $index 質問のインデックス
   * @param string $lineId ユーザID
   * @return array
   */
  private function checkIsYourQuestion($index, $lineId){
    $db = new DB();
  
    try{
      // mysqlの実行文(テーブルに指定のLINE IDが存在するかのみチェック)
      $stmt = $db -> pdo() -> prepare(
        "SELECT COUNT(*)
        FROM `Questions` 
        WHERE `index`=:questionIndex AND `QuestionerLineId` = :lineId"
      );
      $stmt->bindValue(':questionIndex', $index, PDO::PARAM_STR);
      $stmt->bindValue(':lineId', $lineId, PDO::PARAM_STR);
      // 実行
      $res = $stmt->execute();
  
      if($res){
        return ["isQuestioner" => $stmt->fetchColumn() > 0];
      
      }else{
        $this -> code = 500;
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
    return [];
  }

  /**
   * 新規の質問をDBに登録する (LINEbotからも呼び出せるようにpublic)
   * TODO:なんとかしてprivateにしたい
   * @param string $userId 質問者のLINEid
   * @param string $question_text 質問文
   * @return array 結果
   */
  public function insertQuestionData($userId, $questionText) {
    $db = new DB();
    $pdo = $db -> pdo();

    try{
      // mysqlの実行文の記述
      $stmtQA = $pdo -> prepare(
        "INSERT INTO Questions (questionerId, questionText)
        VALUES (:questionerId, :questionText)"
      );
      //データの紐付け
      $stmtQA->bindValue(':questionerId', $userId, PDO::PARAM_STR);
      $stmtQA->bindValue(':questionText', $questionText, PDO::PARAM_STR);
      
      // 実行
      $resQA = $stmtQA->execute();
      $lastIndexQA = $pdo->lastInsertId();
      if(!$resQA){
        $this->code = 500;
        return ["error" => [
          "type" => "pdo_not_response",
          "message" => "fail to insert to Q&A Database"
        ]];
      }

      // mysqlの実行文の記述
      $stmtThread = $pdo -> prepare(
        "INSERT INTO thread_conversation (QuestionId, SenderType, Sender, MessageType, MessageText)
        VALUES (
          :QuestionId, 
          (SELECT IF( EXISTS(
            SELECT `LineId`
            FROM `instructor_list`
            WHERE `LineId` = :LineId), 
            'instructor', 'student') as 'SenderType'),
          :Sender, 
          :MessageType, 
          :MessageText
        )"
      );
      //データの紐付け
      $stmtThread->bindValue(':QuestionId', $lastIndexQA, PDO::PARAM_INT);
      $stmtThread->bindValue(':LineId', $userId, PDO::PARAM_STR);
      $stmtThread->bindValue(':Sender', $userId, PDO::PARAM_STR);
      $stmtThread->bindValue(':MessageType', "chat", PDO::PARAM_STR);
      $stmtThread->bindValue(':MessageText', $questionText, PDO::PARAM_STR);
      
      // 実行
      $resThread = $stmtThread->execute();
      $lastIndexThread = $pdo->lastInsertId();

      if(!$resThread){
        $this->code = 500;
        return ["error" => [
          "type" => "pdo_not_response",
          "message" => "fail to insert to Thread Database"
        ]];
      }

      $this->code = 201;
      header("Location: ".$this->url.$lastIndexQA);
      return [
        "QAIndex" => $lastIndexQA,
        "ThreadIndex" => $lastIndexThread
      ];

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
   * @param array $args [questionIndex, case]
   * @return array レスポンス
   */
  public function put($args) {
    if(!$this->is_set($args[0])){ //質問のインデックスが指定されていない
      $this->code = 400;
      return ["error" => [
        "type" => "invalid_url"
      ]];
    }
    $payload = $this->request_body;
    switch($args[1]){
      case "answer":
        if(!array_key_exists("questionText",$payload)||
          !array_key_exists("answerText",$payload)||
          !array_key_exists("broadcast",$payload)||
          !array_key_exists("intentName",$payload)
        ){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else{
          return $this->updateAnswer((int)$args[0], (int)$payload["broadcast"], $payload["questionText"], $payload["answerText"], $payload["intentName"]);
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
   * 質問に対する回答情報を更新する
   * @param int $questionIndex 更新する質疑応答情報のインデックス
   * @param int $broadcast 1:全体通知/0:個別通知
   * @param string $questionText 修正後の質問文
   * @param string $answerText 質問に対する応答文
   * @param string $intentName Dialogflowに登録されているインテント名(Format: projects/<Project ID>/agent/intents/<Intent ID>)
   * @return array DB更新結果 || エラーメッセージ
   */
  private function updateAnswer($questionIndex, $broadcast, $questionText, $answerText, $intentName) {
    $db = new DB();
    try{
      // mysqlの実行文
      $stmt = $db->pdo() -> prepare(
        "UPDATE `Questions`
        SET `broadcast` = :broadcast,
            `questionText` = :questionText,
            `answerText` = :answerText,
            `intentName` = :intentName
        WHERE `Questions`.`index` = :questionIndex"
      );
      //データの紐付け
      $stmt->bindValue(':questionIndex', $questionIndex, PDO::PARAM_INT);
      $stmt->bindValue(':broadcast', $broadcast, PDO::PARAM_INT);
      $stmt->bindValue(':questionText', $questionText, PDO::PARAM_STR);
      $stmt->bindValue(':answerText', $answerText, PDO::PARAM_STR);
      $stmt->bindValue(':intentName', $intentName, PDO::PARAM_STR);
      
      // 実行
      $res = $stmt->execute();
      if($res){
        $this->code = 201;
        return [
          "index" => $questionIndex,
          "broadcast" => $broadcast,
          "questionText" => $questionText,
          "answerText" => $answerText,
          "intentName" => $intentName
        ];
      }else{
        $this->code = 500;
        return ["error" => [
          "type" => "pdo_not_response",
          "update_param" => [
            "index" => $questionIndex,
            "broadcast" => $broadcast,
            "question" => $questionText,
            "answer" => $answerText,
            "intentName" => $intentName
          ],
          "pdo" => $res
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
  public function options(){
    header("Access-Control-Allow-Methods: OPTIONS,GET,HEAD,POST,PUT,DELETE");
    header("Access-Control-Allow-Headers: Content-Type");
    return [];
  }

  private function is_set($value){
    return !(is_null($value) || $value === "");
  }
}