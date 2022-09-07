<?php
ini_set('display_errors',1);

class ThreadsController
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
      // 質問に紐づくスレッドのやり取りを取得
      case "conversation":
        return $this->getThreadConversation($_GET['index']);
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
   * 質疑応答におけるスレッド内の会話を取得
   * @param int $questionIndex 質疑応答のインデックス
   * @return array スレッドの会話情報
   */
  private function getThreadConversation($questionIndex) {
    $db = new DB();

    try{
      // mysqlの実行文(各LINEid毎の最新メッセージを取得)
      $stmt = $db -> pdo() -> prepare(
        "SELECT `index`, `timestamp`, `SenderType`, `MessageType`, `MessageText`
        FROM `thread_conversation` 
        WHERE QuestionId = :QuestionId
        ORDER BY `thread_conversation`.`index`  ASC"
      );
      $stmt->bindValue(':QuestionId', $questionIndex, PDO::PARAM_INT);
      // 実行
      $res = $stmt->execute();
  
      if($res){
        $threadConversation = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $threadConversation;
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
   * @param array $args
   * @return array レスポンス
   */
  public function post($args) {
    $post = $this->request_body;
    switch($args[0]){
      // スレッドに新規テキストメッセージを追加
      case "message":
        if(!array_key_exists("index",$post) || 
          !array_key_exists("userId",$post) ||
          !array_key_exists("messageType",$post)||
          !array_key_exists("message",$post)
        ){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else{
          $insertResponse = $this->setChatMessageToThreadConversation($post["index"], $post["userId"], $post["messageType"], $post["message"]);
          if(array_key_exists("error",$insertResponse)){
            return $insertResponse;
          }
          $insertResponse["SenderType"] = $post["userType"];
          include("users.php");
          $usersController = new UsersController();
          $questioner = $usersController->getQuestionerLineId($post["index"]);
          return [
            "insertedData" => $insertResponse,
            "questioner" => $questioner["lineId"],
          ];
          
          /*if(!array_key_exists("error",$res)){
            // 教員側のメッセージの場合は学生へLINEのプッシュ通知を送る
            include dirname( __FILE__).'/../../../susan_bot/functions/PushMessages.php';
            if($post["userType"] == 'instructor') $res["line_bot"] = pushNewThreadMessageToStudent($post["index"], $post["messageType"], $post["isShared"], $post["message"]);
            // 教員へメール通知
            include dirname( __FILE__).'/../../../susan_bot/functions/CallbackToSusanPro.php';
            $payload = array('message' => $post["message"], 'index' => $post["index"]);
            $res["mail"] = sendEmailToInstructors("message", $payload);
            echo $res; 
            return $res;
          }else{
            return $res;
          }*/
        }
        break;
      
      // スレッドに画像を追加
      case "image":
        if(!isset($_POST['index']) || 
          !isset($_POST['userId'])
        ){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else if (!isset($_FILES['file']['error']) || !is_int($_FILES['file']['error'])) {
          // 未定義である・複数ファイルである・$_FILES Corruption 攻撃を受けた
          // どれかに該当していれば不正なパラメータとして処理する
          $this->code = 412;
          return ["error" => [
            "type" => "invalid_file"
          ]];
        }else{
          $response = $this->saveImageFile($_FILES);
          if(!array_key_exists('fileName',$response)){
            return $response;
          }
          $insertResponse = $this->setChatMessageToThreadConversation($_POST['index'], $_POST['userId'], 'image', $response['fileName']);
          if(array_key_exists("error",$insertResponse)){
            return $insertResponse;
          }
          $insertResponse["SenderType"] = $post["userType"];
          include("users.php");
          $usersController = new UsersController();
          $questioner = $usersController->getQuestionerLineId($post["index"]);
          return [
            "insertedData" => $insertResponse,
            "questioner" => $questioner["lineId"],
          ];
        }

      // 無効なアクセス
      default:
        $this -> code = 400;
        return ["error" => [
          "type" => "invalid_access"
        ]];
    }
  }

  /**
   * 質疑応答のスレッドにメッセージを追加する
   * @param int $questionIndex 質問ID
   * @param string $lineId 投稿者のLINE ID
   * @param string $messageType chat/answer
   * @param string $message
   */
  private function setChatMessageToThreadConversation($questionIndex, $lineId, $messageType, $message) {
    $db = new DB();
    $pdo = $db -> pdo();

    try{
      // mysqlの実行文の記述
      $stmt = $pdo -> prepare(
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
      $stmt->bindValue(':QuestionId', $questionIndex, PDO::PARAM_INT);
      $stmt->bindValue(':LineId', $lineId, PDO::PARAM_STR);
      $stmt->bindValue(':Sender', $lineId, PDO::PARAM_STR);
      $stmt->bindValue(':MessageType', $messageType, PDO::PARAM_STR);
      $stmt->bindValue(':MessageText', $message, PDO::PARAM_STR);
      
      // 実行
      $res = $stmt->execute();
      $lastIndex = $pdo->lastInsertId();
      $timestamp = date("Y-m-d H:i:s");
      if($res){
        $this->code = 201;
        //header("Location: ".$this->url.$lastIndex);
        return [
          "index" => $lastIndex,
          "timestamp" => $timestamp,
          //"SenderType" => "student", // TODO: DBから取得する(仮でpostの値を返した後に付け加えている)
          "MessageType" => $messageType,
          "MessageText" => $message
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

  private function saveImageFile($postedFiles){
    // バリデーション
    try {
      // $_FILES['upfile']['error'] の値を確認
      switch ($postedFiles['file']['error']) {
        case UPLOAD_ERR_OK: // OK
          break;
        case UPLOAD_ERR_NO_FILE:   // ファイル未選択
          throw new RuntimeException('No_file_selected');
        case UPLOAD_ERR_INI_SIZE:  // php.ini定義の最大サイズ超過
        case UPLOAD_ERR_FORM_SIZE: // フォーム定義の最大サイズ超過 (設定した場合のみ)
          throw new RuntimeException('File_size_too_large');
        default:
          throw new RuntimeException('Unexpected_Error');
      }

      // ここで定義するサイズ上限のオーバーチェック(50MB)
      // (必要がある場合のみ)
      if ($postedFiles['file']['size'] > 50000000) {
        throw new RuntimeException('File_size_too_large');
      }

      // $_FILES['upfile']['mime']の値はブラウザ側で偽装可能なので
      // MIMEタイプに対応する拡張子を自前で取得する
      if (!$extension = array_search(
        mime_content_type($postedFiles['file']['tmp_name']),
        array(
          'gif' => 'image/gif',
          'jpg' => 'image/jpeg',
          'png' => 'image/png',
        ),
        true
      )) {
        throw new RuntimeException('Incorrect_file_format.');
      }

      // ファイルデータからSHA-1ハッシュを取ってファイル名を決定し保存する(ディレクトリ・トラバーサル対策)
      if (!move_uploaded_file(
        $postedFiles['file']['tmp_name'],
        $path = sprintf('/home/suzuki/public_html/susan/upload_images/%s.%s',
          sha1_file($postedFiles['file']['tmp_name']),
          $extension
        )
      )) {
        throw new RuntimeException('An_error_occurred_while_saving_the_file');
      }

      // ファイルのパーミッションを確実に0644に設定する
      chmod($path, 0644);

      $this->code = 201;
      return ["fileName" => preg_replace("/\/home\/suzuki\/public_html/", "/~suzuki", $path, 1)];

    } catch (RuntimeException $e) {
      $this -> code = 412;
      return ["error" => [
        "type" => "RuntimeException",
        "message" => $e->getMessage()
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
}