# 🕊SUSAN-NEXT

講義における学生の質問行動を促進する授業支援チャットボットシステム SUSANbot

旧システムのリファクタリング版

# 🎬DEMO

- そのうち載せる

# 📝Features

LINE ボットを介して質問を匿名投稿ができ，ユーザが投稿した全質問を閲覧可能．

教員もこのシステムから回答することができる．

# 💫Requirement

### Developing Environment

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### LINE bot

www2 サーバーの PHP バージョンが 5.6 なので対応できるバージョンに \
(ライブラリ内の NULL 合体演算子などを直さないといけない箇所もある)

- [LINEbot SDK](https://github.com/line/line-bot-sdk-php): 7.0
- [Dialogflow](https://cloud.google.com/dialogflow/es/docs): 0.19.1

### LIFF(web application)

- [Next.js](https://nextjs.org/): 12.1.6
- [LIFF](https://developers.line.biz/ja/docs/liff/overview/)": 2.20.1
- [LIFF mock](https://github.com/line/liff-mock): 1.0.1
- axios: 0.27.2

# ⚙️Installation

そのうち追記...

# 🙋🏻‍♂️Author

- 作成者: 鈴木 舜也
- 所属: 和歌山大学大学院 吉野研究室
- E-mail: suzuki.shunya@g.wakayama-u.jp

# 🪪License

"SUSANbot" is Confidential.
