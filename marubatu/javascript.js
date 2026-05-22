// 先行のマーク○
const FIRST_MARK = '〇';
// 後攻のマーク×
const NEXT_MARK = '×';
// ターン数
let count = 1;

// マス目のIDリスト
const IDS = [
    ['b1', 'b2', 'b3'],
    ['b4', 'b5', 'b6'],
    ['b7', 'b8', 'b9']
];

// クリックされた最新のマスを覚えておく変数
let lastClickedId = null;

// ゲーム実行中のフラグ
let isRun = true;

// IDからオブジェクトを取得する関数
function $(id) {
    return document.getElementById(id);
}

// 先行のターンかどうかを判定する関数
function isFirstMove() {
    let isFirst = count % 2;
    // isFirstが1のときはTrue、0のときはFalseを返す
    return isFirst == 1;
}

// ターン表示を切り替える関数
function changeDisplayCount() {
    // undoボタンを有効にする(色を戻す)
    document.getElementById('undo').style.opacity = "1";

    if (isFirstMove()) {
        // 先行のターンの場合
        $('display-count').innerHTML = '<span style="color:#f03939;">' + FIRST_MARK + '</span>' + 'の番</span>';
    } else {
        // 後攻のターンの場合
        $('display-count').innerHTML = '<span style="color:#2049ee;">' + NEXT_MARK + '</span>' + 'の番</span>';
    }
}

// 試合終了を判定する
function judgeEnd() {
    let isEnd = false;

    // 横3マスが同じマークかを判定する
    for (let row=0; row<3; row++) {
        // 勝敗を判定する
        isEnd = isWin(IDS[row][0], IDS[row][1], IDS[row][2]);
        // 勝利したマークの色を変える
        if (isEnd) {
            // 勝利した3つのIDを取得
            let winnerIds = [IDS[row][0], IDS[row][1], IDS[row][2]];

            // 勝利した3つのマス目を光らせる
            winnerIds.forEach(id => {
                let el = $(id);
                // 指定したマス目に光るクラスを追加
                el.classList.add('winner-block');
            });

            // まずボタン要素を取得
            let cell = $(IDS[row][0]);
            // その中の span からマークを取得する
            let mark = cell.querySelector('span').textContent;
            let color = (mark == FIRST_MARK) ? '#f03939' : '#2049ee';

            displayResult('<span style="color:' + color + ';">' + mark + '</span>の勝ち！');
            return true;
        }
    }
    // 縦3マスが同じマークかを判定する
    for (let col=0; col<3; col++) {
        // 勝敗を判定する
        isEnd = isWin(IDS[0][col], IDS[1][col], IDS[2][col]);
        // 勝利したマークの色を変える
        if (isEnd) {
            // 勝利した3つのIDを取得
            let winnerIds = [IDS[0][col], IDS[1][col], IDS[2][col]];

            // 勝利した3つのマス目を光らせる
            winnerIds.forEach(id => {
                let el = $(id);
                // 指定したマス目に光るクラスを追加
                el.classList.add('winner-block');
            });

            // まずボタン要素を取得
            let cell = $(IDS[0][col]);
            // その中の span からマークを取得する
            let mark = cell.querySelector('span').textContent;
            let color = (mark == FIRST_MARK) ? '#f03939' : '#2049ee';

            displayResult('<span style="color:' + color + ';">' + mark + '</span>の勝ち！');
            return true;
        }
    }
    // 斜め3マスが同じマークかを判定する(右下がり)
    isEnd = isWin(IDS[0][0], IDS[1][1], IDS[2][2]);
    // 勝利したマークの色を変える
    if (isEnd) {
        // 勝利した3つのIDを取得  
        let winnerIds = [IDS[0][0], IDS[1][1], IDS[2][2]];

        // 勝利した3つのマス目を光らせる
        winnerIds.forEach(id => {
            let el = $(id);
            // 指定したマス目に光るクラスを追加
            el.classList.add('winner-block');
        });

        // まずボタン要素を取得
        let cell = $(IDS[0][0]);
        // その中の span からマークを取得する
        let mark = cell.querySelector('span').textContent;
        let color = (mark == FIRST_MARK) ? '#f03939' : '#2049ee';

        displayResult('<span style="color:' + color + ';">' + mark + '</span>の勝ち！');
        return true;
    }
    // 斜め3マスが同じマークかを判定する(右上がり)
    isEnd = isWin(IDS[0][2], IDS[1][1], IDS[2][0]);
    // 勝利したマークの色を変える
    if (isEnd) {
        // 勝利した3つのIDを取得
        let winnerIds = [IDS[0][2], IDS[1][1], IDS[2][0]];

        // 勝利した3つのマス目を光らせる
        winnerIds.forEach(id => {
            let el = $(id);
            // 指定したマス目に光るクラスを追加
            el.classList.add('winner-block');
        });

        // まずボタン要素を取得
        let cell = $(IDS[0][2]);
        // その中の span からマークを取得する
        let mark = cell.querySelector('span').textContent;
        let color = (mark == FIRST_MARK) ? '#f03939' : '#2049ee';

        displayResult('<span style="color:' + color + ';">' + mark + '</span>の勝ち！');
        return true;
    }
    // 引き分けの判定
    if (count >= 9) {
        displayResult('引き分け！');
        return true;
    }

    // ゲームが続行する場合はfalseを返す
    return false;
}

// 勝敗を判定する
function isWin(firstId, secondId, thirdId) {
    // それぞれのボタンの中の span の文字を取得する
    let firstMark  = $(firstId).querySelector('span').textContent;
    let secondMark = $(secondId).querySelector('span').textContent;
    let thirdMark  = $(thirdId).querySelector('span').textContent;

    // 1つ目のマス目が空の場合は終了する
    if (firstMark == '') return false;
    // 2つ目のマス目が空の場合は終了する
    if (secondMark == '') return false;
    // 3つ目のマス目が空の場合は終了する
    if (thirdMark == '') return false;

    // 3つのマス目が同じマークの場合は勝利
    if (firstMark == secondMark && secondMark == thirdMark) return true;
    // 3つのマス目が同じマークじゃない場合は勝利ではない
    return false;
}

// 勝敗の結果を表示する
function displayResult(message) {
    $('display-result').innerHTML = message;
    isRun = false;

    // もう一度遊ぶボタンを表示する
    $('reset').style.display = '';
    // undoボタンを非表示にする
    $('undo').style.display = 'none';
}

// クリックされた時の処理
function clickAction(event) {
    // ゲーム実行中でなければ何もせずに終了
    if (!isRun) return;

    // イベントからクリックされたマス目のIDを取得
    let id = event.target.id;
    // IDからオブジェクトを取得
    let object = $(id);

    // クリックされたマスのIDを記憶
    lastClickedId = id;

    // すでにマークが設定されている場合はスキップ
    if (object.value != '') return;

    //　オブジェクト(マス目)にマークを設定する
    if (isFirstMove()) {
        // 先行の処理
        let span = object.querySelector('span');
        span.textContent = FIRST_MARK;
    
        // アニメーションを一度リセットしてから再実行
        span.classList.remove('mark-appear-red');
        void span.offsetWidth; // これを書かないと、2回目以降動かないことがある  
        // クラスを追加してアニメーション開始！
        span.classList.add('mark-appear-red', 'text-red');
    } else {
        // 後攻の処理
        let span = object.querySelector('span');
        span.textContent = NEXT_MARK;
        
        // アニメーションを一度リセットしてから再実行
        span.classList.remove('mark-appear-blue');
        void span.offsetWidth; // これを書かないと、2回目以降動かないことがある
        // クラスを追加してアニメーション開始！
        span.classList.add('mark-appear-blue', 'text-blue');
    }

    // ゲーム終了を判定する
    if (judgeEnd()) return;

    // ターン数を増やす
    count++;
    // ターン表示を切り替える
    changeDisplayCount();
}

// 画面を読み込んだ時の処理
function onloadAction() {
    // マス目にイベントを設定する
    for (let row=0; row < 3; row++) {
        for (let col=0; col<3; col++) {
            $(IDS[row][col]).onclick = clickAction;
        }
    }

    // undoボタンにイベントを設定する
    $('undo').onclick = undoAction;

    // もう一度遊ぶボタンにイベントを設定する
    $('reset').onclick = resetAction;

    // リセットアクションを実行
    resetAction();
}

// undoボタンがクリックされた時の処理
function undoAction() {
    // undoができるのは1ターンに1回のみ
    if (lastClickedId == null) return;

    // ターン数が1以下のときはundoできない(初手先攻が置いた後でないとundoできない)
    if (count <= 1) return;

    // span要素そのものを取得する
    let span = $(lastClickedId).querySelector('span');
    // 文字を空にする
    span.textContent = '';

    // span要素からクラスを削除する
    span.classList.remove(
        'mark-appear-red', 'mark-appear-blue', 
        'text-red', 'text-blue', 
        'mark-reset'
    );
    lastClickedId = null;

    // ターン数を減らし、先攻後攻を設定し直す
    count--;
    changeDisplayCount();

    // undoボタンを無効にする(色を薄くする)
    document.getElementById('undo').style.opacity = "0.5";
}

// もう一度遊ぶボタンがクリックされた時の処理
function resetAction() {
    // ターンを1に戻す
    count = 1;
    changeDisplayCount();

    // マス目を空にする
    for (let row=0; row<3; row++) {
        for (let col=0; col<3; col++) {
            let cell = $(IDS[row][col]);
            // buttonに含まれているspanの中身を空にする
            let span = cell.querySelector('span');
            if (span) {
                // マークをリセットするクラスを追加してアニメーション開始！
                span.classList.remove('mark-appear-red', 'mark-appear-blue');
                void span.offsetWidth;
                span.classList.add('mark-reset');

                // アニメーション時間（0.6s）に合わせて文字を消す
                setTimeout(() => {
                    // マークを消す
                    span.textContent = '';
                    // アニメーションを削除
                    span.classList.remove('mark-reset', 'text-red', 'text-blue');
                    cell.classList.remove('winner-block');
                }, 600);
            }
        }
    }

    // 結果の表示をリセットする
    displayResult('');

    //　ゲームを実行中に戻す
    isRun = true;

    // もう一度遊ぶボタンを非表示にする
    $('reset').style.display = 'none';
    // undoボタンを表示する
    $('undo').style.display = '';
}

// 画面読み込み時のイベントを設定
window.onload = onloadAction;