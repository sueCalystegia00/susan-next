<?php
ini_set('display_errors',1);
require dirname( __FILE__).'/../../vendor/autoload.php';

use Google\Cloud\Dialogflow\V2\AgentsClient;
use Google\Cloud\Dialogflow\V2\EntityTypesClient;
use Google\Cloud\Dialogflow\V2\IntentsClient;
use Google\Cloud\Dialogflow\V2\SessionEntityTypesClient;
use Google\Cloud\Dialogflow\V2\SessionsClient;
use Google\Cloud\Dialogflow\V2\QueryInput;
use Google\Cloud\Dialogflow\V2\QueryParameters;
use Google\Cloud\Dialogflow\V2\TextInput;
use Google\Cloud\Dialogflow\V2\QueryResult;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\FieldMask;
use Google\Rpc\Status;
use Google\Protobuf\Struct;
use Google\Protobuf\Internal\MapField;
use Google\Protobuf\Value;
use Google\Cloud\Dialogflow\V2\DetectIntentResponse;
use Google\Cloud\Dialogflow\V2\Context;
use Google\Cloud\Dialogflow\V2\Intent;
use Google\ApiCore\PagedListResponse;
use Google\Cloud\Dialogflow\V2\Intent\Message;
use Google\Cloud\Dialogflow\V2\Intent\Message\Text;
use Google\Cloud\Dialogflow\V2\Intent\TrainingPhrase;
use Google\Cloud\Dialogflow\V2\Intent\TrainingPhrase\Part;
use Google\Cloud\Dialogflow\V2\Intent\Parameter;
use GPBMetadata\Google\Cloud\Dialogflow\V2\Context as V2Context;

class DialogflowController
{
  public $code = 200;
  public $url;
  public $request_body;

  /**
   * @var Google\Cloud\Dialogflow\V2\IntentsClient
   */
  public $intentsClient;
  /**
   * @var string DialogflowのプロジェクトID
   */
  public $projectId;

  function __construct()
  {
    $this->url = (empty($_SERVER['HTTPS']) ? 'http://' : 'https://').$_SERVER['HTTP_HOST'].mb_substr($_SERVER['SCRIPT_NAME'],0,-9).basename(__FILE__, ".php")."/";
    $this->request_body = json_decode(mb_convert_encoding(file_get_contents('php://input'),"UTF8","ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN"),true);
    // サービスアカウントパスとプロジェクトIDを設定
    include(dirname( __FILE__)."/../../../Config/dialogflowInfo.php");
    $this->intentsClient = new IntentsClient($dialogflow_config);
    $this->projectId = $dialogflow_config['projectId'];
  }

  /**************************************************************************** */
  /**
   * GETメソッド
   * @param array $args
   * @return array レスポンス
   */
  public function get($args) {
    switch($args[0]){
      // インテントのリストを表示する
      case "list":
        return $this->getIntentListFromDialogflow();
        break;
      
      case "trainingPhrases":
        if(!array_key_exists("intentName",$_GET)){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else{
          return $this->getIntentTrainingPhrases($_GET['intentName']);
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
   * 全インテントを出力
   */
  private function getIntentListFromDialogflow(){
    $intentList = array();
    try {
      $formattedParent = $this->intentsClient->agentName($this->projectId);
      $pagedResponse = $this->intentsClient->listIntents($formattedParent);
      foreach ($pagedResponse->iteratePages() as $page) {
        foreach ($page as $element) {
          $intentList[] = [
            "intentDisplayName" => $element->getDisplayName(),
            "intentName" => $element->getName()
          ];
        }
      }
      echo json_encode($intentList); //連想配列をjsonにして吐き出す
    } finally {
      $this->intentsClient->close();
    }
  }

  /**
   * 指定されたインテントに登録されているトレーニングフレーズを取得
   * @param string $intentName Format: projects/<Project ID>/agent/intents/<Intent ID>
   * @return string[]
   */
  private function getIntentTrainingPhrases($intentName){
    try {
      // 既存インテントの取得(オプションでintentViewを設定することでIntentオブジェクトのまま取得できる)
      $intent = $this->intentsClient->getIntent($intentName, [
        'intentView' => IntentView::INTENT_VIEW_FULL
      ]);
      
      // 登録済みのトレーニングデータを取得
      $phraseTexts = array();
      foreach($intent->getTrainingPhrases() as $trainingPhrase){
        foreach($trainingPhrase->getParts() as $trainingPhrasePart){
          $phraseTexts[] = $trainingPhrasePart->getText();
        }
      }
      $response = array_slice($phraseTexts, 1); // １つ目はもとの質問文なので省く
  
    } catch(Exception $error){
      $this -> code = 500;
      return ["error" => [
        "message" => $error
      ]];
  
    } finally {
      $this->intentsClient->close();
    }
    return $response;
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
      case "response":
        if(!array_key_exists("index",$post)||
          !array_key_exists("trainingPhrases",$post)||
          !array_key_exists("responseText",$post)
        ){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else{
          // インテント登録名(formatted: 00XX_questionText)
          $intentDisplayName = sprintf("%'.04d\n", $post["index"])."_".mb_substr($post["trainingPhrases"][0], 0, 11, "UTF-8");
          if(!$this->is_set($post["intentName"])){
            return $this->createIntent($post["index"], $intentDisplayName, $post["trainingPhrases"], $post["responseText"]);
          }else{
            return $this->updateIntent($post["index"], $post["intentName"], $intentDisplayName, $post["trainingPhrases"], $post["responseText"]);
          }
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
   * Dialogflowにインテントを新規登録し，作成したインテントのintentNameを返す
   * @param string $intentDisplayName 作成するインテントの表示名
   * @param array $trainingPhrases インテント発火条件となる学習フレーズ
   * @param string $answerText インテント発火時に返す応答文
   * @return array 作成したインテントのintentName(Format: projects/<Project ID>/agent/intents/<Intent ID>)
   */
  private function createIntent($questionIndex, $intentDisplayName, $trainingPhrases, $answerText) {
    try {
      $formattedParent = $this->intentsClient->agentName($this->projectId);
      $intent = new Intent();

      // インテント名を設定
      $intent->setDisplayName($intentDisplayName);
      // 親インテントに「質問」のインテント(QuestionStart)を設定
      $intent->setParentFollowupIntentName('projects/susanbotdialogflowagent-u9qh/agent/intents/fd08e1fd-e40a-42b6-ab9d-61fef96db07e');
      // 「質問」インテントの直後のみに反応するようにコンテキストを設定
      $intent->setInputContextNames(['projects/susanbotdialogflowagent-u9qh/agent/sessions/-/contexts/QuestionStart-followup']);
      // アウトプットコンテキストを設定
      $outputContext = new Context();
      $outputContext->setName('projects/susanbotdialogflowagent-u9qh/agent/sessions/-/contexts/SendAutoAnswer');
      $outputContext->setLifespanCount(1);
      $intent->setOutputContexts([$outputContext]);

      // トレーニングフレーズ(インテントが反応するセリフ例)を設定
      $trainingPhraseSets = array();
      // 反応する文章を作成
      foreach($trainingPhrases as $Phrase){
        $part = new Part();
        $part->setText($Phrase);
        // トレーニングデータをPartの配列として作成
        $trainingPhrase = new TrainingPhrase();
        $trainingPhrase->setType(1); // 1:サンプルモード["](推奨)，2:テンプレートモード[@]
        $trainingPhrase->setParts([$part]);

        $trainingPhraseSets[] = $trainingPhrase;
      }
      // インテントにトレーニングデータを設定
      $intent->setTrainingPhrases($trainingPhraseSets);

      // アクションの設定
      $intent->setAction("AnswerToTheQuestion");

      $paramOriginQuestion = new Parameter();
      $paramOriginQuestion->setDisplayName("originQuestion");
      $paramOriginQuestion->setValue($trainingPhrases[0]);
      $paramQuestionIndex = new Parameter();
      $paramQuestionIndex->setDisplayName("questionIndex");
      $paramQuestionIndex->setValue($questionIndex);
      $intent->setParameters([$paramOriginQuestion, $paramQuestionIndex]);

      // 返答テキストの作成
      $responseText = new Text();
      $responseText->setText([$answerText]);
      // テキストを返答メッセージに設定
      $message = new Message();
      $message->setText($responseText);
      // インテントに返答を設定
      $intent->setMessages([$message]);

      $createdIntent = $this->intentsClient->createIntent($formattedParent, $intent);
      $intentName = $createdIntent->getName();

      $this -> code = 201;
      return ["intentName" => $intentName];

    } catch(Exception $error){
      $this -> code = 500;
      return ["error" => [
        "type" => "dialogflow_exception",
        "message" => $error
      ]];

    } finally {
      $this->intentsClient->close();
    }
  }

  /**************************************************************************** */
  /**
   * PUTメソッド
   * @param array $args
   * @return array レスポンス
   */
  /* public function put($args) {
    $payload = $this->request_body;
    if(!array_key_exists("intentName",$payload)){
      $this->code = 400;
      return ["error" => [
        "type" => "invalid_param"
      ]];
    }

    switch($args[0]){
      case "response":
        if(!array_key_exists("index",$payload)||
          !array_key_exists("trainingPhrases",$payload)||
          !array_key_exists("responseText",$payload)
        ){
          $this->code = 400;
          return ["error" => [
            "type" => "invalid_param"
          ]];
        }else{
          // インテント登録名(formatted: 00XX_questionText)
          $intentDisplayName = sprintf("%'.04d\n", $payload["index"])."_".mb_substr($payload["trainingPhrases"][0], 0, 11, "UTF-8");
          return $this->updateIntent($payload["intentName"], $intentDisplayName, $payload["trainingPhrases"], $payload["responseText"]);
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
   */

  /**
   * Dialogflowの既存インテントを更新する
   * @param string $intentName 更新するインテントのintentName(Format: projects/<Project ID>/agent/intents/<Intent ID>)
   * @param string $intentDisplayName 作成するインテントの表示名
   * @param array $trainingPhrases インテント発火条件となる学習フレーズ
   * @param string $responseText インテント発火時に返す応答文
   * @return array 作成したインテントのintentName(Format: projects/<Project ID>/agent/intents/<Intent ID>)
   */
  private function updateIntent($questionIndex, $intentName, $intentDisplayName, $trainingPhrases, $responseText){
    try {
      $this->intentsClient->deleteIntent($intentName);
      return $this->createIntent($questionIndex, $intentDisplayName, $trainingPhrases, $responseText);

    } catch(Exception $error){
      $this -> code = 500;
      return ["error" => [
        "type" => "intent_exception",
        "error" => $error
      ]];

    } finally {
      $this->intentsClient->close();
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