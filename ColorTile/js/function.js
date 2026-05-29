// 難易度によってタイルの数が変わる
const levels = {
    easy:  { size: 5, empty: 9,  color: 3 },
    normal:{ size: 6, empty: 10, color: 4 },
    hard:  { size: 7, empty: 17, color: 5 }
}
// 色一覧
const colors = [
    "#FF4F50", "#3399FF", "#33CC33", "#FFFF77", "#CC99FF"
];

// タイル用配列を用意(ゲームの状態)
const table = [];
// タイル用配列を用意(ゲームの見た目)
const tiles = [];
// スコア用の変数
let score = 0;
// ゲーム実行中かどうか　結果が出たタイミングでfalseにする
let isRun = true;


// ゲームの初期化関数(タイル作成など)
function initGame(levelKey) {
    // 選ばれた難易度の設定を取得
    const config = levels[levelKey];
    // ゲームコンテナを取得
    const container = document.getElementsByClassName('tile-container')[0];

    // 前のタイルを全部削除
    container.innerHTML = "";
    table.length = 0;
    tiles.length = 0;

    // コンテナのCSSを難易度に合わせて更新(JavaScriptからCSSを変更)
    container.style.gridTemplateColumns = `repeat(${config.size}, 60px)`;

    // タイルを生成
    for (let y = 0; y < config.size; y++) {    
        table[y] = [];
        tiles[y] = [];

        for (let x = 0; x < config.size; x++) {
            // <div class="tile"></div>を生成して、コンテナに追加
            const tile = document.createElement('div');
            tile.className = 'tile';

            // クリックイベントを追加
            tile.addEventListener('click', () => {
                openTile(levelKey, x, y);
            });

            container.appendChild(tile);

            table[y][x] = 0;
            tiles[y][x] = tile;
        }
    }
}

// 空白マスをセット
function setEmpties(levelKey) {
    // 選ばれた難易度の設定を取得
    const config = levels[levelKey];

    for (let i = 0; i < config.empty; i++) {
        // 0からmax-1までのランダムな値を返す
        const x = Math.floor(Math.random() * config.size);
        const y = Math.floor(Math.random() * config.size);

        // 空白がすでにセットされていればcontinue
        if (table[y][x] == -1) {
            i--;
            continue;
        }
        // 空白マスには-1を格納
        table[y][x] = -1;
    }
}

// 空白でない全てのマスに、色をランダムにセットする
function initTable(levelKey) {
    // 選ばれた難易度の設定を取得
    const config = levels[levelKey];

    for (let y = 0; y < config.size; y++) {
        for (let x = 0; x < config.size; x++) {
            // もし空白がセットされていなかったら、色を付ける
            if (table[y][x] != -1) {
                // 色をランダムに選ぶ
                const color = Math.floor(Math.random() * config.color);
                // 色をセットする
                table[y][x] = color;
                tiles[y][x].style.backgroundColor = colors[color];
            }
        }
    }
}


// 難易度選択の後、ゲーム開始
function startGame(levelKey) {
    // 説明と難易度設定をアニメーションでフェードアウト
    const explanation = document.querySelector('.explanation');
    const difficulty = document.querySelector('.difficulty');
    explanation.classList.add('hide');
    difficulty.classList.add('hide');

    setTimeout(() => {
        // ヘッダーを変更し、説明・難易度設定を非表示にする
        document.getElementById('header').textContent = '空いているマスをクリック！';
        document.getElementsByClassName('explanation')[0].style.display = 'none';
        document.getElementsByClassName('difficulty')[0].style.display = 'none';
        // ゲーム画面を表示
        document.getElementsByClassName('game-container')[0].style.display = 'block';
    }, 500); // アニメーションの0.5秒後に実行

    // 難易度に応じたタイルを生成
    initGame(levelKey);
    // 空白をセット
    setEmpties(levelKey);
    // 空白でない全てのマスに、色をランダムにセットする
    initTable(levelKey);

    // リセットボタンにイベントを設定する
    document.getElementById("reset").onclick = function() {
        resetAction(levelKey);
    };
    // ホームボタンにイベントを設定する
    document.getElementById("home-button").onclick = function() {
        backHome();
    };
}


// 上下左右の、空白マス以外の座標を保存
function openTile(levelKey, x, y) {
    // ゲーム終了後は何もせずに終わる
    if (!isRun) return;

    // 選ばれた難易度の設定を取得
    const config = levels[levelKey];

    // 空白マス以外をクリックしても、何も起きないようにする
    if (table[y][x] != -1) {
        return;
    }

    // クリックしたマスから、上下左右の最も近いタイルの色を格納する配列(-2で初期化)
    const color = [-2, -2, -2, -2];
    // 上下左右のタイルの色を格納する配列(縦:上下左右, 横:x,y座標)
    const coordinate = [
        [-1, -1],
        [-1, -1],
        [-1, -1],
        [-1, -1]
    ];

    // クリックしたマスの上方向を確認
    for (let i = y-1; i >= 0; i--) {
        // 空白マス以外のマスがあった場合は、座標を記録
        if (table[i][x] != -1) {
            color[0] = table[i][x];
            coordinate[0][0] = x;
            coordinate[0][1] = i;
            break;
        }
    }
    // クリックしたマスの下方向を確認
    for (let i = y+1; i < config.size; i++) {
        // 空白マス以外のマスがあった場合は、座標を記録
        if (table[i][x] != -1) {
            color[1] = table[i][x];
            coordinate[1][0] = x;
            coordinate[1][1] = i;
            break;
        }
    }
    // クリックしたマスの左方向を確認
    for (let i = x-1; i >= 0; i--) {
        // 空白マス以外のマスがあった場合は、座標を記録
        if (table[y][i] != -1) {
            color[2] = table[y][i];
            coordinate[2][0] = i;
            coordinate[2][1] = y;
            break;
        }
    }
    // クリックしたマスの右方向を確認
    for (let i = x+1; i < config.size; i++) {
        // 空白マス以外のマスがあった場合は、座標を記録
        if (table[y][i] != -1) {
            color[3] = table[y][i];
            coordinate[3][0] = i;
            coordinate[3][1] = y;
            break;
        }
    }

    // タイルを開けられるかどうか判定し、開けられるならば開ける
    checkOpenTile(color, coordinate);

    // リザルトの要素を見つけて、変数に格納
    const resultText = document.getElementById("result")
    // 全て空白マスになったらクリア
    if (checkWinCondition(levelKey) == true) {
        resultText.textContent = 'ゲームクリア！スコアは' + score + 'です！';
        resultText.style.display = 'block';
        isRun = false;
        return;
    }
    // タイルを開けなくなったらゲームオーバー
    if (checkGameOverCondition(levelKey) == true) {
        resultText.textContent = 'ゲームオーバー！スコアは' + score + 'です！';
        resultText.style.display = 'block';
        isRun = false;
        return;
    }
}

// 上下左右のマスの色を判定し、タイルを開ける
function checkOpenTile (color, coordinate) {
    // 初期化した変数を用意
    let baseColor = -2;
    // 1つ以上マスの色が一致したとき、trueにする
    let foundSame = false;

    // 色があるマスを基準に判定
    for (let j = 0; j < 4; j++) {
        foundSame = false;
        // 色が格納されていないとき
        if (color[j] == -2) continue;

        // マスの色を取り出す
        baseColor = color[j];
        // 次のマス(j+1)からみていく
        for (let i = j+1; i < 4; i++) {
            // マスに色があるかつ、baseColorと同じならタイルを開く
            if ((color[i] != -2) && (color[i] == baseColor)) {
                table[coordinate[i][1]][coordinate[i][0]] = -1;
                tiles[coordinate[i][1]][coordinate[i][0]].style.backgroundColor = '';
                score++;
                foundSame = true;
                // マッチしたタイルの色は-2にして、以降のループで処理されないようにする
                color[i] = -2;
            }
        }
        // １つ以上マスの色が一致しとき、基準にしたタイルも開ける
        if (foundSame) {
            table[coordinate[j][1]][coordinate[j][0]] = -1;
            tiles[coordinate[j][1]][coordinate[j][0]].style.backgroundColor = '';
            score++;
            // マッチしたタイルの色は-2にして、以降のループで処理されないようにする
            color[j] = -2;
        }
    }
    console.log(score);
}

// 勝ち負けを判定
function checkWinCondition (levelKey) {
    // 選ばれた難易度の設定を取得
    const config = levels[levelKey];

    for (let j = 0; j < config.size; j++) {
        for (let i = 0; i < config.size; i++) {
            // 空白マス以外があった場合は-1を返す
            if (table[j][i] != -1) {
                return false;
            }
        }
    }
    // 全て空白マスなら1を返す
    return true;
}

// 消せる組がなければゲームオーバー
function checkGameOverCondition (levelKey) {
    // 選ばれた難易度の設定を取得
    const config = levels[levelKey];

    for (let j = 0; j < config.size; j++) {
        for (let i = 0; i < config.size; i++) {
            // 空白マス以外の場合は戻る
            if (table[j][i] != -1) continue;

            // 上下左右の最も近いタイルの色を格納する配列(-2で初期化)
            const color = [-2, -2, -2, -2];

            // 上
            for (let k = j-1; k >= 0; k--) {
                // 空白マス以外があった場合
                if (table[k][i] != -1) {
                    color[0] = table[k][i];
                    break;
                }
            }
            // 下
            for (let k = j+1; k < config.size; k++) {
                // 空白マス以外があった場合
                if (table[k][i] != -1) {
                    color[1] = table[k][i];
                    break;
                }
            }
            // 左
            for (let k = i-1; k >= 0; k--) {
                // 空白マス以外があった場合
                if (table[j][k] != -1) {
                    color[2] = table[j][k];
                    break;
                }
            }
            // 右
            for (let k = i+1; k < config.size; k++) {
                // 空白マス以外があった場合
                if (table[j][k] != -1) {
                    color[3] = table[j][k];
                    break;
                }
            }

            // 同じ色が2つ以上あればゲーム継続
            for (let l = 0; l < 4; l++) {
                for (let k = l+1; k < 4; k++) {
                    if ((color[l] != -2) && (color[k] == color[l])) {
                        // 消せる組があればfalseを返す
                        return false;
                    }
                }
            } 
        }
    }
    // 空白マスがあるかつ、消せる組がないためゲームオーバー
    return true;
}

// リセットボタンの処理
function resetAction(levelKey) {
    // 選ばれた難易度の設定を取得
    const config = levels[levelKey];

    // 色の情報を消す
    for (let j = 0; j < config.size; j++) {
        for (let i = 0; i < config.size; i++) {
            table[j][i] = -2;
            tiles[j][i].style.backgroundColor = "";
        }
    }
    // スコアもリセット
    score = 0;
    //　ゲームを実行中に戻す
    isRun = true;

    // 空白をセット
    setEmpties(levelKey);
    // 空白でない全てのマスに、色をランダムにセットする
    initTable(levelKey);

    // リザルトの要素を見つけて、変数に格納
    const resultText = document.getElementById("result")
    resultText.style.display = 'none';

    return;
}

// ホームボタンの処理
function backHome() {
    // ヘッダーを元に戻す
    document.getElementById('header').textContent = "次はどの難易度で遊びますか？";

    // ゲーム画面を取得
    const gameContainer = document.querySelector('.game-container');
    // フェードアウトアニメーションを追加
    gameContainer.classList.add('hide');

    setTimeout(() => {
        // ゲーム画面を消す
        document.getElementsByClassName('game-container')[0].style.display = 'none';
        // 次回用に hide を外す
        gameContainer.classList.remove('hide');

        // 説明画面を表示
        const explanation = document.querySelector('.explanation');
        const difficulty = document.querySelector('.difficulty');
        explanation.style.display = 'block';
        difficulty.style.display = 'block';

        // フェードイン
        explanation.classList.remove('hide');
        difficulty.classList.remove('hide');

        // リザルトの要素を見つけて、変数に格納
        const resultText = document.getElementById("result")
        resultText.style.display = 'none';
    }, 500); // アニメーションの0.5秒後に実行

    // スコアリセット
    score = 0;
    //　ゲームを実行中に戻す
    isRun = true;

    return;
}