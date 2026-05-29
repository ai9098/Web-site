# ColorTile
HTML・CSS・JavaScriptを用いて作成したパズルゲームです。
授業課題として作成したJavaプログラムをもとに、Webアプリとして再実装しました。
UIは授業内で配布された雛型を参考にしていますが、タイル探索アルゴリズムやゲームロジックは自分で実装しています。

## Demo
https://ai9098.github.io/Web-site/ColorTile/

## Features
- 同じ色のタイルを探索して削除
- スコア機能
- 盤面リセット機能
- ゲームクリア / ゲームオーバー判定

## Technologies Used
- HTML
- CSS
- JavaScript

## Folder Structure
❯ tree -a -I "node_modules|.next|.git|.pytest_cache|static" -L 2
ColorTile/ 
├── index.html 
├── css 
    └── style.css
├── js 
    └── function.js 
└── java-original/
